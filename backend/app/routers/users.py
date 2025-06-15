from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import Student, InstitutionalAdmin, MinistryAdmin, Institution
from app.schemas import APIResponse, PaginatedResponse
from app.core.security import get_current_user, get_ministry_admin, get_institutional_admin

router = APIRouter()

@router.get("/", response_model=PaginatedResponse)
async def get_users(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    user_type: Optional[str] = Query(None, description="Filter by user type: student, institutional_admin, ministry_admin"),
    search: Optional[str] = None,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get paginated list of users (Admin access required)."""
    
    # Check if user has admin privileges
    if not hasattr(current_user, 'user_type') or current_user.user_type not in ["ministry_admin", "institutional_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    users = []
    total = 0
    
    # For institutional admins, only show users from their institution
    if current_user.user_type == "institutional_admin":
        # Get students from their institution
        query = db.query(Student).filter(Student.institution_name == current_user.institution_name)
        
        if search:
            search_filter = or_(
                Student.first_name.ilike(f"%{search}%"),
                Student.last_name.ilike(f"%{search}%"),
                Student.email.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)
        
        total = query.count()
        offset = (page - 1) * size
        students = query.offset(offset).limit(size).all()
        
        users = [
            {
                "user_id": str(student.student_id),
                "user_type": "student",
                "first_name": student.first_name,
                "last_name": student.last_name,
                "email": student.email,
                "phone_number": student.phone_number,
                "institution_name": student.institution_name,
                "is_active": student.is_active,
                "created_at": student.created_at.isoformat() if student.created_at else None
            }
            for student in students
        ]
    
    # For ministry admins, show all users
    elif current_user.user_type == "ministry_admin":
        all_users = []
        
        # Get students
        if not user_type or user_type == "student":
            students_query = db.query(Student)
            if search:
                search_filter = or_(
                    Student.first_name.ilike(f"%{search}%"),
                    Student.last_name.ilike(f"%{search}%"),
                    Student.email.ilike(f"%{search}%")
                )
                students_query = students_query.filter(search_filter)
            
            students = students_query.all()
            for student in students:
                all_users.append({
                    "user_id": str(student.student_id),
                    "user_type": "student",
                    "first_name": student.first_name,
                    "last_name": student.last_name,
                    "email": student.email,
                    "phone_number": student.phone_number,
                    "institution_name": student.institution_name,
                    "is_active": student.is_active,
                    "created_at": student.created_at.isoformat() if student.created_at else None
                })
        
        # Get institutional admins
        if not user_type or user_type == "institutional_admin":
            inst_admins_query = db.query(InstitutionalAdmin)
            if search:
                search_filter = or_(
                    InstitutionalAdmin.first_name.ilike(f"%{search}%"),
                    InstitutionalAdmin.last_name.ilike(f"%{search}%"),
                    InstitutionalAdmin.email.ilike(f"%{search}%")
                )
                inst_admins_query = inst_admins_query.filter(search_filter)
            
            inst_admins = inst_admins_query.all()
            for admin in inst_admins:
                all_users.append({
                    "user_id": str(admin.institutional_admin_id),
                    "user_type": "institutional_admin",
                    "first_name": admin.first_name,
                    "last_name": admin.last_name,
                    "email": admin.email,
                    "phone_number": admin.phone_number,
                    "institution_name": admin.institution_name,
                    "title": admin.title,
                    "is_active": admin.is_active,
                    "created_at": admin.created_at.isoformat() if admin.created_at else None
                })
        
        # Get ministry admins
        if not user_type or user_type == "ministry_admin":
            ministry_admins_query = db.query(MinistryAdmin)
            if search:
                search_filter = or_(
                    MinistryAdmin.first_name.ilike(f"%{search}%"),
                    MinistryAdmin.last_name.ilike(f"%{search}%"),
                    MinistryAdmin.email.ilike(f"%{search}%")
                )
                ministry_admins_query = ministry_admins_query.filter(search_filter)
            
            ministry_admins = ministry_admins_query.all()
            for admin in ministry_admins:
                all_users.append({
                    "user_id": str(admin.ministry_admin_id),
                    "user_type": "ministry_admin",
                    "first_name": admin.first_name,
                    "last_name": admin.last_name,
                    "email": admin.email,
                    "phone_number": admin.phone_number,
                    "type": admin.type,
                    "is_active": admin.is_active,
                    "created_at": admin.created_at.isoformat() if admin.created_at else None
                })
        
        # Apply pagination
        total = len(all_users)
        offset = (page - 1) * size
        users = all_users[offset:offset + size]
    
    return PaginatedResponse(
        items=users,
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )

@router.get("/{user_type}/{user_id}")
async def get_user(
    user_type: str,
    user_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user by type and ID."""
    
    # Check if user has admin privileges
    if not hasattr(current_user, 'user_type') or current_user.user_type not in ["ministry_admin", "institutional_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    user = None
    user_info = {}
    
    if user_type == "student":
        user = db.query(Student).filter(Student.student_id == user_id).first()
        if user:
            user_info = {
                "user_id": str(user.student_id),
                "user_type": "student",
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone_number": user.phone_number,
                "gender": user.gender,
                "institution_name": user.institution_name,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat() if user.created_at else None
            }
    
    elif user_type == "institutional_admin":
        user = db.query(InstitutionalAdmin).filter(InstitutionalAdmin.institutional_admin_id == user_id).first()
        if user:
            user_info = {
                "user_id": str(user.institutional_admin_id),
                "user_type": "institutional_admin",
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone_number": user.phone_number,
                "institution_name": user.institution_name,
                "title": user.title,
                "assigned_date": user.assigned_date.isoformat() if user.assigned_date else None,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat() if user.created_at else None
            }
    
    elif user_type == "ministry_admin":
        user = db.query(MinistryAdmin).filter(MinistryAdmin.ministry_admin_id == user_id).first()
        if user:
            user_info = {
                "user_id": str(user.ministry_admin_id),
                "user_type": "ministry_admin",
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone_number": user.phone_number,
                "type": user.type,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat() if user.created_at else None
            }
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check permissions for institutional admins
    if current_user.user_type == "institutional_admin":
        if user_type == "student" and user.institution_name != current_user.institution_name:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Can only view users from your institution"
            )
        elif user_type != "student":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Can only view students from your institution"
            )
    
    return user_info

@router.put("/{user_type}/{user_id}/activate", response_model=APIResponse)
async def activate_user(
    user_type: str,
    user_id: str,
    current_user = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Activate user account (Ministry Admin only)."""
    
    user = None
    
    if user_type == "student":
        user = db.query(Student).filter(Student.student_id == user_id).first()
    elif user_type == "institutional_admin":
        user = db.query(InstitutionalAdmin).filter(InstitutionalAdmin.institutional_admin_id == user_id).first()
    elif user_type == "ministry_admin":
        user = db.query(MinistryAdmin).filter(MinistryAdmin.ministry_admin_id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_active = True
    db.commit()
    
    return APIResponse(
        success=True,
        message=f"{user_type.replace('_', ' ').title()} activated successfully"
    )

@router.put("/{user_type}/{user_id}/deactivate", response_model=APIResponse)
async def deactivate_user(
    user_type: str,
    user_id: str,
    current_user = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Deactivate user account (Ministry Admin only)."""
    
    user = None
    
    if user_type == "student":
        user = db.query(Student).filter(Student.student_id == user_id).first()
    elif user_type == "institutional_admin":
        user = db.query(InstitutionalAdmin).filter(InstitutionalAdmin.institutional_admin_id == user_id).first()
    elif user_type == "ministry_admin":
        user = db.query(MinistryAdmin).filter(MinistryAdmin.ministry_admin_id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_active = False
    db.commit()
    
    return APIResponse(
        success=True,
        message=f"{user_type.replace('_', ' ').title()} deactivated successfully"
    )

@router.get("/statistics/overview")
async def get_user_statistics(
    current_user = Depends(get_ministry_admin),
    db: Session = Depends(get_db)
):
    """Get user statistics overview (Ministry Admin only)."""
    
    total_students = db.query(Student).count()
    active_students = db.query(Student).filter(Student.is_active == True).count()
    
    total_institutional_admins = db.query(InstitutionalAdmin).count()
    active_institutional_admins = db.query(InstitutionalAdmin).filter(InstitutionalAdmin.is_active == True).count()
    
    total_ministry_admins = db.query(MinistryAdmin).count()
    active_ministry_admins = db.query(MinistryAdmin).filter(MinistryAdmin.is_active == True).count()
    
    return {
        "students": {
            "total": total_students,
            "active": active_students,
            "inactive": total_students - active_students
        },
        "institutional_admins": {
            "total": total_institutional_admins,
            "active": active_institutional_admins,
            "inactive": total_institutional_admins - active_institutional_admins
        },
        "ministry_admins": {
            "total": total_ministry_admins,
            "active": active_ministry_admins,
            "inactive": total_ministry_admins - active_ministry_admins
        },
        "total_users": total_students + total_institutional_admins + total_ministry_admins
    }
