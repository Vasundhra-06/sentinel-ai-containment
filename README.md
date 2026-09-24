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
# SENTINEL: current development workspace

SENTINEL is under phased development. The new `/workspace` supports authenticated local operators, tenant-isolated provisional cases, audit records and versioned database migrations. A production evidence vault, complete review workflow, live platform actions and continuous monitoring remain unfinished. Earlier screens contain simulated results and are labelled as a legacy demonstration.

Start with [the foundation checkpoint and login instructions](docs/SENTINEL_FOUNDATION_CHECKPOINT.md). The [audit](docs/SENTINEL_IMPLEMENTATION_AUDIT.md), [production plan](docs/SENTINEL_PRODUCTION_PLAN.md), and [traceability matrix](docs/SENTINEL_TRACEABILITY_MATRIX.md) distinguish current behavior from planned capabilities. Historical verification reports are prototype snapshots, not production-readiness claims.

## Run the current workspace on Windows

From the repository root in PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r apps/api/requirements-foundation.txt
npm ci
.\scripts\Start-Sentinel.ps1
```

Open `http://127.0.0.1:3000/workspace`. In another PowerShell terminal, provision an operator:

```powershell
Push-Location apps/api
& ..\..\.venv\Scripts\python.exe -m foundation.bootstrap --tenant "Local evaluation" --name "Local operator"
Pop-Location
```

Paste the private 8-hour credential into the workspace. Provision once per new organization; repeating this command creates a separate organization. Credentials and case databases are not distributed with the source. Migrations create the foundation database locally; legacy records are not automatically imported.

The API's legacy v1 routes are disabled by default. `Start-Sentinel.ps1 -LegacyDemo` explicitly enables the local demo and requires its optional ML/media dependencies and locally prepared demonstration data. Its simulated outcomes are not third-party enforcement.

Current verification: 14 foundation tests pass; the Next.js 15 frontend builds; localhost browser and API checks pass. See the checkpoint for scope and limitations. PostgreSQL live integration, enterprise identity/MFA and production deployment remain pending.

## Historical prototype description

The following original description and commands are retained for context. They describe intended or simulated capabilities and older setup; use the current instructions above.

