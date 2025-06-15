from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from datetime import date
from sqlalchemy import func

from app.database import get_db
from app.models import Exam, ExamBody, ExamRegistration, Student, MinistryAdmin, Results
from app.schemas import (
    ExamResponse, ExamCreate, ExamUpdate, APIResponse,
    PaginatedResponse, ExamType, ExamLevel, ExamStatus,
    ExamRegistrationCreate, ExamRegistrationResponse
)
from app.core.auth import get_ministry_admin, get_student, AuthService

router = APIRouter()

@router.post("/", response_model=ExamResponse)
async def create_exam(
    exam_data: ExamCreate,
    current_user: MinistryAdmin = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Create a new exam (Ministry Admin only)."""
    # Verify exam body exists
    exam_body = db.query(ExamBody).filter(ExamBody.exam_body_id == exam_data.exam_body_id).first()
    if not exam_body:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam body not found"
        )
    
    # Create exam
    exam_dict = exam_data.dict()
    exam_dict['created_by'] = current_user.ministry_admin_id
    
    exam = Exam(**exam_dict)
    db.add(exam)
    db.commit()
    db.refresh(exam)
    
    return ExamResponse.from_orm(exam)

@router.get("/", response_model=PaginatedResponse)
async def get_exams(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    type: Optional[ExamType] = None,
    level: Optional[ExamLevel] = None,
    status: Optional[ExamStatus] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get paginated list of exams."""
    query = db.query(Exam)
    
    # Apply filters
    if type:
        query = query.filter(Exam.type == type)
    
    if level:
        query = query.filter(Exam.level == level)
    
    if status:
        query = query.filter(Exam.status == status)
    
    # Search functionality
    if search:
        search_filter = or_(
            Exam.title.ilike(f"%{search}%"),
            Exam.description.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * size
    exams = query.offset(offset).limit(size).all()
    
    return PaginatedResponse(
        items=[ExamResponse.from_orm(exam) for exam in exams],
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )

@router.get("/available", response_model=List[ExamResponse])
async def get_available_exams(
    current_user = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get exams available for registration."""
    today = date.today()
    
    # Get active exams that are currently open for registration
    available_exams = db.query(Exam).filter(
        Exam.status == ExamStatus.ACTIVE,
        Exam.date >= today  # Future exams only
    ).all()
    
    return [ExamResponse.from_orm(exam) for exam in available_exams]

@router.post("/{exam_id}/register", response_model=dict)
async def register_for_exam(
    exam_id: str,
    current_user: Student = Depends(get_student),
    db: Session = Depends(get_db)
):
    """Register current user (student) for an exam."""
    # Verify exam exists and is active
    exam = db.query(Exam).filter(Exam.exam_id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    if exam.status != ExamStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Exam is not available for registration"
        )
    
    # Check if already registered
    existing_registration = db.query(ExamRegistration).filter(
        and_(
            ExamRegistration.student_id == current_user.student_id,
            ExamRegistration.exam_id == exam_id
        )
    ).first()
    
    if existing_registration:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already registered for this exam"
        )
    
    # Create registration
    from app.models import RegistrationStatus
    registration = ExamRegistration(
        student_id=current_user.student_id,
        exam_id=exam_id,
        status=RegistrationStatus.PENDING
    )
    
    db.add(registration)
    db.commit()
    db.refresh(registration)
    
    return {
        "success": True,
        "message": f"Successfully registered for {exam.title}",
        "registration_id": str(registration.registration_id)
    }

@router.get("/{exam_id}", response_model=ExamResponse)
async def get_exam(
    exam_id: str,
    db: Session = Depends(get_db)
):
    """Get exam by ID."""
    exam = db.query(Exam).filter(Exam.exam_id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    return ExamResponse.from_orm(exam)

@router.put("/{exam_id}", response_model=ExamResponse)
async def update_exam(
    exam_id: str,
    exam_update: ExamUpdate,
    current_user: MinistryAdmin = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Update exam information (Ministry Admin only)."""
    exam = db.query(Exam).filter(Exam.exam_id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    # Update exam fields
    update_data = exam_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(exam, field, value)
    
    db.commit()
    db.refresh(exam)
    
    return ExamResponse.from_orm(exam)

@router.delete("/{exam_id}", response_model=APIResponse)
async def delete_exam(
    exam_id: str,
    current_user: MinistryAdmin = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Delete exam (Ministry Admin only)."""
    exam = db.query(Exam).filter(Exam.exam_id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    # Check if exam has registrations
    registrations_count = db.query(ExamRegistration).filter(ExamRegistration.exam_id == exam_id).count()
    if registrations_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete exam with existing registrations"
        )
    
    db.delete(exam)
    db.commit()
    
    return APIResponse(
        success=True,
        message="Exam deleted successfully"
    )

@router.get("/{exam_id}/statistics", response_model=dict)
async def get_exam_statistics(
    exam_id: str,
    db: Session = Depends(get_db)
):
    """Get statistics for a specific exam."""
    exam = db.query(Exam).filter(Exam.exam_id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    # Get registrations count
    registrations_count = db.query(ExamRegistration).filter(
        ExamRegistration.exam_id == exam_id
    ).count()
    
    # Get results statistics
    results = db.query(Results).filter(
        Results.exam_id == exam_id
    ).all()
    
    total_results = len(results)
    passed = len([r for r in results if r.status == "Pass"])
    failed = len([r for r in results if r.status == "Fail"])
    absent = len([r for r in results if r.status == "Absent"])
    
    pass_rate = (passed / total_results * 100) if total_results > 0 else 0
    
    # Get institution breakdown
    institution_breakdown = db.query(
        Student.institution_name,
        func.count(Results.result_id).label('count')
    ).join(Results, Results.student_id == Student.student_id).filter(
        Results.exam_id == exam_id
    ).group_by(Student.institution_name).all()
    
    return {
        "exam": {
            "exam_id": str(exam.exam_id),
            "title": exam.title,
            "type": exam.type,
            "level": exam.level,
            "date": exam.date.isoformat() if exam.date else None,
            "status": exam.status
        },
        "registrations_count": registrations_count,
        "results_statistics": {
            "total": total_results,
            "passed": passed,
            "failed": failed,
            "absent": absent,
            "pass_rate": round(pass_rate, 2)
        },
        "institution_breakdown": [
            {"institution": name, "count": count} for name, count in institution_breakdown
        ]
    }

@router.get("/upcoming", response_model=List[ExamResponse])
async def get_upcoming_exams(
    db: Session = Depends(get_db)
):
    """Get upcoming exams."""
    today = date.today()
    
    upcoming_exams = db.query(Exam).filter(
        Exam.date > today,
        Exam.status == ExamStatus.ACTIVE
    ).order_by(Exam.date.asc()).all()
    
    return [ExamResponse.from_orm(exam) for exam in upcoming_exams]

@router.get("/{exam_id}/subjects", response_model=List[dict])
async def get_exam_subjects(
    exam_id: str,
    db: Session = Depends(get_db)
):
    """Get subjects for a specific exam."""
    exam = db.query(Exam).filter(Exam.exam_id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    # In a real application, you would have a subjects table
    # For now, return mock data based on exam type
    subjects = []
    if exam.type == "BAC":
        subjects = [
            {"id": "1", "name": "Mathematics", "coefficient": 4},
            {"id": "2", "name": "Physics", "coefficient": 3},
            {"id": "3", "name": "Chemistry", "coefficient": 3},
            {"id": "4", "name": "Biology", "coefficient": 2},
            {"id": "5", "name": "English", "coefficient": 2}
        ]
    elif exam.type == "BEPC":
        subjects = [
            {"id": "1", "name": "Mathematics", "coefficient": 3},
            {"id": "2", "name": "French", "coefficient": 3},
            {"id": "3", "name": "English", "coefficient": 2},
            {"id": "4", "name": "History", "coefficient": 2},
            {"id": "5", "name": "Geography", "coefficient": 2}
        ]
    else:
        subjects = [
            {"id": "1", "name": "Subject 1", "coefficient": 2},
            {"id": "2", "name": "Subject 2", "coefficient": 2},
            {"id": "3", "name": "Subject 3", "coefficient": 2}
        ]
    
    return subjects
