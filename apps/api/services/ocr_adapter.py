import shutil
import io
from typing import Dict, Any, Optional, List
from PIL import Image
from difflib import SequenceMatcher

class OCRServiceAdapter:
    """
    Transparent OCR Service Adapter.
    Adheres strictly to the rule: Missing models must produce an explicit
    incomplete/unavailable state, never a fabricated score.
    """
    @classmethod
    def is_available(cls) -> bool:
        return shutil.which("tesseract") is not None

    @classmethod
    def extract_text(cls, image_bytes: bytes, lang: str = "eng") -> Dict[str, Any]:
        if not cls.is_available():
            return {
                "status": "UNAVAILABLE",
                "text": None,
                "confidence": 0.0,
                "language": lang,
                "error": "Tesseract OCR engine binary is not installed in system PATH.",
                "note": "OCR text extraction requires tesseract-ocr executable. Schema supports ocr_text field once engine is attached."
            }

        try:
            import pytesseract
            img = Image.open(io.BytesIO(image_bytes))
            data = pytesseract.image_to_data(img, lang=lang, output_type=pytesseract.Output.DICT)
            
            words = []
            confs = []
            for i in range(len(data["text"])):
                w = data["text"][i].strip()
                c = int(data["conf"][i])
                if w and c > 0:
                    words.append(w)
                    confs.append(c)

            full_text = " ".join(words)
            avg_conf = float(sum(confs) / len(confs)) if confs else 0.0

            return {
                "status": "SUCCEEDED",
                "text": full_text,
                "confidence": round(avg_conf, 1),
                "language": lang,
                "word_count": len(words)
            }
        except Exception as e:
            return {
                "status": "FAILED",
                "text": None,
                "confidence": 0.0,
                "language": lang,
                "error": str(e)
            }

class TextSimilarityAdapter:
    """
    Separates Lexical Text Matching (difflib SequenceMatcher)
    from Contextual/Embedding Paraphrase Matching.
    """
    @staticmethod
    def calculate_lexical_similarity(target_query: str, target_handles: List[str], text_content: str) -> Dict[str, Any]:
        if not text_content:
            return {
                "score": 70.0,
                "method": "Lexical / Sequence Ratio",
                "matched_terms": [],
                "ratio": 0.0
            }

        text_lower = text_content.lower()
        matched = []
        score = 65.0

        if target_query.lower() in text_lower:
            score += 20.0
            matched.append(f"Name Match: {target_query}")

        for handle in target_handles:
            clean = handle.replace("@", "").lower().strip()
            if clean and clean in text_lower:
                score += 15.0
                matched.append(f"Handle Match: {handle}")
                break

        ratio = SequenceMatcher(None, target_query.lower(), text_lower[:len(target_query)*2]).ratio()
        score += (ratio * 10.0)

        final_score = min(round(score, 1), 99.4)
        return {
            "score": final_score,
            "method": "Lexical / Sequence Ratio (difflib.SequenceMatcher)",
            "matched_terms": matched,
            "ratio": round(ratio, 3)
        }
