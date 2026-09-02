from database import SessionLocal, engine, Base
import models
from datetime import datetime

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(models.Incident).filter(models.Incident.id == "HC-2041").first():
            print("Database already seeded with HC-2041.")
            return

        # Create Protected Profile
        profile = models.ProtectedProfile(
            id="PROF-8821",
            full_name="Dr. Evelyn Carter",
            organization="Department of Biochemistry",
            handles="@evelyn_carter_lab"
        )
        db.add(profile)

        # Create Consent Record
        consent = models.Consent(
            id="CONS-901",
            profile_id="PROF-8821",
            is_active=True
        )
        db.add(consent)

        # Create Master Incident
        incident = models.Incident(
            id="HC-2041",
            title="Manipulated Media & Impersonation Campaign",
            profile_id="PROF-8821",
            status="ACTIVE MONITORING",
            risk_score=88,
            risk_level="HIGH",
            description="Unconsented manipulated image combined with defamatory claims regarding student research funds across multiple social platforms."
        )
        db.add(incident)

        # Seed Occurrences
        occ1 = models.Occurrence(
            id="HC-2041-001",
            incident_id="HC-2041",
            platform="Instagram",
            variant_type="Original",
            url="https://instagram.com/p/C9x81_orig",
            account_handle="@unauth_source_01",
            similarity_score=100.0,
            status="Removed",
            sha256="ab4f91dc88231a47e0912389174128941029381029381029381029381029381",
            phash="pHash-8f9a2b1c4e"
        )
        occ2 = models.Occurrence(
            id="HC-2041-002",
            incident_id="HC-2041",
            platform="Instagram",
            variant_type="Cropped",
            url="https://instagram.com/p/C9x92_crop",
            account_handle="@repost_bot_99",
            similarity_score=96.0,
            status="Removed",
            sha256="7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b2c3d4e5f6a7b8c9d0e1f2",
            phash="pHash-8f9a2b1c4f"
        )
        db.add_all([occ1, occ2])

        db.commit()
        print("Database successfully seeded with Master Incident HC-2041!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
