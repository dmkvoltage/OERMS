from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime, date
import logging

from app.database import get_db
from app.core.database_operations import DatabaseOperations, DatabasePerformance, IndexingStrategy
from app.models import *
from app.schemas import *

# Setup logging
operations_logger = logging.getLogger("comprehensive_operations")

router = APIRouter(prefix="/operations", tags=["Comprehensive Operations"])

# SEARCH OPERATIONS
@router.get("/search/students", response_model=List[Dict[str, Any]])
async def search_students(
    search_term: str = Query(..., description="Search term for student name, email, or student number"),
    institution_id: Optional[str] = Query(None, description="Filter by institution ID"),
    db: Session = Depends(get_db)
):
    """Search students by various criteria."""
    try:
        students = DatabaseOperations.search_students_by_criteria(
            db=db, 
            search_term=search_term, 
            institution_id=institution_id
        )
        
        return [
            {
                "student_id": str(student.student_id),
                "first_name": student.first_name,
                "last_name": student.last_name,
                "email": student.email,
                "student_number": student.student_number,
                "institution_name": student.institution.name if student.institution else None,
                "is_active": student.is_active
            }
            for student in students
        ]
    except Exception as e:
        operations_logger.error(f"Failed to search students: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/search/exams", response_model=List[Dict[str, Any]])
async def search_exams(
    exam_type: Optional[str] = Query(None, description="Filter by exam type"),
    start_date: Optional[date] = Query(None, description="Start date filter"),
    end_date: Optional[date] = Query(None, description="End date filter"),
    db: Session = Depends(get_db)
):
    """Search exams by type and date range."""
    try:
        exams = DatabaseOperations.search_exams_by_type_and_date(
            db=db,
            exam_type=exam_type,
            start_date=start_date,
            end_date=end_date
        )
        
        return [
            {
                "exam_id": str(exam.exam_id),
                "title": exam.title,
                "type": exam.type.value if exam.type else None,
                "date": exam.date.isoformat() if exam.date else None,
                "level": exam.level.value if exam.level else None,
                "status": exam.status.value if exam.status else None,
                "exam_body": exam.exam_body.name if exam.exam_body else None
            }
            for exam in exams
        ]
    except Exception as e:
        operations_logger.error(f"Failed to search exams: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/search/institutions", response_model=List[Dict[str, Any]])
async def search_institutions(
    region: str = Query(..., description="Region to search in"),
    institution_type: Optional[str] = Query(None, description="Filter by institution type"),
    db: Session = Depends(get_db)
):
    """Search institutions by region and type."""
    try:
        institutions = DatabaseOperations.search_institutions_by_region(
            db=db,
            region=region,
            institution_type=institution_type
        )
        
        return [
            {
                "institution_id": str(institution.institution_id),
                "name": institution.name,
                "type": institution.type.value if institution.type else None,
                "region": institution.region.value if institution.region else None,
                "address": institution.address,
                "is_verified": institution.is_verified,
                "student_count": len(institution.students) if institution.students else 0
            }
            for institution in institutions
        ]
    except Exception as e:
        operations_logger.error(f"Failed to search institutions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/search/results", response_model=List[Dict[str, Any]])
async def search_results(
    status: str = Query(..., description="Result status to search for"),
    exam_id: Optional[str] = Query(None, description="Filter by exam ID"),
    institution_id: Optional[str] = Query(None, description="Filter by institution ID"),
    db: Session = Depends(get_db)
):
    """Search results by status with optional filters."""
    try:
        results = DatabaseOperations.search_results_by_status(
            db=db,
            status=status,
            exam_id=exam_id,
            institution_id=institution_id
        )
        
        return [
            {
                "result_id": str(result.result_id),
                "student_name": f"{result.student.first_name} {result.student.last_name}",
                "exam_title": result.exam.title,
                "grade": result.grade,
                "status": result.status.value if result.status else None,
                "is_published": result.is_published,
                "published_date": result.published_date.isoformat() if result.published_date else None
            }
            for result in results
        ]
    except Exception as e:
        operations_logger.error(f"Failed to search results: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

# DATA ADDITION OPERATIONS
@router.post("/add/student", response_model=Dict[str, Any])
async def add_student_operation(
    student_data: Dict[str, Any],
    enrolled_by: str = Query(..., description="ID of the institutional admin enrolling the student"),
    db: Session = Depends(get_db)
):
    """Add a new student with comprehensive validation."""
    try:
        student = DatabaseOperations.add_student(
            db=db,
            student_data=student_data,
            enrolled_by=enrolled_by
        )
        
        return {
            "success": True,
            "student_id": str(student.student_id),
            "message": f"Student {student.first_name} {student.last_name} added successfully",
            "enrollment_date": student.enrollment_date.isoformat() if student.enrollment_date else None
        }
    except Exception as e:
        operations_logger.error(f"Failed to add student: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to add student: {str(e)}")

@router.post("/add/exam", response_model=Dict[str, Any])
async def add_exam_operation(
    exam_data: Dict[str, Any],
    created_by: str = Query(..., description="ID of the ministry admin creating the exam"),
    db: Session = Depends(get_db)
):
    """Add a new exam."""
    try:
        exam = DatabaseOperations.add_exam(
            db=db,
            exam_data=exam_data,
            created_by=created_by
        )
        
        return {
            "success": True,
            "exam_id": str(exam.exam_id),
            "message": f"Exam '{exam.title}' created successfully",
            "created_date": exam.created_date.isoformat() if exam.created_date else None
        }
    except Exception as e:
        operations_logger.error(f"Failed to add exam: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to add exam: {str(e)}")

@router.post("/add/institution", response_model=Dict[str, Any])
async def add_institution_operation(
    institution_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Add a new institution."""
    try:
        institution = DatabaseOperations.add_institution(
            db=db,
            institution_data=institution_data
        )
        
        return {
            "success": True,
            "institution_id": str(institution.institution_id),
            "message": f"Institution '{institution.name}' added successfully",
            "registration_date": institution.registration_date.isoformat() if institution.registration_date else None
        }
    except Exception as e:
        operations_logger.error(f"Failed to add institution: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to add institution: {str(e)}")

@router.post("/add/registration", response_model=Dict[str, Any])
async def add_exam_registration_operation(
    student_id: str = Query(..., description="Student ID"),
    exam_id: str = Query(..., description="Exam ID"),
    db: Session = Depends(get_db)
):
    """Register a student for an exam."""
    try:
        registration = DatabaseOperations.add_exam_registration(
            db=db,
            student_id=student_id,
            exam_id=exam_id
        )
        
        return {
            "success": True,
            "registration_id": str(registration.registration_id),
            "message": "Student registered for exam successfully",
            "status": registration.status.value if registration.status else None,
            "registration_date": registration.registration_date.isoformat() if registration.registration_date else None
        }
    except Exception as e:
        operations_logger.error(f"Failed to add exam registration: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to register student: {str(e)}")

@router.post("/add/result", response_model=Dict[str, Any])
async def add_result_operation(
    result_data: Dict[str, Any],
    verified_by: str = Query(..., description="ID of the person verifying the result"),
    db: Session = Depends(get_db)
):
    """Add an exam result."""
    try:
        result = DatabaseOperations.add_result(
            db=db,
            result_data=result_data,
            verified_by=verified_by
        )
        
        return {
            "success": True,
            "result_id": str(result.result_id),
            "message": "Result added successfully",
            "grade": result.grade,
            "status": result.status.value if result.status else None
        }
    except Exception as e:
        operations_logger.error(f"Failed to add result: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to add result: {str(e)}")

# UPDATE OPERATIONS
@router.put("/update/student/{student_id}", response_model=Dict[str, Any])
async def update_student_profile_operation(
    student_id: str,
    update_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Update student profile information."""
    try:
        student = DatabaseOperations.update_student_profile(
            db=db,
            student_id=student_id,
            update_data=update_data
        )
        
        return {
            "success": True,
            "student_id": str(student.student_id),
            "message": "Student profile updated successfully",
            "updated_at": student.updated_at.isoformat() if student.updated_at else None
        }
    except Exception as e:
        operations_logger.error(f"Failed to update student profile: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update student: {str(e)}")

@router.put("/update/exam/{exam_id}/status", response_model=Dict[str, Any])
async def update_exam_status_operation(
    exam_id: str,
    new_status: str = Query(..., description="New exam status"),
    updated_by: str = Query(..., description="ID of the person updating the status"),
    db: Session = Depends(get_db)
):
    """Update exam status."""
    try:
        exam = DatabaseOperations.update_exam_status(
            db=db,
            exam_id=exam_id,
            new_status=new_status,
            updated_by=updated_by
        )
        
        return {
            "success": True,
            "exam_id": str(exam.exam_id),
            "message": f"Exam status updated to {new_status}",
            "status": exam.status.value if exam.status else None,
            "updated_at": exam.updated_at.isoformat() if exam.updated_at else None
        }
    except Exception as e:
        operations_logger.error(f"Failed to update exam status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update exam status: {str(e)}")

@router.put("/update/institution/{institution_id}/verification", response_model=Dict[str, Any])
async def update_institution_verification_operation(
    institution_id: str,
    is_verified: bool = Query(..., description="Verification status"),
    verified_by: str = Query(..., description="ID of the ministry admin verifying"),
    db: Session = Depends(get_db)
):
    """Update institution verification status."""
    try:
        institution = DatabaseOperations.update_institution_verification(
            db=db,
            institution_id=institution_id,
            is_verified=is_verified,
            verified_by=verified_by
        )
        
        return {
            "success": True,
            "institution_id": str(institution.institution_id),
            "message": f"Institution verification {'approved' if is_verified else 'rejected'}",
            "is_verified": institution.is_verified,
            "updated_at": institution.updated_at.isoformat() if institution.updated_at else None
        }
    except Exception as e:
        operations_logger.error(f"Failed to update institution verification: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update verification: {str(e)}")

@router.put("/update/registration/{registration_id}/status", response_model=Dict[str, Any])
async def update_registration_status_operation(
    registration_id: str,
    new_status: str = Query(..., description="New registration status"),
    verified_by: str = Query(..., description="ID of the person verifying"),
    db: Session = Depends(get_db)
):
    """Update exam registration status."""
    try:
        registration = DatabaseOperations.update_registration_status(
            db=db,
            registration_id=registration_id,
            new_status=new_status,
            verified_by=verified_by
        )
        
        return {
            "success": True,
            "registration_id": str(registration.registration_id),
            "message": f"Registration status updated to {new_status}",
            "status": registration.status.value if registration.status else None,
            "candidate_number": registration.candidate_number,
            "verification_date": registration.verification_date.isoformat() if registration.verification_date else None
        }
    except Exception as e:
        operations_logger.error(f"Failed to update registration status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update registration: {str(e)}")

@router.put("/update/results/{exam_id}/publish", response_model=Dict[str, Any])
async def publish_results_operation(
    exam_id: str,
    published_by: str = Query(..., description="ID of the ministry admin publishing results"),
    db: Session = Depends(get_db)
):
    """Publish all results for an exam."""
    try:
        updated_count = DatabaseOperations.update_result_publication(
            db=db,
            exam_id=exam_id,
            published_by=published_by
        )
        
        return {
            "success": True,
            "exam_id": exam_id,
            "message": f"Published {updated_count} results",
            "published_count": updated_count,
            "published_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        operations_logger.error(f"Failed to publish results: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to publish results: {str(e)}")

# DELETE OPERATIONS
@router.delete("/delete/exam/{exam_id}", response_model=Dict[str, Any])
async def delete_exam_operation(
    exam_id: str,
    deleted_by: str = Query(..., description="ID of the ministry admin deleting the exam"),
    db: Session = Depends(get_db)
):
    """Delete an exam (Ministry Admin only)."""
    try:
        success = DatabaseOperations.delete_exam(
            db=db,
            exam_id=exam_id,
            deleted_by=deleted_by
        )
        
        return {
            "success": success,
            "exam_id": exam_id,
            "message": "Exam deleted successfully",
            "deleted_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        operations_logger.error(f"Failed to delete exam: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete exam: {str(e)}")

@router.delete("/delete/institution/{institution_id}", response_model=Dict[str, Any])
async def delete_institution_operation(
    institution_id: str,
    deleted_by: str = Query(..., description="ID of the ministry admin deleting the institution"),
    db: Session = Depends(get_db)
):
    """Delete an institution (Ministry Admin only)."""
    try:
        success = DatabaseOperations.delete_institution(
            db=db,
            institution_id=institution_id,
            deleted_by=deleted_by
        )
        
        return {
            "success": success,
            "institution_id": institution_id,
            "message": "Institution deleted successfully",
            "deleted_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        operations_logger.error(f"Failed to delete institution: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete institution: {str(e)}")

# RECOVERY OPERATIONS
@router.post("/recovery/student", response_model=Dict[str, Any])
async def recover_student_data_operation(
    student_email: str = Query(..., description="Email of the student to recover"),
    db: Session = Depends(get_db)
):
    """Initiate student data recovery."""
    try:
        recovery_info = DatabaseOperations.recover_deleted_student_data(
            db=db,
            student_email=student_email
        )
        
        return recovery_info
    except Exception as e:
        operations_logger.error(f"Failed to initiate student data recovery: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Recovery failed: {str(e)}")

@router.post("/recovery/results/{exam_id}", response_model=Dict[str, Any])
async def recover_exam_results_operation(
    exam_id: str,
    db: Session = Depends(get_db)
):
    """Recover exam results after system failure."""
    try:
        recovery_info = DatabaseOperations.recover_exam_results_after_failure(
            db=db,
            exam_id=exam_id
        )
        
        return recovery_info
    except Exception as e:
        operations_logger.error(f"Failed to recover exam results: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Recovery failed: {str(e)}")

# PERFORMANCE OPERATIONS
@router.get("/performance/analyze", response_model=Dict[str, Any])
async def analyze_query_performance_operation(
    query_sql: str = Query(..., description="SQL query to analyze"),
    db: Session = Depends(get_db)
):
    """Analyze query performance."""
    try:
        analysis = DatabasePerformance.analyze_query_performance(
            db=db,
            query_sql=query_sql
        )
        
        return analysis
    except Exception as e:
        operations_logger.error(f"Failed to analyze query performance: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/performance/slow-queries", response_model=List[Dict[str, Any]])
async def get_slow_queries_operation(
    limit: int = Query(10, description="Number of slow queries to return"),
    db: Session = Depends(get_db)
):
    """Get slow running queries."""
    try:
        slow_queries = DatabasePerformance.get_slow_queries(
            db=db,
            limit=limit
        )
        
        return slow_queries
    except Exception as e:
        operations_logger.error(f"Failed to get slow queries: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get slow queries: {str(e)}")

@router.get("/performance/table-stats", response_model=Dict[str, Any])
async def get_table_statistics_operation(
    db: Session = Depends(get_db)
):
    """Get table statistics."""
    try:
        stats = DatabasePerformance.get_table_statistics(db=db)
        return stats
    except Exception as e:
        operations_logger.error(f"Failed to get table statistics: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get statistics: {str(e)}")

@router.post("/performance/create-indexes", response_model=Dict[str, Any])
async def create_performance_indexes_operation(
    db: Session = Depends(get_db)
):
    """Create performance indexes."""
    try:
        IndexingStrategy.create_performance_indexes(db=db)
        
        return {
            "success": True,
            "message": "Performance indexes created successfully",
            "created_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        operations_logger.error(f"Failed to create indexes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create indexes: {str(e)}")
