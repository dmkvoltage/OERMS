from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.database import get_db
from app.models import InstitutionalAdmin, Student, Institution
from app.schemas import (
    StudentCreate, StudentResponse, APIResponse, PaginatedResponse
)
from app.core.security import get_institutional_admin, get_password_hash

router = APIRouter()

# FR6: Can register students under their institution
@router.post("/students", response_model=StudentResponse)
async def register_student(
    student_data: StudentCreate,
    current_user: InstitutionalAdmin = Depends(get_institutional_admin),
    db: Session = Depends(get_db)
):
    """FR6: Register students under their institution (Institutional Admin only)."""
    
    # Verify admin can only register students for their institution
    if student_data.institution_name != current_user.institution_name:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only register students for your own institution"
        )
    
    # Check if email already exists
    existing_student = db.query(Student).filter(Student.email == student_data.email).first()
    if existing_student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student with this email already exists"
        )
    
    # Create student with auto-generated credentials
    student_dict = student_data.dict()
    student_dict['password'] = get_password_hash(student_data.password)
    student_dict['institution_name'] = current_user.institution_name
    
    student = Student(**student_dict)
    db.add(student)
    db.commit()
    db.refresh(student)
    
    return StudentResponse.from_orm(student)

# FR7: Can view and manage all data related to their school only
@router.get("/institution/data")
async def view_institution_data(
    current_user: InstitutionalAdmin = Depends(get_institutional_admin),
    db: Session = Depends(get_db)
):
    """FR7: View and manage all data related to their school only."""
    
    # Get institution details
    institution = db.query(Institution).filter(
        Institution.name == current_user.institution_name
    ).first()
    
    # Get students count
    students_count = db.query(Student).filter(
        Student.institution_name == current_user.institution_name
    ).count()
    
    # Get recent student registrations
    recent_students = db.query(Student).filter(
        Student.institution_name == current_user.institution_name
    ).order_by(Student.created_at.desc()).limit(10).all()
    
    return {
        "institution": {
            "name": institution.name if institution else current_user.institution_name,
            "type": institution.type if institution else None,
            "region": institution.region if institution else None,
            "is_verified": institution.is_verified if institution else False
        },
        "students_count": students_count,
        "recent_students": [
            {
                "student_id": str(s.student_id),
                "name": f"{s.first_name} {s.last_name}",
                "email": s.email,
                "created_at": s.created_at
            } for s in recent_students
        ]
    }

@router.get("/students")
async def get_institution_students(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    current_user: InstitutionalAdmin = Depends(get_institutional_admin),
    db: Session = Depends(get_db)
):
    """FR7: View students from their institution only."""
    
    query = db.query(Student).filter(
        Student.institution_name == current_user.institution_name
    )
    
    if search:
        query = query.filter(
            or_(
                Student.first_name.ilike(f"%{search}%"),
                Student.last_name.ilike(f"%{search}%"),
                Student.email.ilike(f"%{search}%")
            )
        )
    
    total = query.count()
    offset = (page - 1) * size
    students = query.offset(offset).limit(size).all()
    
    return PaginatedResponse(
        items=[StudentResponse.from_orm(s) for s in students],
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )

# Upload necessary student documents upon registration
@router.post("/students/{student_id}/documents", response_model=APIResponse)
async def upload_student_documents(
    student_id: str,
    # documents: List[UploadFile] = File(...),  # Would handle file uploads
    current_user: InstitutionalAdmin = Depends(get_institutional_admin),
    db: Session = Depends(get_db)
):
    """Upload necessary student documents upon registration."""
    
    # Verify student belongs to admin's institution
    student = db.query(Student).filter(
        and_(
            Student.student_id == student_id,
            Student.institution_name == current_user.institution_name
        )
    ).first()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found or not in your institution"
        )
    
    # Here you would handle document upload logic
    # For now, just return success
    return APIResponse(
        success=True,
        message="Student documents uploaded successfully"
    )
