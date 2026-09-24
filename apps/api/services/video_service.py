import io
import os
import cv2
import numpy as np
from PIL import Image
import imagehash
from typing import List, Dict, Any, Optional
from services.advanced_matcher import AdvancedMediaMatcher

class VideoAnalysisService:
    """
    Bounded video decoding and temporal frame-level matching engine.
    Supports video-to-image, screenshot-to-video, and excerpt-to-reference matching.
    """
    MAX_FRAMES_BOUND = 60 # Bounded CPU processing
    FRAME_SAMPLE_INTERVAL_SEC = 1.0 # 1 frame per second periodic sampling

    @classmethod
    def sample_frames_from_video(cls, video_path: str, max_duration_sec: float = 60.0) -> List[Dict[str, Any]]:
        """
        Samples frames with exact timestamps and deduplicates redundant static frames.
        """
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return []

        fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
        duration_sec = total_frames / fps if fps > 0 else 0.0

        sample_stride = max(1, int(fps * cls.FRAME_SAMPLE_INTERVAL_SEC))
        
        frames = []
        frame_idx = 0
        last_phash = None

        while cap.isOpened() and len(frames) < cls.MAX_FRAMES_BOUND:
            ret, frame = cap.read()
            if not ret:
                break

            msec = cap.get(cv2.CAP_PROP_POS_MSEC)
            sec = msec / 1000.0

            if sec > max_duration_sec:
                break

            if frame_idx % sample_stride == 0:
                # Convert cv2 frame to JPEG bytes for processing
                _, buf = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
                frame_bytes = buf.tobytes()

                # Deduplicate redundant consecutive frames using pHash
                pil_frame = Image.open(io.BytesIO(frame_bytes))
                current_phash = imagehash.phash(pil_frame)

                is_duplicate = False
                if last_phash is not None and (current_phash - last_phash) <= 3:
                    is_duplicate = True

                if not is_duplicate:
                    frames.append({
                        "frame_index": frame_idx,
                        "timestamp_ms": round(msec, 1),
                        "timestamp_sec": round(sec, 2),
                        "frame_bytes": frame_bytes,
                        "phash": str(current_phash),
                        "width": frame.shape[1],
                        "height": frame.shape[0]
                    })
                    last_phash = current_phash

            frame_idx += 1

        cap.release()
        return frames

    @classmethod
    def match_video_against_reference(
        cls,
        video_path: str,
        reference_bytes: bytes,
        min_consistent_frames: int = 2
    ) -> Dict[str, Any]:
        """
        Compares video frames against reference image.
        Requires multiple temporally consistent correspondences before claiming a segment match.
        """
        sampled_frames = cls.sample_frames_from_video(video_path)
        if not sampled_frames:
            return {
                "is_match": False,
                "recommended_state": "UNRELATED",
                "matched_frames_count": 0,
                "total_sampled_frames": 0,
                "temporal_segment": None,
                "frame_matches": [],
                "reason": "Unable to decode video stream or empty video file."
            }

        ref_pil, ref_cv = AdvancedMediaMatcher.decode_and_normalize(reference_bytes)
        ref_tile_hashes = AdvancedMediaMatcher.extract_regional_tiles(ref_pil)
        ref_embedding = AdvancedMediaMatcher.compute_embedding(ref_pil)

        matched_frames = []

        for f_data in sampled_frames:
            res = AdvancedMediaMatcher.compare_candidate_to_reference(
                candidate_bytes=f_data["frame_bytes"],
                reference_bytes=reference_bytes,
                reference_tile_hashes=ref_tile_hashes,
                reference_embedding=ref_embedding
            )

            if res["overall_match"] or res["recommended_state"] == "VERIFIED_RELATED":
                matched_frames.append({
                    "frame_index": f_data["frame_index"],
                    "timestamp_ms": f_data["timestamp_ms"],
                    "timestamp_sec": f_data["timestamp_sec"],
                    "visual_similarity": res["visual_similarity"],
                    "signals": res["signals"],
                    "reason": res["reasons"][0] if res["reasons"] else ""
                })

        # Temporal consistency evaluation
        is_segment_match = len(matched_frames) >= min_consistent_frames
        
        if is_segment_match:
            start_ts = matched_frames[0]["timestamp_sec"]
            end_ts = matched_frames[-1]["timestamp_sec"]
            temporal_segment = f"{start_ts}s - {end_ts}s"
            rec_state = "VERIFIED_RELATED"
            reason = f"Verified video segment appearance across {len(matched_frames)} temporally consistent frames ({temporal_segment})."
        elif len(matched_frames) == 1:
            temporal_segment = f"{matched_frames[0]['timestamp_sec']}s (isolated frame)"
            rec_state = "REVIEW_REQUIRED"
            reason = "Single isolated frame matched reference; manual review required to distinguish brief cameo vs false alignment."
        else:
            temporal_segment = None
            rec_state = "UNRELATED"
            reason = f"No video frames matched reference content across {len(sampled_frames)} sampled timestamps."

        return {
            "is_match": is_segment_match,
            "recommended_state": rec_state,
            "matched_frames_count": len(matched_frames),
            "total_sampled_frames": len(sampled_frames),
            "temporal_segment": temporal_segment,
            "frame_matches": matched_frames,
            "reason": reason,
            "sampling_limitation": "Configured at 1 fps periodic sampling; micro-appearances shorter than 1000ms may require high-density burst sampling."
        }
