from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func

from app.database import get_db
from app.models import Results, Student, Exam, Institution, ExamRegistration
from app.schemas import PublicResultSearch, PublicResultResponse

router = APIRouter()

@router.post("/search-results", response_model=List[PublicResultResponse])
async def search_public_results(
    search_data: PublicResultSearch,
    db: Session = Depends(get_db)
):
    """Search for published public exam results."""
    if not any([search_data.candidate_number, search_data.exam_code, search_data.student_number]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one search parameter is required"
        )
    
    query = db.query(Results).join(Student).join(Exam)
    
    # Only show published results
    query = query.filter(Results.is_published == True)
    
    # Apply search filters
    search_filters = []
    
    if search_data.candidate_number:
        # Search by student ID (using as candidate number)
        search_filters.append(Student.student_id.cast(db.String).ilike(f"%{search_data.candidate_number}%"))
    
    if search_data.exam_code:
        search_filters.append(
            or_(
                Exam.title.ilike(f"%{search_data.exam_code}%"),
                Exam.type.ilike(f"%{search_data.exam_code}%")
            )
        )
    
    if search_data.student_number:
        search_filters.append(
            or_(
                Student.email.ilike(f"%{search_data.student_number}%"),
                Student.first_name.ilike(f"%{search_data.student_number}%"),
                Student.last_name.ilike(f"%{search_data.student_number}%")
            )
        )
    
    if search_filters:
        query = query.filter(or_(*search_filters))
    
    results = query.all()
    
    # Format results for public display
    public_results = []
    for result in results:
        student = result.student
        exam = result.exam
        
        # Get institution name
        institution_name = student.institution_name or "Unknown Institution"
        
        # Determine overall status
        overall_status = "PASS" if result.status == "Pass" else "FAIL" if result.status == "Fail" else "PENDING"
        
        public_result = PublicResultResponse(
            candidate_number=str(result.student_id)[:8],  # Use first 8 chars of student ID as candidate number
            student_name=f"{student.first_name} {student.last_name}",
            exam_title=exam.title,
            exam_year=str(exam.date.year) if exam.date else "N/A",
            institution_name=institution_name,
            results=result.scores if result.scores else {},
            overall_status=overall_status
        )
        public_results.append(public_result)
    
    return public_results

@router.get("/exams", response_model=List[dict])
async def get_public_exams(
    db: Session = Depends(get_db)
):
    """Get list of public exams for general information."""
    exams = db.query(Exam).filter(
        Exam.status == "Active"
    ).all()
    
    return [
        {
            "exam_id": str(exam.exam_id),
            "title": exam.title,
            "type": exam.type,
            "level": exam.level,
            "date": exam.date.isoformat() if exam.date else None,
            "description": exam.description
        }
        for exam in exams
    ]

@router.get("/institutions", response_model=List[dict])
async def get_public_institutions(
    region: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get list of verified institutions for public information."""
    query = db.query(Institution).filter(Institution.is_verified == True)
    
    if region:
        query = query.filter(Institution.region == region)
    
    if type:
        query = query.filter(Institution.type == type)
    
    institutions = query.all()
    
    return [
        {
            "institution_id": str(inst.institution_id),
            "name": inst.name,
            "type": inst.type,
            "region": inst.region,
            "address": inst.address
        }
        for inst in institutions
    ]

@router.get("/statistics")
async def get_public_statistics(
    db: Session = Depends(get_db)
):
    """Get public statistics."""
    total_institutions = db.query(Institution).filter(Institution.is_verified == True).count()
    total_published_results = db.query(Results).filter(Results.is_published == True).count()
    total_active_exams = db.query(Exam).filter(Exam.status == "Active").count()
    
    return {
        "total_verified_institutions": total_institutions,
        "total_published_results": total_published_results,
        "total_active_exams": total_active_exams
    }
