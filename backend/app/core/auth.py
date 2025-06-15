from datetime import datetime, timedelta
from typing import Optional, Union, Any, List
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from uuid import UUID
from enum import Enum

from app.database import get_db
from app.models import Student, InstitutionalAdmin, MinistryAdmin
from app.core.config import settings

# Enhanced authentication system with comprehensive RBAC
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

class UserRole(str, Enum):
    STUDENT = "student"
    INSTITUTIONAL_ADMIN = "institutional_admin"
    MINISTRY_ADMIN = "ministry_admin"
    EXAMINATION_OFFICER = "examination_officer"

class Permission(str, Enum):
    # Student permissions
    READ_OWN_DATA = "read_own_data"
    REGISTER_FOR_EXAMS = "register_for_exams"
    VIEW_OWN_RESULTS = "view_own_results"
    RECEIVE_NOTIFICATIONS = "receive_notifications"
    UPDATE_OWN_PROFILE = "update_own_profile"
    
    # Institutional Admin permissions
    MANAGE_INSTITUTION_STUDENTS = "manage_institution_students"
    UPLOAD_STUDENT_DOCUMENTS = "upload_student_documents"
    VIEW_INSTITUTION_DATA = "view_institution_data"
    REGISTER_STUDENTS = "register_students"
    VIEW_INSTITUTION_RESULTS = "view_institution_results"
    MANAGE_INSTITUTION_REGISTRATIONS = "manage_institution_registrations"
    
    # Ministry Admin permissions
    READ_ALL_DATA = "read_all_data"
    MANAGE_INSTITUTIONS = "manage_institutions"
    MANAGE_EXAMS = "manage_exams"
    PUBLISH_RESULTS = "publish_results"
    VIEW_SYSTEM_ANALYTICS = "view_system_analytics"
    MANAGE_USERS = "manage_users"
    CREATE_INSTITUTIONS = "create_institutions"
    DELETE_INSTITUTIONS = "delete_institutions"
    VERIFY_INSTITUTIONS = "verify_institutions"
    
    # Examination Officer permissions
    VERIFY_REGISTRATIONS = "verify_registrations"
    MANAGE_EXAM_SESSIONS = "manage_exam_sessions"
    SCHEDULE_EXAMS = "schedule_exams"
    
    # Common permissions
    VIEW_PUBLIC_DATA = "view_public_data"
    CHANGE_PASSWORD = "change_password"

# Role-Permission mapping
ROLE_PERMISSIONS = {
    UserRole.STUDENT: [
        Permission.READ_OWN_DATA,
        Permission.REGISTER_FOR_EXAMS,
        Permission.VIEW_OWN_RESULTS,
        Permission.RECEIVE_NOTIFICATIONS,
        Permission.UPDATE_OWN_PROFILE,
        Permission.VIEW_PUBLIC_DATA,
        Permission.CHANGE_PASSWORD,
    ],
    UserRole.INSTITUTIONAL_ADMIN: [
        Permission.READ_OWN_DATA,
        Permission.MANAGE_INSTITUTION_STUDENTS,
        Permission.UPLOAD_STUDENT_DOCUMENTS,
        Permission.VIEW_INSTITUTION_DATA,
        Permission.REGISTER_STUDENTS,
        Permission.VIEW_INSTITUTION_RESULTS,
        Permission.MANAGE_INSTITUTION_REGISTRATIONS,
        Permission.VIEW_PUBLIC_DATA,
        Permission.CHANGE_PASSWORD,
    ],
    UserRole.MINISTRY_ADMIN: [
        Permission.READ_ALL_DATA,
        Permission.MANAGE_INSTITUTIONS,
        Permission.MANAGE_EXAMS,
        Permission.PUBLISH_RESULTS,
        Permission.VIEW_SYSTEM_ANALYTICS,
        Permission.MANAGE_USERS,
        Permission.CREATE_INSTITUTIONS,
        Permission.DELETE_INSTITUTIONS,
        Permission.VERIFY_INSTITUTIONS,
        Permission.VIEW_PUBLIC_DATA,
        Permission.CHANGE_PASSWORD,
    ],
    UserRole.EXAMINATION_OFFICER: [
        Permission.READ_OWN_DATA,
        Permission.VERIFY_REGISTRATIONS,
        Permission.MANAGE_EXAM_SESSIONS,
        Permission.SCHEDULE_EXAMS,
        Permission.VIEW_INSTITUTION_DATA,
        Permission.VIEW_PUBLIC_DATA,
        Permission.CHANGE_PASSWORD,
    ],
}

class AuthService:
    """Centralized authentication service for all user types"""
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        """Hash password"""
        return pwd_context.hash(password)
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token with user type and permissions"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire, "iat": datetime.utcnow()})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> dict:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id: str = payload.get("sub")
            user_type: str = payload.get("user_type")
            
            if user_id is None or user_type is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token payload"
                )
            
            return {
                "user_id": user_id,
                "user_type": user_type,
                "permissions": payload.get("permissions", [])
            }
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )

    @staticmethod
    def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        db: Session = Depends(get_db)
    ) -> Union[Student, InstitutionalAdmin, MinistryAdmin]:
        """Get current authenticated user based on token"""
        token_data = AuthService.verify_token(credentials.credentials)
        user_id = token_data["user_id"]
        user_type = token_data["user_type"]
        
        # Query appropriate table based on user type
        if user_type == UserRole.STUDENT:
            user = db.query(Student).filter(Student.student_id == user_id).first()
        elif user_type == UserRole.INSTITUTIONAL_ADMIN:
            user = db.query(InstitutionalAdmin).filter(InstitutionalAdmin.institutional_admin_id == user_id).first()
        elif user_type == UserRole.MINISTRY_ADMIN:
            user = db.query(MinistryAdmin).filter(MinistryAdmin.ministry_admin_id == user_id).first()
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user type"
            )
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Inactive user"
            )
        
        # Add user type and permissions for easy access
        user.user_type = user_type
        user.permissions = token_data["permissions"]
        
        return user

    @staticmethod
    def get_user_permissions(user_type: str) -> List[str]:
        """Get permissions for a user type"""
        role = UserRole(user_type)
        return [perm.value for perm in ROLE_PERMISSIONS.get(role, [])]

    @staticmethod
    def has_permission(user, required_permission: Permission) -> bool:
        """Check if user has a specific permission"""
        return required_permission.value in getattr(user, 'permissions', [])

    @staticmethod
    def require_permission(required_permission: Permission):
        """Decorator to require a specific permission"""
        def permission_checker(current_user = Depends(AuthService.get_current_user)):
            if not AuthService.has_permission(current_user, required_permission):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission '{required_permission.value}' required"
                )
            return current_user
        
        return permission_checker

    @staticmethod
    def require_role(allowed_roles: Union[UserRole, List[UserRole]]):
        """Decorator to require specific roles"""
        if isinstance(allowed_roles, UserRole):
            allowed_roles = [allowed_roles]
        
        def role_checker(current_user = Depends(AuthService.get_current_user)):
            if current_user.user_type not in [role.value for role in allowed_roles]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient role permissions"
                )
            return current_user
        
        return role_checker

# Convenience functions for role checking
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    return AuthService.get_current_user(credentials, db)

def get_student(current_user = Depends(get_current_user)) -> Student:
    if current_user.user_type != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student access required"
        )
    return current_user

def get_institutional_admin(current_user = Depends(get_current_user)) -> InstitutionalAdmin:
    if current_user.user_type != UserRole.INSTITUTIONAL_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Institutional admin access required"
        )
    return current_user

def get_ministry_admin(current_user = Depends(get_current_user)) -> MinistryAdmin:
    if current_user.user_type != UserRole.MINISTRY_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ministry admin access required"
        )
    return current_user

def get_admin_user(current_user = Depends(get_current_user)):
    if current_user.user_type not in [UserRole.INSTITUTIONAL_ADMIN, UserRole.MINISTRY_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# Resource-based access control
def can_access_student_data(current_user, student_id: str, db: Session) -> bool:
    """Check if user can access specific student data"""
    if current_user.user_type == UserRole.MINISTRY_ADMIN:
        return True
    elif current_user.user_type == UserRole.INSTITUTIONAL_ADMIN:
        student = db.query(Student).filter(Student.student_id == student_id).first()
        return student and student.institution_name == current_user.institution_name
    elif current_user.user_type == UserRole.STUDENT:
        return str(current_user.student_id) == student_id
    return False

def can_access_institution_data(current_user, institution_name: str) -> bool:
    """Check if user can access specific institution data"""
    if current_user.user_type == UserRole.MINISTRY_ADMIN:
        return True
    elif current_user.user_type == UserRole.INSTITUTIONAL_ADMIN:
        return current_user.institution_name == institution_name
    return False
