from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from app.database import get_db
from app.models import Results, Student, Exam, ExamRegistration
from app.schemas import PublicResultSearch, PublicResultResponse

router = APIRouter()

# FR16: Can search and view national/public exam results using candidate number or school code
@router.post("/search-results", response_model=List[PublicResultResponse])
async def search_public_exam_results(
    search_data: PublicResultSearch,
    db: Session = Depends(get_db)
):
    """FR16: Search and view national/public exam results using candidate number or school code."""
    
    if not any([search_data.candidate_number, search_data.exam_code, search_data.student_number]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one search parameter (candidate_number, exam_code, or student_number) is required"
        )
    
    # Build query for published results only
    query = db.query(Results).join(Student).join(Exam).join(ExamRegistration)
    query = query.filter(Results.is_published == True)
    
    # Apply search filters
    search_conditions = []
    
    if search_data.candidate_number:
        search_conditions.append(
            ExamRegistration.candidate_number == search_data.candidate_number
        )
    
    if search_data.exam_code:
        # Search by exam title or type
        search_conditions.append(
            or_(
                Exam.title.ilike(f"%{search_data.exam_code}%"),
                Exam.type.ilike(f"%{search_data.exam_code}%")
            )
        )
    
    if search_data.student_number:
        # Search by student email or name
        search_conditions.append(
            or_(
                Student.email.ilike(f"%{search_data.student_number}%"),
                Student.first_name.ilike(f"%{search_data.student_number}%"),
                Student.last_name.ilike(f"%{search_data.student_number}%")
            )
        )
    
    if search_conditions:
        query = query.filter(or_(*search_conditions))
    
    results = query.all()
    
    if not results:
        return []
    
    # Format results for public display
    public_results = []
    for result in results:
        student = result.student
        exam = result.exam
        
        # Get the registration to access candidate number
        registration = db.query(ExamRegistration).filter(
            and_(
                ExamRegistration.student_id == result.student_id,
                ExamRegistration.exam_id == result.exam_id
            )
        ).first()
        
        # Calculate overall status based on scores
        overall_status = "PENDING"
        if result.status == "Pass":
            overall_status = "PASS"
        elif result.status == "Fail":
            overall_status = "FAIL"
        elif result.status == "Absent":
            overall_status = "ABSENT"
        
        # Format scores for display
        formatted_results = []
        if result.scores:
            for subject, score in result.scores.items():
                formatted_results.append({
                    "subject": subject,
                    "score": score,
                    "grade": result.grade or "N/A"
                })
        
        public_result = PublicResultResponse(
            candidate_number=registration.candidate_number if registration else "N/A",
            student_name=f"{student.first_name} {student.last_name}",
            exam_title=exam.title,
            exam_year=str(exam.date.year) if exam.date else "N/A",
            institution_name=student.institution_name or "Unknown Institution",
            results=formatted_results,
            overall_status=overall_status
        )
        public_results.append(public_result)
    
    return public_results

@router.get("/exam-statistics")
async def get_public_exam_statistics(
    exam_type: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Get public statistics for published exam results."""
    
    query = db.query(Results).join(Exam)
    query = query.filter(Results.is_published == True)
    
    if exam_type:
        query = query.filter(Exam.type == exam_type)
    
    if year:
        query = query.filter(func.extract('year', Exam.date) == year)
    
    results = query.all()
    
    # Calculate statistics
    total_candidates = len(results)
    passed = len([r for r in results if r.status == "Pass"])
    failed = len([r for r in results if r.status == "Fail"])
    absent = len([r for r in results if r.status == "Absent"])
    
    pass_rate = (passed / total_candidates * 100) if total_candidates > 0 else 0
    
    return {
        "total_candidates": total_candidates,
        "passed": passed,
        "failed": failed,
        "absent": absent,
        "pass_rate": round(pass_rate, 2),
        "exam_type": exam_type,
        "year": year
    }

@router.get("/available-exams")
async def get_available_public_exams(db: Session = Depends(get_db)):
    """Get list of available public exams for information."""
    
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
            "description": exam.description,
            "duration": exam.duration
        }
        for exam in exams
    ]
