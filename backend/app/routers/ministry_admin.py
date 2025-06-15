from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
import logging
from uuid import uuid4
from datetime import datetime

from app.database import get_db
from app.models import (
    MinistryAdmin, InstitutionalAdmin, Institution, Exam, Results, Student, 
    SystemAnalytics, ResultPublication
)
from app.schemas import (
    APIResponse, PaginatedResponse, ExamCreate, ExamResponse,
    InstitutionCreate, InstitutionResponse, StudentCreate, StudentResponse,
    InstitutionalAdminCreate, InstitutionalAdminResponse, MinistryAdminCreate, MinistryAdminResponse
)
from app.core.security import get_ministry_admin
from app.core.auth import AuthService

router = APIRouter(prefix="/ministry-admin", tags=["ministry-admin"])
logger = logging.getLogger(__name__)

# FR1: Can register institutions with unique IDs
@router.post("/institutions", response_model=InstitutionResponse)
async def register_institution(
    institution_data: InstitutionCreate,
    current_user: MinistryAdmin = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """FR1: Register institutions with unique IDs (Ministry Admin only)."""
    # Check if institution name already exists
    existing = db.query(Institution).filter(Institution.name == institution_data.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Institution with this name already exists"
        )
    
    # Create institution with auto-generated unique ID
    institution = Institution(**institution_data.dict())
    db.add(institution)
    db.commit()
    db.refresh(institution)
    
    return InstitutionResponse.from_orm(institution)

# FR2: Can create, modify and delete national/public exams
@router.post("/exams", response_model=ExamResponse)
async def create_national_exam(
    exam_data: ExamCreate,
    current_user: MinistryAdmin = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """FR2: Create national/public exams (Ministry Admin only)."""
    exam_dict = exam_data.dict()
    exam_dict['created_by'] = current_user.ministry_admin_id
    
    exam = Exam(**exam_dict)
    db.add(exam)
    db.commit()
    db.refresh(exam)
    
    return ExamResponse.from_orm(exam)

@router.put("/exams/{exam_id}", response_model=ExamResponse)
async def modify_national_exam(
    exam_id: str,
    exam_update: dict,
    current_user: MinistryAdmin = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """FR2: Modify national/public exams (Ministry Admin only)."""
    exam = db.query(Exam).filter(Exam.exam_id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    for field, value in exam_update.items():
        setattr(exam, field, value)
    
    db.commit()
    db.refresh(exam)
    return ExamResponse.from_orm(exam)

@router.delete("/exams/{exam_id}", response_model=APIResponse)
async def delete_national_exam(
    exam_id: str,
    current_user: MinistryAdmin = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """FR2: Delete national/public exams (Ministry Admin only)."""
    exam = db.query(Exam).filter(Exam.exam_id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    db.delete(exam)
    db.commit()
    
    return APIResponse(success=True, message="Exam deleted successfully")

# FR3: Can view all students, results, and system-wide analytics
@router.get("/analytics/system-wide")
async def get_system_wide_analytics(
    current_user: MinistryAdmin = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """FR3: View system-wide analytics (Ministry Admin only)."""
    try:
        logger.info("Fetching system-wide analytics")
        
        analytics = {
            "total_users": {
                "students": db.query(Student).count(),
                "institutional_admins": db.query(InstitutionalAdmin).count(),
                "ministry_admins": db.query(MinistryAdmin).count()
            },
            "institutions": {
                "total": db.query(Institution).count(),
                "verified": db.query(Institution).filter(Institution.is_verified == True).count(),
                "pending": db.query(Institution).filter(Institution.is_verified == False).count()
            },
            "activity": {
                "active_students": db.query(Student).filter(Student.is_active == True).count(),
                "inactive_students": db.query(Student).filter(Student.is_active == False).count()
            }
        }
        
        return analytics
        
    except Exception as e:
        logger.error(f"Error fetching system analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch analytics: {str(e)}"
        )

@router.get("/students/all")
async def view_all_students(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    current_user: MinistryAdmin = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """FR3: View all students in the system (Ministry Admin only)."""
    
    query = db.query(Student)
    total = query.count()
    
    offset = (page - 1) * size
    students = query.offset(offset).limit(size).all()
    
    return PaginatedResponse(
        items=[{
            "student_id": str(s.student_id),
            "name": f"{s.first_name} {s.last_name}",
            "email": s.email,
            "institution": s.institution_name,
            "created_at": s.created_at.isoformat() if s.created_at else None
        } for s in students],
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )

# FR4: Can publish public results
@router.post("/results/publish/{exam_id}", response_model=APIResponse)
async def publish_public_results(
    exam_id: str,
    current_user: MinistryAdmin = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """FR4: Publish public results (Ministry Admin only)."""
    
    # Verify exam exists
    exam = db.query(Exam).filter(Exam.exam_id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    # Update all results for this exam to published
    results = db.query(Results).filter(Results.exam_id == exam_id).all()
    published_count = 0
    
    for result in results:
        if not result.is_published:
            result.is_published = True
            result.published_date = func.current_date()
            published_count += 1
    
    # Create result publication record
    publication = ResultPublication(
        exam_id=exam_id,
        published_by=current_user.ministry_admin_id,
        status="Published",
        total_results=published_count,
        publication_notes=f"Published {published_count} results for {exam.title}"
    )
    
    db.add(publication)
    db.commit()
    
    return APIResponse(
        success=True, 
        message=f"Published {published_count} results for {exam.title}"
    )

# New endpoints for creating students, institutional admins, and ministry admins
@router.post("/create-student", response_model=StudentResponse)
async def create_student(
    student_data: StudentCreate,
    current_user=Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Create a new student"""
    try:
        logger.info(f"Creating student with data: {student_data.dict()}")
        
        # Check if email already exists
        existing_student = db.query(Student).filter(Student.email == student_data.email).first()
        if existing_student:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Verify institution exists
        institution = db.query(Institution).filter(Institution.name == student_data.institution_name).first()
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Institution not found"
            )
        
        # Hash password
        hashed_password = AuthService.get_password_hash(student_data.password)
        
        # Create student
        student = Student(
            student_id=uuid4(),
            first_name=student_data.first_name,
            last_name=student_data.last_name,
            email=student_data.email,
            password_hash=hashed_password,
            phone_number=student_data.phone_number,
            gender=student_data.gender,
            institution_name=student_data.institution_name,
            is_active=True,
            created_at=datetime.utcnow()
        )
        
        db.add(student)
        db.commit()
        
        logger.info(f"Student created successfully with ID: {student.student_id}")
        
        return StudentResponse(
            student_id=str(student.student_id),
            first_name=student.first_name,
            last_name=student.last_name,
            email=student.email,
            phone_number=student.phone_number,
            gender=student.gender,
            institution_name=student.institution_name,
            is_active=student.is_active,
            created_at=student.created_at.isoformat() if student.created_at else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating student: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create student: {str(e)}"
        )

@router.post("/create-institutional-admin", response_model=InstitutionalAdminResponse)
async def create_institutional_admin(
    admin_data: InstitutionalAdminCreate,
    current_user=Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Create a new institutional admin"""
    try:
        logger.info(f"Creating institutional admin with data: {admin_data.dict()}")
        
        # Check if email already exists
        existing_admin = db.query(InstitutionalAdmin).filter(
            InstitutionalAdmin.email == admin_data.email
        ).first()
        if existing_admin:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Verify institution exists
        institution = db.query(Institution).filter(Institution.name == admin_data.institution_name).first()
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Institution not found"
            )
        
        # Hash password
        hashed_password = AuthService.get_password_hash(admin_data.password)
        
        # Create institutional admin
        admin = InstitutionalAdmin(
            institutional_admin_id=uuid4(),
            first_name=admin_data.first_name,
            last_name=admin_data.last_name,
            email=admin_data.email,
            password_hash=hashed_password,
            phone_number=admin_data.phone_number,
            institution_name=admin_data.institution_name,
            title=admin_data.title or "Administrator",
            is_active=True,
            created_at=datetime.utcnow()
        )
        
        db.add(admin)
        db.commit()
        
        logger.info(f"Institutional admin created successfully with ID: {admin.institutional_admin_id}")
        
        return InstitutionalAdminResponse(
            institutional_admin_id=str(admin.institutional_admin_id),
            first_name=admin.first_name,
            last_name=admin.last_name,
            email=admin.email,
            phone_number=admin.phone_number,
            institution_name=admin.institution_name,
            title=admin.title,
            is_active=admin.is_active,
            created_at=admin.created_at.isoformat() if admin.created_at else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating institutional admin: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create institutional admin: {str(e)}"
        )

@router.post("/create-ministry-admin", response_model=MinistryAdminResponse)
async def create_ministry_admin(
    admin_data: MinistryAdminCreate,
    current_user=Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Create a new ministry admin"""
    try:
        logger.info(f"Creating ministry admin with data: {admin_data.dict()}")
        
        # Check if email already exists
        existing_admin = db.query(MinistryAdmin).filter(
            MinistryAdmin.email == admin_data.email
        ).first()
        if existing_admin:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password
        hashed_password = AuthService.get_password_hash(admin_data.password)
        
        # Create ministry admin
        admin = MinistryAdmin(
            ministry_admin_id=uuid4(),
            first_name=admin_data.first_name,
            last_name=admin_data.last_name,
            email=admin_data.email,
            password_hash=hashed_password,
            phone_number=admin_data.phone_number,
            type=admin_data.type or "Administrator",
            is_active=True,
            created_at=datetime.utcnow()
        )
        
        db.add(admin)
        db.commit()
        
        logger.info(f"Ministry admin created successfully with ID: {admin.ministry_admin_id}")
        
        return MinistryAdminResponse(
            ministry_admin_id=str(admin.ministry_admin_id),
            first_name=admin.first_name,
            last_name=admin.last_name,
            email=admin.email,
            phone_number=admin.phone_number,
            type=admin.type,
            is_active=admin.is_active,
            created_at=admin.created_at.isoformat() if admin.created_at else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating ministry admin: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create ministry admin: {str(e)}"
        )

# New endpoint for ministry dashboard
@router.get("/dashboard")
async def get_ministry_dashboard(
    current_user=Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Get ministry dashboard data"""
    try:
        logger.info("Fetching ministry dashboard data")
        
        # Get counts
        total_students = db.query(Student).count()
        total_institutions = db.query(Institution).count()
        total_exams = 0  # Will be implemented when exam model is ready
        total_results = 0  # Will be implemented when results model is ready
        
        # Get recent institutions
        recent_institutions = db.query(Institution).order_by(
            Institution.created_at.desc()
        ).limit(5).all()
        
        # Convert to dict format
        recent_institutions_data = []
        for inst in recent_institutions:
            recent_institutions_data.append({
                "institution_id": str(inst.institution_id),
                "name": inst.name,
                "type": str(inst.type),
                "region": str(inst.region),
                "is_verified": inst.is_verified,
                "created_at": inst.created_at.isoformat() if inst.created_at else None
            })
        
        dashboard_data = {
            "total_students": total_students,
            "total_institutions": total_institutions,
            "total_exams": total_exams,
            "total_results": total_results,
            "recent_exams": [],  # Will be populated when exam model is ready
            "recent_institutions": recent_institutions_data,
            "analytics": {
                "growth_rate": 0,
                "active_users": total_students,
                "pending_verifications": db.query(Institution).filter(
                    Institution.is_verified == False
                ).count()
            }
        }
        
        logger.info(f"Dashboard data retrieved successfully: {dashboard_data}")
        return dashboard_data
        
    except Exception as e:
        logger.error(f"Error fetching ministry dashboard: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch dashboard data: {str(e)}"
        )
