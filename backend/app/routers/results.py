from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, func

from app.database import get_db
from app.models import Results, Student, Exam, ExamRegistration, MinistryAdmin, InstitutionalAdmin, Institution
from app.schemas import (
    ResultResponse, ResultCreate, ResultUpdate, APIResponse,
    PaginatedResponse, ResultStatus
)
from app.core.auth import get_ministry_admin, get_student, AuthService

router = APIRouter()

@router.post("/", response_model=ResultResponse)
async def create_result(
    result_data: ResultCreate,
    current_user = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Create/upload a result (Ministry Admin or Institutional Admin only)."""
    # Verify user has permission to upload results
    if not isinstance(current_user, (MinistryAdmin, InstitutionalAdmin)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can upload results"
        )
    
    # Verify exam registration exists
    registration = db.query(ExamRegistration).filter(
        and_(
            ExamRegistration.student_id == result_data.student_id,
            ExamRegistration.exam_id == result_data.exam_id
        )
    ).first()
    
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam registration not found"
        )
    
    # Check if result already exists
    existing_result = db.query(Results).filter(
        and_(
            Results.student_id == result_data.student_id,
            Results.exam_id == result_data.exam_id
        )
    ).first()
    
    if existing_result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Result already exists for this student and exam"
        )
    
    # Create result
    result_dict = result_data.dict()
    if isinstance(current_user, MinistryAdmin):
        result_dict['verified_by'] = current_user.ministry_admin_id
    else:
        result_dict['verified_by'] = current_user.institutional_admin_id
    
    result = Results(**result_dict)
    db.add(result)
    db.commit()
    db.refresh(result)
    
    return ResultResponse.from_orm(result)

@router.get("/", response_model=PaginatedResponse)
async def get_results(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    student_id: Optional[str] = None,
    exam_id: Optional[str] = None,
    status: Optional[ResultStatus] = None,
    published_only: bool = Query(False),
    current_user = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get paginated list of results."""
    query = db.query(Results)
    
    # Apply filters
    if student_id:
        query = query.filter(Results.student_id == student_id)
    
    if exam_id:
        query = query.filter(Results.exam_id == exam_id)
    
    if status:
        query = query.filter(Results.status == status)
    
    if published_only:
        query = query.filter(Results.is_published == True)
    
    # For students, only show their own results
    if isinstance(current_user, Student):
        query = query.filter(Results.student_id == current_user.student_id)
        query = query.filter(Results.is_published == True)  # Students can only see published results
    
    # For institutional admins, only show results from their institution
    elif isinstance(current_user, InstitutionalAdmin):
        query = query.join(Student).filter(Student.institution_name == current_user.institution_name)
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * size
    results = query.offset(offset).limit(size).all()
    
    return PaginatedResponse(
        items=[ResultResponse.from_orm(result) for result in results],
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )

@router.get("/my-results", response_model=List[ResultResponse])
async def get_my_results(
    current_user: Student = Depends(get_student),
    db: Session = Depends(get_db)
):
    """Get current student's results."""
    results = db.query(Results).filter(
        and_(
            Results.student_id == current_user.student_id,
            Results.is_published == True
        )
    ).all()
    
    return [ResultResponse.from_orm(result) for result in results]

@router.put("/{result_id}", response_model=ResultResponse)
async def update_result(
    result_id: str,
    result_update: ResultUpdate,
    current_user = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Update result information."""
    # Verify user has permission
    if not isinstance(current_user, (MinistryAdmin, InstitutionalAdmin)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update results"
        )
    
    result = db.query(Results).filter(Results.result_id == result_id).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Result not found"
        )
    
    # Update result fields
    update_data = result_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(result, field, value)
    
    db.commit()
    db.refresh(result)
    
    return ResultResponse.from_orm(result)

@router.post("/{result_id}/publish", response_model=APIResponse)
async def publish_result(
    result_id: str,
    current_user: MinistryAdmin = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Publish a result (Ministry Admin only)."""
    result = db.query(Results).filter(Results.result_id == result_id).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Result not found"
        )
    
    result.is_published = True
    result.published_date = func.current_date()
    db.commit()
    
    return APIResponse(
        success=True,
        message="Result published successfully"
    )

@router.get("/{result_id}", response_model=ResultResponse)
async def get_result(
    result_id: str,
    current_user = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get result by ID."""
    result = db.query(Results).filter(Results.result_id == result_id).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Result not found"
        )
    
    # Check permissions
    if isinstance(current_user, Student):
        if result.student_id != current_user.student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        if not result.is_published:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Result not published yet"
            )
    
    return ResultResponse.from_orm(result)

@router.get("/by-institution/{institution_id}", response_model=PaginatedResponse)
async def get_results_by_institution(
    institution_id: str,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    exam_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(AuthService.get_current_user)
):
    """Get results for a specific institution."""
    # Get institution
    institution = db.query(Institution).filter(Institution.institution_id == institution_id).first()
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institution not found"
        )
    
    # Check permissions
    if isinstance(current_user, InstitutionalAdmin):
        if current_user.institution_name != institution.name:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Can only view results for your own institution"
            )
    
    # Build query
    query = db.query(Results).join(Student).filter(
        Student.institution_name == institution.name
    )
    
    if exam_id:
        query = query.filter(Results.exam_id == exam_id)
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * size
    results = query.offset(offset).limit(size).all()
    
    return PaginatedResponse(
        items=[ResultResponse.from_orm(result) for result in results],
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )

@router.get("/statistics", response_model=dict)
async def get_results_statistics(
    exam_id: Optional[str] = None,
    institution_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(AuthService.get_current_user)
):
    """Get results statistics."""
    query = db.query(Results)
    
    if exam_id:
        query = query.filter(Results.exam_id == exam_id)
    
    if institution_id:
        institution = db.query(Institution).filter(Institution.institution_id == institution_id).first()
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found"
            )
        
        query = query.join(Student).filter(Student.institution_name == institution.name)
    
    # Check permissions for institutional admin
    if isinstance(current_user, InstitutionalAdmin):
        query = query.join(Student).filter(Student.institution_name == current_user.institution_name)
    
    # Get results
    results = query.all()
    
    # Calculate statistics
    total = len(results)
    passed = len([r for r in results if r.status == "Pass"])
    failed = len([r for r in results if r.status == "Fail"])
    absent = len([r for r in results if r.status == "Absent"])
    
    pass_rate = (passed / total * 100) if total > 0 else 0
    
    return {
        "total": total,
        "passed": passed,
        "failed": failed,
        "absent": absent,
        "pass_rate": round(pass_rate, 2)
    }

@router.post("/bulk-upload", response_model=APIResponse)
async def bulk_upload_results(
    results_data: List[ResultCreate],
    db: Session = Depends(get_db),
    current_user = Depends(get_ministry_admin)
):
    """Bulk upload results (Ministry Admin only)."""
    uploaded_count = 0
    errors = []
    
    for result_data in results_data:
        try:
            # Verify exam registration exists
            registration = db.query(ExamRegistration).filter(
                and_(
                    ExamRegistration.student_id == result_data.student_id,
                    ExamRegistration.exam_id == result_data.exam_id
                )
            ).first()
            
            if not registration:
                errors.append(f"Exam registration not found for student {result_data.student_id}")
                continue
            
            # Check if result already exists
            existing_result = db.query(Results).filter(
                and_(
                    Results.student_id == result_data.student_id,
                    Results.exam_id == result_data.exam_id
                )
            ).first()
            
            if existing_result:
                errors.append(f"Result already exists for student {result_data.student_id}")
                continue
            
            # Create result
            result_dict = result_data.dict()
            result_dict['verified_by'] = current_user.ministry_admin_id
            
            result = Results(**result_dict)
            db.add(result)
            db.commit()
            
            uploaded_count += 1
        except Exception as e:
            errors.append(f"Error uploading result for student {result_data.student_id}: {str(e)}")
    
    return APIResponse(
        success=True,
        message=f"Uploaded {uploaded_count} results with {len(errors)} errors",
        data={"errors": errors}
    )
