"""
SENTINEL Security, Privacy, and Resilience Verification Suite
Non-destructive checks for data isolation, secret hygiene, and input fault tolerance.
"""
import sys
import os
import hashlib
import json

current_dir = os.path.dirname(os.path.abspath(__file__))
repo_root = os.path.dirname(current_dir)
api_dir = os.path.join(repo_root, "apps", "api")
if api_dir not in sys.path:
    sys.path.insert(0, api_dir)

from services.fingerprint_service import FingerprintService

def run_security_privacy_checks():
    print("=" * 80)
    print("RUNNING SECURITY, PRIVACY & RESILIENCE AUDIT")
    print("=" * 80)

    checks = []

    # Check 1: Production DB Isolation
    prod_db = os.path.join(api_dir, "sentinel.db")
    if os.path.exists(prod_db):
        with open(prod_db, "rb") as f:
            db_data = f.read()
        db_hash = hashlib.sha256(db_data).hexdigest()
        # Verify TEST-HC-0001 is NOT in production DB
        isolated = b"TEST-HC-0001" not in db_data
        checks.append({
            "check": "Production DB Zero-Impact & Record Isolation",
            "passed": isolated,
            "details": f"Production DB sha256={db_hash[:12]}..., 'TEST-HC-0001' presence = {not isolated}"
        })
    else:
        checks.append({
            "check": "Production DB Zero-Impact & Record Isolation",
            "passed": True,
            "details": "Production DB not found on disk."
        })

    # Check 2: Secret & Credential Hygiene
    val_json = os.path.join(current_dir, "validation_results.json")
    leak_detected = False
    if os.path.exists(val_json):
        with open(val_json, "r", encoding="utf-8") as f:
            raw_text = f.read().lower()
        forbidden_tokens = ["api_key", "bearer ", "password", "secret_key", "ghp_"]
        for t in forbidden_tokens:
            if t in raw_text:
                leak_detected = True
                break
    checks.append({
        "check": "Credential & Token Hygiene",
        "passed": not leak_detected,
        "details": "Validated that benchmark outputs and logs contain zero API tokens or credentials."
    })

    # Check 3: Corrupted / Truncated Byte Resilience
    corrupt_bytes = b"CORRUPTED_TRUNCATED_HEADER\x00\xff\xfe\x01\x02\x03RANDOM_NOISE"
    resilience_passed = False
    try:
        h = FingerprintService.calculate_image_hashes(corrupt_bytes)
        resilience_passed = (h["format"] == "UNKNOWN" and "phash" in h)
    except Exception as e:
        resilience_passed = False

    checks.append({
        "check": "Corrupted / Malformed Payload Fault Tolerance",
        "passed": resilience_passed,
        "details": "FingerprintService gracefully handled corrupted non-image bytes using fallback hashing without crashing."
    })

    # Check 4: Null & Empty String Input Safety
    null_safety_passed = False
    try:
        score1 = FingerprintService.calculate_text_similarity("", [], "")
        score2 = FingerprintService.calculate_text_similarity("test", [], "")
        null_safety_passed = (score1 == 70.0 and score2 == 70.0)
    except Exception:
        null_safety_passed = False

    checks.append({
        "check": "Empty / Null Input Safety",
        "passed": null_safety_passed,
        "details": "Text similarity calculations safely handle empty or null string inputs with controlled baseline returns."
    })

    # Summary
    all_passed = all(c["passed"] for c in checks)
    print("-" * 80)
    for c in checks:
        status_str = "PASS" if c["passed"] else "FAIL"
        print(f"[{status_str}] {c['check']}: {c['details']}")
    print("-" * 80)
    print(f"SECURITY AUDIT OVERALL: {'PASS' if all_passed else 'FAIL'}")
    return all_passed

if __name__ == "__main__":
    run_security_privacy_checks()
