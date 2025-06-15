from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import Student, Institution, InstitutionalAdmin, MinistryAdmin
from app.schemas import (
    StudentResponse, StudentCreate, StudentUpdate, APIResponse,
    PaginatedResponse, GenderType
)
from app.core.auth import (
    get_ministry_admin, get_institutional_admin, get_student,
    AuthService
)

router = APIRouter()

@router.post("/", response_model=StudentResponse)
async def create_student(
    student_data: StudentCreate,
    current_user = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new student."""
    # Only admins can create students
    if not isinstance(current_user, (InstitutionalAdmin, MinistryAdmin)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create students"
        )
    
    # Check if email already exists
    existing_student = db.query(Student).filter(Student.email == student_data.email).first()
    if existing_student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Verify institution exists if specified
    if student_data.institution_name:
        institution = db.query(Institution).filter(Institution.name == student_data.institution_name).first()
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found"
            )
    
    # Check permissions - institutional admin can only create students for their institution
    if isinstance(current_user, InstitutionalAdmin):
        if student_data.institution_name != current_user.institution_name:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to create students for this institution"
            )
    
    # Create student
    from app.core.auth import AuthService
    student_dict = student_data.dict()
    student_dict['password'] = AuthService.get_password_hash(student_data.password)
    
    student = Student(**student_dict)
    db.add(student)
    db.commit()
    db.refresh(student)
    
    return StudentResponse.from_orm(student)

@router.get("/", response_model=PaginatedResponse)
async def get_students(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    institution_name: Optional[str] = None,
    search: Optional[str] = None,
    current_user = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get paginated list of students."""
    # Only admins can view student lists
    if not isinstance(current_user, (InstitutionalAdmin, MinistryAdmin)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    query = db.query(Student)
    
    # Apply filters
    if institution_name:
        query = query.filter(Student.institution_name == institution_name)
    
    # For institutional admins, only show students from their institution
    if isinstance(current_user, InstitutionalAdmin):
        query = query.filter(Student.institution_name == current_user.institution_name)
    
    # Search functionality
    if search:
        search_filter = or_(
            Student.first_name.ilike(f"%{search}%"),
            Student.last_name.ilike(f"%{search}%"),
            Student.email.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * size
    students = query.offset(offset).limit(size).all()
    
    return PaginatedResponse(
        items=[StudentResponse.from_orm(student) for student in students],
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )

@router.get("/dashboard", response_model=dict)
async def get_student_dashboard(
    current_user: Student = Depends(get_student),
    db: Session = Depends(get_db)
):
    """Get student dashboard data."""
    from app.models import Exam, ExamRegistration, Results, Notifications
    from datetime import date
    
    # Get available exams (active exams)
    available_exams = db.query(Exam).filter(
        Exam.status == "Active"
    ).limit(5).all()
    
    # Get registered exams
    registered_exams = db.query(ExamRegistration).filter(
        ExamRegistration.student_id == current_user.student_id
    ).limit(10).all()
    
    # Get recent results
    recent_results = db.query(Results).filter(
        Results.student_id == current_user.student_id,
        Results.is_published == True
    ).order_by(Results.created_at.desc()).limit(10).all()
    
    # Get notifications
    notifications = db.query(Notifications).filter(
        Notifications.user_id == current_user.student_id
    ).order_by(Notifications.created_at.desc()).limit(10).all()
    
    return {
        "student_info": {
            "student_id": str(current_user.student_id),
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "email": current_user.email,
            "phone_number": current_user.phone_number,
            "gender": current_user.gender,
            "institution_name": current_user.institution_name,
            "is_active": current_user.is_active,
            "created_at": current_user.created_at.isoformat() if current_user.created_at else None
        },
        "available_exams": [
            {
                "exam_id": str(exam.exam_id),
                "title": exam.title,
                "type": exam.type,
                "level": exam.level,
                "date": exam.date.isoformat() if exam.date else None
            } for exam in available_exams
        ],
        "registered_exams": [
            {
                "registration_id": str(reg.registration_id),
                "exam_id": str(reg.exam_id),
                "status": reg.status,
                "registration_date": reg.registration_date.isoformat() if reg.registration_date else None
            } for reg in registered_exams
        ],
        "recent_results": [
            {
                "result_id": str(result.result_id),
                "exam_id": str(result.exam_id),
                "grade": result.grade,
                "status": result.status,
                "published_date": result.published_date.isoformat() if result.published_date else None
            } for result in recent_results
        ],
        "notifications": [
            {
                "notification_id": str(notif.notification_id),
                "message": notif.message,
                "is_read": notif.is_read,
                "date": notif.date.isoformat() if notif.date else None
            } for notif in notifications
        ]
    }

@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(
    student_id: str,
    current_user = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get student by ID."""
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Check permissions
    if isinstance(current_user, Student):
        if current_user.student_id != student.student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Can only view your own profile"
            )
    elif isinstance(current_user, InstitutionalAdmin):
        if current_user.institution_name != student.institution_name:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Can only view students from your institution"
            )
    
    return StudentResponse.from_orm(student)

@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: str,
    student_update: StudentUpdate,
    current_user = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Update student information."""
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Check permissions
    if isinstance(current_user, Student):
        if current_user.student_id != student.student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Can only update your own profile"
            )
        # Students can only update limited fields
        allowed_fields = ["phone_number"]
        update_data = {k: v for k, v in student_update.dict(exclude_unset=True).items() if k in allowed_fields}
    elif isinstance(current_user, InstitutionalAdmin):
        if current_user.institution_name != student.institution_name:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Can only update students from your institution"
            )
        update_data = student_update.dict(exclude_unset=True)
    else:  # Ministry Admin
        update_data = student_update.dict(exclude_unset=True)
    
    # Update student fields
    for field, value in update_data.items():
        setattr(student, field, value)
    
    db.commit()
    db.refresh(student)
    
    return StudentResponse.from_orm(student)

@router.delete("/{student_id}", response_model=APIResponse)
async def delete_student(
    student_id: str,
    current_user = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Delete student (Ministry Admin only)."""
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Check if student has exam registrations or results
    from app.models import ExamRegistration, Results
    registrations_count = db.query(ExamRegistration).filter(ExamRegistration.student_id == student_id).count()
    results_count = db.query(Results).filter(Results.student_id == student_id).count()
    
    if registrations_count > 0 or results_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete student with existing registrations ({registrations_count}) or results ({results_count})"
        )
    
    db.delete(student)
    db.commit()
    
    return APIResponse(
        success=True,
        message="Student deleted successfully"
    )
