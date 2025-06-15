from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
import logging

from app.database import get_db
from app.models import Institution, Student, InstitutionalAdmin
from app.schemas import (
    InstitutionResponse, InstitutionCreate, InstitutionUpdate,
    APIResponse, PaginatedResponse, InstitutionType, RegionType
)
from app.core.auth import get_ministry_admin, get_institutional_admin, AuthService

# Setup logging
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=InstitutionResponse)
async def create_institution(
    institution_data: InstitutionCreate,
    current_user = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Create a new institution (Ministry Admin only)."""
    try:
        logger.info(f"Creating institution with data: {institution_data.dict()}")
        
        # Check if institution name already exists
        existing = db.query(Institution).filter(Institution.name == institution_data.name).first()
        if existing:
            logger.warning(f"Institution with name '{institution_data.name}' already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Institution with this name already exists"
            )
        
        # Create institution with explicit field mapping
        institution_dict = {
            "name": institution_data.name,
            "address": institution_data.address,
            "type": institution_data.type,
            "region": institution_data.region,
            "phone_number": institution_data.phone_number,
            "email": institution_data.email,
        }
        
        logger.info(f"Creating Institution object with: {institution_dict}")
        
        institution = Institution(**institution_dict)
        db.add(institution)
        db.commit()
        
        # Don't use db.refresh() - it causes enum issues
        # Instead, query the institution back manually
        created_institution = db.query(Institution).filter(
            Institution.institution_id == institution.institution_id
        ).first()
        
        if not created_institution:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Institution was created but could not be retrieved"
            )
        
        logger.info(f"Institution created successfully with ID: {created_institution.institution_id}")
        
        # Return response without using from_orm to avoid enum issues
        return InstitutionResponse(
            institution_id=str(created_institution.institution_id),
            name=created_institution.name,
            address=created_institution.address,
            type=str(created_institution.type),
            region=str(created_institution.region),
            phone_number=created_institution.phone_number,
            email=created_institution.email,
            is_verified=created_institution.is_verified,
            created_at=created_institution.created_at.isoformat() if created_institution.created_at else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating institution: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create institution: {str(e)}"
        )

@router.get("/", response_model=PaginatedResponse)
async def get_institutions(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    type: Optional[str] = None,
    region: Optional[str] = None,
    verified: Optional[bool] = None,
    search: Optional[str] = None,
    current_user = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get paginated list of institutions - accessible to all authenticated users."""
    try:
        logger.info(f"User {getattr(current_user, 'email', 'unknown')} ({getattr(current_user, 'user_type', 'unknown')}) fetching institutions")
        logger.info(f"Fetching institutions with filters: type={type}, region={region}, verified={verified}, search={search}")
        
        query = db.query(Institution)
        
        # Apply filters
        if type:
            query = query.filter(Institution.type == type)
        
        if region:
            query = query.filter(Institution.region == region)
        
        if verified is not None:
            query = query.filter(Institution.is_verified == verified)
        
        # Search functionality
        if search:
            search_filter = or_(
                Institution.name.ilike(f"%{search}%"),
                Institution.address.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)
        
        # Get total count
        total = query.count()
        logger.info(f"Total institutions found: {total}")
        
        # Apply pagination
        offset = (page - 1) * size
        institutions = query.offset(offset).limit(size).all()
        
        logger.info(f"Returning {len(institutions)} institutions for page {page}")
        
        # Convert to response format manually to avoid enum issues
        institution_responses = []
        for inst in institutions:
            institution_responses.append(InstitutionResponse(
                institution_id=str(inst.institution_id),
                name=inst.name,
                address=inst.address,
                type=str(inst.type),
                region=str(inst.region),
                phone_number=inst.phone_number,
                email=inst.email,
                is_verified=inst.is_verified,
                created_at=inst.created_at.isoformat() if inst.created_at else None
            ))
        
        return PaginatedResponse(
            items=institution_responses,
            total=total,
            page=page,
            size=size,
            pages=(total + size - 1) // size
        )
    except Exception as e:
        logger.error(f"Error fetching institutions: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch institutions: {str(e)}"
        )

@router.get("/{institution_id}", response_model=InstitutionResponse)
async def get_institution(
    institution_id: str,
    current_user = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get institution by ID - accessible to all authenticated users."""
    try:
        institution = db.query(Institution).filter(Institution.institution_id == institution_id).first()
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found"
            )
        
        return InstitutionResponse(
            institution_id=str(institution.institution_id),
            name=institution.name,
            address=institution.address,
            type=str(institution.type),
            region=str(institution.region),
            phone_number=institution.phone_number,
            email=institution.email,
            is_verified=institution.is_verified,
            created_at=institution.created_at.isoformat() if institution.created_at else None
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching institution {institution_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch institution: {str(e)}"
        )

@router.put("/{institution_id}", response_model=InstitutionResponse)
async def update_institution(
    institution_id: str,
    institution_update: InstitutionUpdate,
    current_user = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Update institution information."""
    try:
        institution = db.query(Institution).filter(Institution.institution_id == institution_id).first()
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found"
            )
        
        # Check permissions - institutional admin can only update their own institution
        # Ministry admin can update any institution
        user_type = getattr(current_user, 'user_type', None)
        if user_type == 'institutional_admin':
            if hasattr(current_user, 'institution_id') and str(current_user.institution_id) != institution_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to update this institution"
                )
        elif user_type != 'ministry_admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update institutions"
            )
        
        # Update institution fields
        update_data = institution_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(institution, field, value)
        
        db.commit()
        
        # Return updated institution without refresh
        updated_institution = db.query(Institution).filter(
            Institution.institution_id == institution_id
        ).first()
        
        return InstitutionResponse(
            institution_id=str(updated_institution.institution_id),
            name=updated_institution.name,
            address=updated_institution.address,
            type=str(updated_institution.type),
            region=str(updated_institution.region),
            phone_number=updated_institution.phone_number,
            email=updated_institution.email,
            is_verified=updated_institution.is_verified,
            created_at=updated_institution.created_at.isoformat() if updated_institution.created_at else None
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating institution {institution_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update institution: {str(e)}"
        )

@router.post("/{institution_id}/verify", response_model=APIResponse)
async def verify_institution(
    institution_id: str,
    current_user = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Verify an institution (Ministry Admin only)."""
    try:
        institution = db.query(Institution).filter(Institution.institution_id == institution_id).first()
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found"
            )
        
        institution.is_verified = True
        db.commit()
        
        return APIResponse(
            success=True,
            message="Institution verified successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error verifying institution {institution_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to verify institution: {str(e)}"
        )

@router.delete("/{institution_id}", response_model=APIResponse)
async def delete_institution(
    institution_id: str,
    current_user = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Delete institution (Ministry Admin only)."""
    try:
        institution = db.query(Institution).filter(Institution.institution_id == institution_id).first()
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found"
            )
        
        # Check if institution has students or institutional admins
        students_count = db.query(Student).filter(Student.institution_id == institution.institution_id).count()
        admins_count = db.query(InstitutionalAdmin).filter(InstitutionalAdmin.institution_id == institution.institution_id).count()
        
        if students_count > 0 or admins_count > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot delete institution with existing students ({students_count}) or admins ({admins_count})"
            )
        
        db.delete(institution)
        db.commit()
        
        return APIResponse(
            success=True,
            message="Institution deleted successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting institution {institution_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete institution: {str(e)}"
        )

@router.get("/{institution_id}/students")
async def get_institution_students(
    institution_id: str,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get students from a specific institution."""
    try:
        # Get institution
        institution = db.query(Institution).filter(Institution.institution_id == institution_id).first()
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found"
            )
        
        # Check permissions - institutional admin can only view their own institution's students
        user_type = getattr(current_user, 'user_type', None)
        if user_type == 'institutional_admin':
            if hasattr(current_user, 'institution_id') and str(current_user.institution_id) != institution_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Can only view students from your own institution"
                )
        elif user_type not in ['ministry_admin', 'institutional_admin']:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view institution students"
            )
        
        # Get students
        query = db.query(Student).filter(Student.institution_id == institution.institution_id)
        total = query.count()
        
        offset = (page - 1) * size
        students = query.offset(offset).limit(size).all()
        
        student_list = []
        for student in students:
            student_list.append({
                "student_id": str(student.student_id),
                "first_name": student.first_name,
                "last_name": student.last_name,
                "email": student.email,
                "phone_number": student.phone_number,
                "gender": str(student.gender) if student.gender else None,
                "is_active": student.is_active,
                "created_at": student.created_at.isoformat() if student.created_at else None
            })
        
        return {
            "institution": {
                "institution_id": str(institution.institution_id),
                "name": institution.name,
                "type": str(institution.type),
                "region": str(institution.region)
            },
            "students": student_list,
            "total_students": total,
            "page": page,
            "size": size,
            "pages": (total + size - 1) // size
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching institution students {institution_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch institution students: {str(e)}"
        )

@router.get("/{institution_id}/statistics")
async def get_institution_statistics(
    institution_id: str,
    current_user = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get statistics for a specific institution."""
    try:
        # Get institution
        institution = db.query(Institution).filter(Institution.institution_id == institution_id).first()
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found"
            )
        
        # Check permissions - institutional admin can only view their own institution's statistics
        user_type = getattr(current_user, 'user_type', None)
        if user_type == 'institutional_admin':
            if hasattr(current_user, 'institution_id') and str(current_user.institution_id) != institution_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Can only view statistics for your own institution"
                )
        elif user_type not in ['ministry_admin', 'institutional_admin']:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view institution statistics"
            )
        
        # Get statistics
        total_students = db.query(Student).filter(Student.institution_id == institution.institution_id).count()
        active_students = db.query(Student).filter(
            Student.institution_id == institution.institution_id,
            Student.is_active == True
        ).count()
        
        total_admins = db.query(InstitutionalAdmin).filter(
            InstitutionalAdmin.institution_id == institution.institution_id
        ).count()
        
        # Get exam registrations count
        from app.models import ExamRegistration
        exam_registrations = db.query(ExamRegistration).join(Student).filter(
            Student.institution_id == institution.institution_id
        ).count()
        
        # Get published results count
        from app.models import Results
        published_results = db.query(Results).join(Student).filter(
            Student.institution_id == institution.institution_id,
            Results.is_published == True
        ).count()
        
        return {
            "institution": {
                "institution_id": str(institution.institution_id),
                "name": institution.name,
                "type": str(institution.type),
                "region": str(institution.region),
                "is_verified": institution.is_verified
            },
            "statistics": {
                "total_students": total_students,
                "active_students": active_students,
                "inactive_students": total_students - active_students,
                "total_admins": total_admins,
                "exam_registrations": exam_registrations,
                "published_results": published_results
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching institution statistics {institution_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch institution statistics: {str(e)}"
        )
