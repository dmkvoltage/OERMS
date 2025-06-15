from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, func

from app.database import get_db
from app.models import ExamRegistration, Student, Exam, ExamSession
from app.schemas import APIResponse
from app.core.security import get_ministry_admin  # Use ministry admin for now

router = APIRouter()

# FR8: Can verify and finalize student registrations for public exams
@router.post("/registrations/{registration_id}/verify", response_model=APIResponse)
async def verify_exam_registration(
    registration_id: str,
    current_user = Depends(get_ministry_admin),  # Use ministry admin for now
    db: Session = Depends(get_db)
):
    """FR8: Verify and finalize student registrations for public exams."""
    
    registration = db.query(ExamRegistration).filter(
        ExamRegistration.registration_id == registration_id
    ).first()
    
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found"
        )
    
    # Verify the registration
    registration.status = "Approved"
    registration.verified_by = str(current_user.ministry_admin_id)
    registration.verification_date = func.current_date()
    
    # Generate candidate number
    exam = registration.exam
    candidate_number = f"{exam.type[:3]}{exam.date.year}{str(registration.student_id).replace('-', '')[:6].upper()}"
    registration.candidate_number = candidate_number
    
    db.commit()
    
    return APIResponse(
        success=True,
        message=f"Registration verified. Candidate number: {candidate_number}"
    )

@router.get("/registrations/pending")
async def get_pending_registrations(
    current_user = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Get pending exam registrations for verification."""
    
    pending_registrations = db.query(ExamRegistration).filter(
        ExamRegistration.status == "Pending"
    ).all()
    
    return [
        {
            "registration_id": str(r.registration_id),
            "student_name": f"{r.student.first_name} {r.student.last_name}",
            "exam_title": r.exam.title if r.exam else "N/A",
            "registration_date": r.registration_date,
            "institution": getattr(r.student, 'institution_name', 'N/A')
        } for r in pending_registrations
    ]

# FR9: Can manage examination sessions and scheduling for the institution
@router.post("/sessions", response_model=APIResponse)
async def create_exam_session(
    session_data: dict,
    current_user = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """FR9: Create examination sessions and scheduling."""
    
    # Create exam session
    session = ExamSession(
        exam_id=session_data['exam_id'],
        subject_id=session_data.get('subject_id'),
        institution_id=session_data.get('institution_id'),
        session_date=session_data['session_date'],
        start_time=session_data['start_time'],
        end_time=session_data['end_time'],
        venue=session_data.get('venue'),
        invigilator_id=str(current_user.ministry_admin_id)
    )
    
    db.add(session)
    db.commit()
    
    return APIResponse(
        success=True,
        message="Exam session created successfully"
    )

@router.get("/sessions")
async def get_exam_sessions(
    current_user = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Get examination sessions managed by this officer."""
    
    sessions = db.query(ExamSession).filter(
        ExamSession.invigilator_id == str(current_user.ministry_admin_id)
    ).all()
    
    return [
        {
            "session_id": str(s.session_id),
            "exam_title": s.exam.title if s.exam else "N/A",
            "session_date": s.session_date,
            "start_time": str(s.start_time),
            "end_time": str(s.end_time),
            "venue": s.venue
        } for s in sessions
    ]
