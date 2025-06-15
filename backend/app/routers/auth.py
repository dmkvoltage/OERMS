from datetime import timedelta, datetime
from fastapi import APIRouter, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import Student, InstitutionalAdmin, MinistryAdmin, Institution
from app.schemas import Token, UserResponse, APIResponse, ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest, StudentCreate, MinistryAdminCreate
from app.core.auth import AuthService, UserRole
from app.core.config import settings

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Authenticate user and return access token."""
    
    # Try to find user in all user tables
    user = None
    user_type = None
    user_id = None
    
    # Check Student table
    student = db.query(Student).filter(Student.email == form_data.username).first()
    if student and AuthService.verify_password(form_data.password, student.password):
        user = student
        user_type = UserRole.STUDENT
        user_id = student.student_id
    
    # Check InstitutionalAdmin table
    if not user:
        institutional_admin = db.query(InstitutionalAdmin).filter(InstitutionalAdmin.email == form_data.username).first()
        if institutional_admin and AuthService.verify_password(form_data.password, institutional_admin.password):
            user = institutional_admin
            user_type = UserRole.INSTITUTIONAL_ADMIN
            user_id = institutional_admin.institutional_admin_id
    
    # Check MinistryAdmin table
    if not user:
        ministry_admin = db.query(MinistryAdmin).filter(MinistryAdmin.email == form_data.username).first()
        if ministry_admin and AuthService.verify_password(form_data.password, ministry_admin.password):
            user = ministry_admin
            user_type = UserRole.MINISTRY_ADMIN
            user_id = ministry_admin.ministry_admin_id
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive"
        )
    
    # Create access token with permissions
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    permissions = AuthService.get_user_permissions(user_type.value)
    
    access_token = AuthService.create_access_token(
        data={
            "sub": str(user_id), 
            "user_type": user_type.value,
            "permissions": permissions,
            "email": user.email,
            "institution_name": getattr(user, 'institution_name', None)
        },
        expires_delta=access_token_expires
    )
    
    # Update last login
    if hasattr(user, 'last_login'):
        user.last_login = datetime.utcnow()
        db.commit()
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user_type=user_type.value,
        user_id=str(user_id)
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user = Depends(AuthService.get_current_user)
):
    """Get current user information."""
    
    user_info = {
        "user_id": str(getattr(current_user, 'student_id', None) or 
                      getattr(current_user, 'institutional_admin_id', None) or 
                      getattr(current_user, 'ministry_admin_id', None)),
        "user_type": current_user.user_type,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "phone_number": getattr(current_user, 'phone_number', None),
        "is_active": current_user.is_active,
        "permissions": getattr(current_user, 'permissions', []),
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None
    }
    
    # Add type-specific fields
    if isinstance(current_user, Student):
        user_info.update({
            "gender": current_user.gender,
            "institution_name": current_user.institution_name
        })
    elif isinstance(current_user, InstitutionalAdmin):
        user_info.update({
            "institution_name": current_user.institution_name,
            "title": getattr(current_user, 'title', None)
        })
    elif isinstance(current_user, MinistryAdmin):
        user_info.update({
            "type": getattr(current_user, 'type', None)
        })
    
    return user_info

@router.post("/change-password", response_model=APIResponse)
async def change_password(
    request: ChangePasswordRequest,
    current_user = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password."""
    # Verify current password
    if not AuthService.verify_password(request.current_password, current_user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Update password
    hashed_password = AuthService.get_password_hash(request.new_password)
    current_user.password = hashed_password
    db.commit()
    
    return APIResponse(
        success=True,
        message="Password changed successfully"
    )

@router.post("/forgot-password", response_model=APIResponse)
async def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """Request password reset."""
    # Try to find user in all user tables
    user = None
    user_type = None
    user_id = None
    
    # Check all user tables
    student = db.query(Student).filter(Student.email == request.email).first()
    if student:
        user = student
        user_type = UserRole.STUDENT
        user_id = student.student_id
    
    if not user:
        institutional_admin = db.query(InstitutionalAdmin).filter(InstitutionalAdmin.email == request.email).first()
        if institutional_admin:
            user = institutional_admin
            user_type = UserRole.INSTITUTIONAL_ADMIN
            user_id = institutional_admin.institutional_admin_id
    
    if not user:
        ministry_admin = db.query(MinistryAdmin).filter(MinistryAdmin.email == request.email).first()
        if ministry_admin:
            user = ministry_admin
            user_type = UserRole.MINISTRY_ADMIN
            user_id = ministry_admin.ministry_admin_id
    
    if not user:
        # Don't reveal that email doesn't exist for security reasons
        return APIResponse(
            success=True,
            message="If your email is registered, you will receive a password reset link"
        )
    
    # Generate reset token
    reset_token = AuthService.create_access_token(
        data={"sub": str(user_id), "user_type": user_type.value, "reset": True},
        expires_delta=timedelta(hours=1)
    )
    
    # In production, send email with reset link
    return APIResponse(
        success=True,
        message="If your email is registered, you will receive a password reset link",
        data={"reset_token": reset_token}  # Remove this in production
    )

@router.post("/reset-password", response_model=APIResponse)
async def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """Reset password using token."""
    try:
        # Verify token
        token_data = AuthService.verify_token(request.token)
        user_id = token_data.get("user_id")
        user_type = token_data.get("user_type")
        
        if not user_id or not user_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token"
            )
        
        # Find user based on user_type
        user = None
        if user_type == UserRole.STUDENT:
            user = db.query(Student).filter(Student.student_id == user_id).first()
        elif user_type == UserRole.INSTITUTIONAL_ADMIN:
            user = db.query(InstitutionalAdmin).filter(InstitutionalAdmin.institutional_admin_id == user_id).first()
        elif user_type == UserRole.MINISTRY_ADMIN:
            user = db.query(MinistryAdmin).filter(MinistryAdmin.ministry_admin_id == user_id).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update password
        hashed_password = AuthService.get_password_hash(request.new_password)
        user.password = hashed_password
        db.commit()
        
        return APIResponse(
            success=True,
            message="Password reset successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token or token expired"
        )

@router.post("/logout", response_model=APIResponse)
async def logout():
    """Logout user (client should remove token)."""
    return APIResponse(
        success=True,
        message="Successfully logged out"
    )

@router.post("/refresh", response_model=Token)
async def refresh_token(
    current_user = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Refresh access token."""
    # Create new access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    permissions = AuthService.get_user_permissions(current_user.user_type)
    
    user_id = (getattr(current_user, 'student_id', None) or 
               getattr(current_user, 'institutional_admin_id', None) or 
               getattr(current_user, 'ministry_admin_id', None))
    
    access_token = AuthService.create_access_token(
        data={
            "sub": str(user_id), 
            "user_type": current_user.user_type,
            "permissions": permissions,
            "email": current_user.email,
            "institution_name": getattr(current_user, 'institution_name', None)
        },
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user_type=current_user.user_type,
        user_id=str(user_id)
    )

@router.post("/register/student", response_model=APIResponse)
async def register_student(
    student_data: StudentCreate,
    db: Session = Depends(get_db)
):
    """Register a new student."""
    
    # Check if email already exists
    existing_user = db.query(Student).filter(Student.email == student_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if institution exists
    institution = db.query(Institution).filter(Institution.name == student_data.institution_name).first()
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Institution not found. Please contact your institution administrator."
        )
    
    # Create student
    hashed_password = AuthService.get_password_hash(student_data.password)
    
    new_student = Student(
        first_name=student_data.first_name,
        last_name=student_data.last_name,
        email=student_data.email,
        password=hashed_password,
        phone_number=student_data.phone_number,
        gender=student_data.gender,
        institution_id=institution.institution_id,
        student_number=f"STU{datetime.now().strftime('%Y%m%d%H%M%S')}"
    )
    
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    return APIResponse(
        success=True,
        message="Student registered successfully"
    )

@router.post("/register/institutional-admin", response_model=APIResponse)
async def register_institutional_admin(
    admin_data: dict,
    db: Session = Depends(get_db)
):
    """Register a new institutional admin."""
    
    # Check if email already exists
    existing_user = db.query(InstitutionalAdmin).filter(InstitutionalAdmin.email == admin_data["email"]).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if institution exists
    institution = db.query(Institution).filter(Institution.name == admin_data["institution_name"]).first()
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Institution not found. Please contact system administrator."
        )
    
    # Create institutional admin
    hashed_password = AuthService.get_password_hash(admin_data["password"])
    
    new_admin = InstitutionalAdmin(
        first_name=admin_data["first_name"],
        last_name=admin_data["last_name"],
        email=admin_data["email"],
        password=hashed_password,
        phone_number=admin_data.get("phone_number"),
        institution_id=institution.institution_id,
        title=admin_data.get("title")
    )
    
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    
    return APIResponse(
        success=True,
        message="Institutional admin registered successfully"
    )

@router.post("/register/ministry-admin", response_model=APIResponse)
async def register_ministry_admin(
    admin_data: MinistryAdminCreate,
    db: Session = Depends(get_db)
):
    """Register a new ministry admin."""
    try:
        # Check if email already exists
        existing_user = db.query(MinistryAdmin).filter(MinistryAdmin.email == admin_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create ministry admin
        hashed_password = AuthService.get_password_hash(admin_data.password)
        
        new_admin = MinistryAdmin(
            first_name=admin_data.first_name,
            last_name=admin_data.last_name,
            email=admin_data.email,
            password=hashed_password,
            phone_number=admin_data.phone_number,
            type=admin_data.type
        )
        
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
        
        return APIResponse(
            success=True,
            message="Ministry admin registered successfully"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
