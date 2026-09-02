# 🛡️ SENTINEL - AI-Based Harmful Content Detection & Containment System

> **Tagline:** *“Detect the Incident. Trace the Spread. Support Containment.”*  
> **Product Vision:** *“One Incident. Every Variant. Continuous Awareness.”*  
> **Core Innovation:** **Incident-Centric Digital Containment**

---

## 📌 Project Overview

SENTINEL is a victim-authorized, AI-powered software automation platform designed to help identify, connect, organize, document, report, and continuously monitor harmful digital-content incidents targeting a protected person or organization.

Instead of looking at every harmful post separately, SENTINEL links all related variants—crops, screenshots, edited images, memes, rewritten text claims, and video derivatives—into a single **Master Incident** (e.g. `HC-2041`).

```
Master Incident: HC-2041
│
├── HC-2041-001 — Instagram Original
├── HC-2041-002 — Cropped Variant
├── HC-2041-003 — X Screenshot
├── HC-2041-004 — Facebook Edit
├── HC-2041-005 — Meme
└── HC-2041-006 — Video Variant
```

---

## 🚀 Architecture

```
sentinel-app/
├── apps/
│   ├── web/               # Next.js 16 (React 19, TypeScript, Tailwind CSS, React Flow, Recharts)
│   └── api/               # FastAPI Backend (Python, SQLAlchemy, ImageHash/Pillow, ReportLab)
├── docs/
│   ├── CAPABILITY_MATRIX.md
│   └── FINAL_VERIFICATION_REPORT.md
├── package.json
└── README.md
```

---

## ⚡ Quick Start

### 1. Web Application (`apps/web`)
```bash
cd apps/web
npm install
npm run dev
```
Navigate to `http://localhost:3000`.

### 2. FastAPI Backend (`apps/api`)
```bash
cd apps/api
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload --port 8000
```
API Documentation: `http://localhost:8000/docs`

---

## 📊 The 12-Stage Pipeline
`DETECT` → `ANALYZE` → `VERIFY` → `FINGERPRINT` → `MATCH` → `GROUP` → `TRACE` → `PRESERVE` → `REPORT` → `TRACK` → `MONITOR` → `CONTAIN`

---

## 🔒 Ethics & Governance
- **Consent-First:** Monitoring only with explicit victim authorization.
- **Tamper-Evident Evidence:** Cryptographic SHA-256 hash verification.
- **Lawful Containment:** Supports authorized platform review requests without unauthorized deletion claims.
