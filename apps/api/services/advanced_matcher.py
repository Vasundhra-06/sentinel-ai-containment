import io
import os
import cv2
import numpy as np
from PIL import Image, ImageOps
import imagehash
import hashlib
import torch
import torchvision.transforms as transforms
import torchvision.models as models

class AdvancedMediaMatcher:
    CALIBRATION_VERSION = "v2.0-geom"

    _embedding_model = None
    _transform = None

    @classmethod
    def _get_embedding_model(cls):
        if cls._embedding_model is None:
            # Use lightweight mobilenet_v3_small for fast CPU embedding extraction
            try:
                model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
            except Exception:
                model = models.mobilenet_v3_small(pretrained=True)
            model.classifier = torch.nn.Identity() # output feature vector
            model.eval()
            cls._embedding_model = model
            cls._transform = transforms.Compose([
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])
        return cls._embedding_model, cls._transform

    @staticmethod
    def decode_and_normalize(image_bytes: bytes):
        """Safely decodes image bytes, fixes EXIF orientation, and returns normalized PIL and cv2 images."""
        pil_img = Image.open(io.BytesIO(image_bytes))
        pil_img = ImageOps.exif_transpose(pil_img) # fix rotation
        if pil_img.mode != "RGB":
            pil_img = pil_img.convert("RGB")
        
        cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        return pil_img, cv_img

    @staticmethod
    def compute_sha256(data_bytes: bytes) -> str:
        return hashlib.sha256(data_bytes).hexdigest()

    @staticmethod
    def compute_perceptual_hashes(pil_img: Image.Image):
        return {
            "phash": str(imagehash.phash(pil_img)),
            "dhash": str(imagehash.dhash(pil_img)),
            "ahash": str(imagehash.average_hash(pil_img)),
        }

    @staticmethod
    def extract_regional_tiles(pil_img: Image.Image):
        """Extracts multi-scale overlapping tiles for crop-resistant matching."""
        w, h = pil_img.size
        tiles = {}
        # Quadrants (60% coverage each for overlap)
        tiles["top_left"] = pil_img.crop((0, 0, int(w * 0.65), int(h * 0.65)))
        tiles["top_right"] = pil_img.crop((int(w * 0.35), 0, w, int(h * 0.65)))
        tiles["bottom_left"] = pil_img.crop((0, int(h * 0.35), int(w * 0.65), h))
        tiles["bottom_right"] = pil_img.crop((int(w * 0.35), int(h * 0.35), w, h))
        # Center crop (60%)
        tiles["center_60"] = pil_img.crop((int(w * 0.2), int(h * 0.2), int(w * 0.8), int(h * 0.8)))
        # 30% corner patches
        tiles["corner_tl_30"] = pil_img.crop((0, 0, int(w * 0.35), int(h * 0.35)))
        tiles["corner_br_30"] = pil_img.crop((int(w * 0.65), int(h * 0.65), w, h))
        
        tile_hashes = {name: str(imagehash.phash(tile)) for name, tile in tiles.items()}
        return tile_hashes

    @classmethod
    def compute_embedding(cls, pil_img: Image.Image) -> np.ndarray:
        model, transform = cls._get_embedding_model()
        tensor = transform(pil_img).unsqueeze(0)
        with torch.no_grad():
            feat = model(tensor).squeeze().numpy()
        norm = np.linalg.norm(feat)
        if norm > 0:
            feat = feat / norm
        return feat

    @staticmethod
    def verify_geometry_usac(cv_query, cv_ref):
        """
        Executes robust pairwise geometric verification using SIFT + USAC-MAGSAC.
        Handles low-texture images and degenerate configurations explicitly.
        """
        sift = cv2.SIFT_create(nfeatures=1500)
        kp_q, des_q = sift.detectAndCompute(cv_query, None)
        kp_r, des_r = sift.detectAndCompute(cv_ref, None)

        if des_q is None or des_r is None or len(des_q) < 4 or len(des_r) < 4:
            return {
                "status": "INSUFFICIENT_KEYPOINTS",
                "inlier_count": 0,
                "inlier_ratio": 0.0,
                "reprojection_error": 0.0,
                "spatial_coverage": 0.0,
                "homography_matrix": None,
                "bounding_box": None,
                "is_match": False,
                "reason": "Image has low gradient/texture or severe crop lacking sufficient spatial keypoints (<4)."
            }

        bf = cv2.BFMatcher(cv2.NORM_L2)
        matches = bf.knnMatch(des_q, des_r, k=2)

        good = []
        for m, n in matches:
            if m.distance < 0.75 * n.distance:
                good.append(m)

        if len(good) < 4:
            return {
                "status": "LOW_MATCH_COUNT",
                "inlier_count": len(good),
                "inlier_ratio": 0.0,
                "reprojection_error": 0.0,
                "spatial_coverage": 0.0,
                "homography_matrix": None,
                "bounding_box": None,
                "is_match": False,
                "reason": f"Only {len(good)} candidate descriptor matches found (minimum 4 required for homography)."
            }

        src_pts = np.float32([kp_q[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
        dst_pts = np.float32([kp_r[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)

        H, mask = cv2.findHomography(src_pts, dst_pts, cv2.USAC_MAGSAC, 5.0)

        if H is None or mask is None:
            return {
                "status": "DEGENERATE_TRANSFORM",
                "inlier_count": 0,
                "inlier_ratio": 0.0,
                "reprojection_error": 0.0,
                "spatial_coverage": 0.0,
                "homography_matrix": None,
                "bounding_box": None,
                "is_match": False,
                "reason": "USAC-MAGSAC could not estimate a non-degenerate planar homography matrix."
            }

        inliers = int(np.sum(mask))
        inlier_ratio = round(inliers / len(good), 3) if len(good) > 0 else 0.0

        # Calculate bounding box in reference coordinates
        h_q, w_q = cv_query.shape[:2]
        corners_q = np.float32([[0, 0], [w_q, 0], [w_q, h_q], [0, h_q]]).reshape(-1, 1, 2)
        try:
            corners_r = cv2.perspectiveTransform(corners_q, H)
            bbox = [[float(pt[0][0]), float(pt[0][1])] for pt in corners_r]
        except Exception:
            bbox = None

        # Reprojection error estimate for inliers
        inlier_src = src_pts[mask.ravel() == 1]
        inlier_dst = dst_pts[mask.ravel() == 1]
        if len(inlier_src) > 0:
            projected = cv2.perspectiveTransform(inlier_src, H)
            reproj_err = round(float(np.mean(np.linalg.norm(projected - inlier_dst, axis=2))), 2)
        else:
            reproj_err = 0.0

        # Spatial coverage of inliers in query image
        if len(inlier_src) >= 3:
            hull = cv2.convexHull(inlier_src)
            hull_area = cv2.contourArea(hull)
            spatial_coverage = round(hull_area / (w_q * h_q), 3)
        else:
            spatial_coverage = 0.0

        # Calibrated geometric decision: at least 7 inliers, inlier ratio >= 0.45, reproj err <= 4.0
        is_geometric_match = (inliers >= 7 and inlier_ratio >= 0.45 and reproj_err <= 4.5)

        return {
            "status": "VERIFIED_HOMOGRAPHY" if is_geometric_match else "GEOMETRY_REJECTED",
            "inlier_count": inliers,
            "inlier_ratio": inlier_ratio,
            "reprojection_error": reproj_err,
            "spatial_coverage": spatial_coverage,
            "homography_matrix": [[round(float(val), 4) for val in row] for row in H],
            "bounding_box": bbox,
            "is_match": is_geometric_match,
            "reason": f"USAC-MAGSAC verified {inliers}/{len(good)} inliers (ratio {inlier_ratio}, reproj error {reproj_err}px)."
        }

    @classmethod
    def compare_candidate_to_reference(
        cls,
        candidate_bytes: bytes,
        reference_bytes: bytes,
        reference_tile_hashes: dict = None,
        reference_embedding: np.ndarray = None
    ) -> dict:
        """
        Executes complete multi-signal comparison across:
        1. Exact SHA-256
        2. Global Perceptual Hash (pHash, dHash, aHash)
        3. Regional / Tile Perceptual Hash
        4. Deep Feature Embedding Cosine Similarity
        5. SIFT + USAC-MAGSAC Pairwise Geometric Verification
        """
        cand_sha = cls.compute_sha256(candidate_bytes)
        ref_sha = cls.compute_sha256(reference_bytes)

        cand_pil, cand_cv = cls.decode_and_normalize(candidate_bytes)
        ref_pil, ref_cv = cls.decode_and_normalize(reference_bytes)

        # 1. Exact match check
        exact_match = (cand_sha == ref_sha)

        # 2. Global Hashes
        cand_hashes = cls.compute_perceptual_hashes(cand_pil)
        ref_hashes = cls.compute_perceptual_hashes(ref_pil)

        phash_cand = imagehash.hex_to_hash(cand_hashes["phash"])
        phash_ref = imagehash.hex_to_hash(ref_hashes["phash"])
        global_phash_dist = int(phash_cand - phash_ref)

        # 3. Regional / Tile Matching
        if reference_tile_hashes is None:
            reference_tile_hashes = cls.extract_regional_tiles(ref_pil)

        min_tile_dist = 64
        matched_tile_name = None
        for t_name, t_hex in reference_tile_hashes.items():
            t_hash = imagehash.hex_to_hash(t_hex)
            d = int(phash_cand - t_hash)
            if d < min_tile_dist:
                min_tile_dist = d
                matched_tile_name = t_name

        # 4. Deep Feature Embedding
        cand_emb = cls.compute_embedding(cand_pil)
        if reference_embedding is None:
            reference_embedding = cls.compute_embedding(ref_pil)
        
        cosine_sim = float(np.dot(cand_emb, reference_embedding))
        cosine_sim = round(max(0.0, min(1.0, cosine_sim)), 3)

        # 5. Local Geometric Homography Verification
        geom = cls.verify_geometry_usac(cand_cv, ref_cv)

        # Multi-signal decision calibration
        reasons = []
        if exact_match:
            overall_match = True
            rec_state = "VERIFIED_RELATED"
            visual_score = 100.0
            reasons.append("Exact cryptographic SHA-256 match.")
        elif geom["is_match"]:
            overall_match = True
            rec_state = "VERIFIED_RELATED"
            visual_score = round(92.0 + min(6.0, geom["inlier_count"] * 0.3), 1)
            reasons.append(f"USAC-MAGSAC verified planar homography with {geom['inlier_count']} inliers (ratio {geom['inlier_ratio']}).")
        elif min_tile_dist <= 6 and cosine_sim >= 0.70:
            overall_match = True
            rec_state = "VERIFIED_RELATED"
            visual_score = round(85.0 + (10 - min_tile_dist) * 1.0, 1)
            reasons.append(f"Regional tile match on '{matched_tile_name}' (distance {min_tile_dist}) with strong embedding alignment ({cosine_sim}).")
        elif min_tile_dist <= 10 or (geom["inlier_count"] >= 4 and geom["inlier_ratio"] >= 0.35) or global_phash_dist <= 10:
            overall_match = False
            rec_state = "REVIEW_REQUIRED"
            visual_score = round(74.0 + (10 - min(global_phash_dist, min_tile_dist)) * 1.0, 1)
            reasons.append(f"Candidate shares visual features (tile dist {min_tile_dist}, geom inliers {geom['inlier_count']}); manual review required.")
        else:
            overall_match = False
            rec_state = "UNRELATED"
            visual_score = round(max(10.0, 50.0 - min_tile_dist), 1)
            reasons.append(f"Perceptual hash distance ({global_phash_dist}), tile distance ({min_tile_dist}), and geometric checks show no correlation.")

        signals = {
            "exact_sha256": exact_match,
            "global_phash_distance": global_phash_dist,
            "regional_tile_min_distance": min_tile_dist,
            "regional_matched_tile": matched_tile_name,
            "embedding_cosine_similarity": cosine_sim,
            "geometry_usac": geom,
            "hashes": {
                "candidate": cand_hashes,
                "reference": ref_hashes
            }
        }

        return {
            "overall_match": overall_match,
            "recommended_state": rec_state,
            "visual_similarity": visual_score,
            "signals": signals,
            "calibration_version": cls.CALIBRATION_VERSION,
            "reasons": reasons
        }
