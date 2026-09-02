from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import incidents, detections, evidence, reports

# Initialize SQLite Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SENTINEL Backend API",
    description="AI-Based Harmful Content Detection & Digital Incident Containment Platform",
    version="1.0.0"
)

# CORS middleware for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(incidents.router)
app.include_router(detections.router)
app.include_router(evidence.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {
        "system": "SENTINEL API",
        "status": "ONLINE",
        "version": "1.0.0",
        "tagline": "Detect the Incident. Trace the Spread. Support Containment."
    }
