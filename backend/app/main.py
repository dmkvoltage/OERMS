from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import uvicorn
import logging
from contextlib import asynccontextmanager
from datetime import datetime

from app.database import SessionLocal, get_db, engine
from app.models import Base
from app.routers import (
    auth, students, institutions, exams, results, 
    ministry_admin, institutional_admin, public,
    comprehensive_operations, public_access, users, 
    examination_officer, student_dashboard
)
from app.core.auth import AuthService
from app.core.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info("Application starting up...")
    
    # Create database tables
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
    
    # Create performance indexes
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            # Add indexes for better performance
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_student_email ON student(email);
                CREATE INDEX IF NOT EXISTS idx_student_institution ON student(institution_name);
                CREATE INDEX IF NOT EXISTS idx_institution_name ON institution(name);
                CREATE INDEX IF NOT EXISTS idx_institution_region ON institution(region);
                CREATE INDEX IF NOT EXISTS idx_ministry_admin_email ON ministry_admin(email);
                CREATE INDEX IF NOT EXISTS idx_institutional_admin_email ON institutional_admin(email);
            """))
            conn.commit()
        logger.info("Performance indexes created")
    except Exception as e:
        logger.warning(f"Could not create performance indexes: {e}")
    
    yield
    
    logger.info("Application shutting down...")

# Initialize FastAPI app
app = FastAPI(
    title="Online Examination Results Management System (OERMS)",
    description="A comprehensive system for managing examination results in Cameroon",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Security
security = HTTPBearer()

# CORS Middleware - Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # In production, specify exact hosts
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "Internal server error",
            "errors": [str(exc)] if settings.DEBUG else ["An unexpected error occurred"]
        }
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": "connected"
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to OERMS API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "docs": "/docs",
        "redoc": "/redoc"
    }

# Include routers with proper prefixes
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(students.router, prefix="/students", tags=["students"])
app.include_router(institutions.router, prefix="/institutions", tags=["institutions"])
app.include_router(exams.router, prefix="/exams", tags=["exams"])
app.include_router(results.router, prefix="/results", tags=["results"])
app.include_router(ministry_admin.router, tags=["ministry-admin"])
app.include_router(institutional_admin.router, prefix="/institutional-admin", tags=["institutional-admin"])
app.include_router(examination_officer.router, prefix="/examination-officer", tags=["examination-officer"])
app.include_router(student_dashboard.router, prefix="/student-dashboard", tags=["student-dashboard"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(public.router, prefix="/public", tags=["public"])
app.include_router(public_access.router, prefix="/public-access", tags=["public-access"])
app.include_router(comprehensive_operations.router, prefix="/operations", tags=["operations"])

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
