from datetime import datetime, timedelta
from typing import Optional, Union, List
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from uuid import UUID
from enum import Enum
import logging

from app.database import get_db
from app.models import Student, InstitutionalAdmin, MinistryAdmin
from app.schemas import TokenData
from app.core.config import settings
from app.core.auth import AuthService

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()

# Setup logging for security events
security_logger = logging.getLogger("security")
logger = logging.getLogger(__name__)

class UserRole(str, Enum):
    STUDENT = "student"
    INSTITUTIONAL_ADMIN = "institutional_admin"
    MINISTRY_ADMIN = "ministry_admin"
    EXAMINATION_OFFICER = "examination_officer"
    STAFF = "staff"

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
    ENROLL_STUDENTS = "enroll_students"
    GENERATE_INSTITUTION_REPORTS = "generate_institution_reports"
    
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
    DELETE_EXAMS = "delete_exams"
    SYSTEM_BACKUP = "system_backup"
    SYSTEM_RECOVERY = "system_recovery"
    MANAGE_SYSTEM_SETTINGS = "manage_system_settings"
    
    # Examination Officer permissions
    VERIFY_REGISTRATIONS = "verify_registrations"
    MANAGE_EXAM_SESSIONS = "manage_exam_sessions"
    SCHEDULE_EXAMS = "schedule_exams"
    
    # Common permissions
    VIEW_PUBLIC_DATA = "view_public_data"
    CHANGE_PASSWORD = "change_password"
    SEARCH_DATA = "search_data"

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
        Permission.SEARCH_DATA,
    ],
    UserRole.INSTITUTIONAL_ADMIN: [
        Permission.READ_OWN_DATA,
        Permission.MANAGE_INSTITUTION_STUDENTS,
        Permission.UPLOAD_STUDENT_DOCUMENTS,
        Permission.VIEW_INSTITUTION_DATA,
        Permission.REGISTER_STUDENTS,
        Permission.VIEW_INSTITUTION_RESULTS,
        Permission.MANAGE_INSTITUTION_REGISTRATIONS,
        Permission.ENROLL_STUDENTS,
        Permission.GENERATE_INSTITUTION_REPORTS,
        Permission.VIEW_PUBLIC_DATA,
        Permission.CHANGE_PASSWORD,
        Permission.SEARCH_DATA,
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
        Permission.DELETE_EXAMS,
        Permission.SYSTEM_BACKUP,
        Permission.SYSTEM_RECOVERY,
        Permission.MANAGE_SYSTEM_SETTINGS,
        Permission.VIEW_PUBLIC_DATA,
        Permission.CHANGE_PASSWORD,
        Permission.SEARCH_DATA,
    ],
    UserRole.EXAMINATION_OFFICER: [
        Permission.READ_OWN_DATA,
        Permission.VERIFY_REGISTRATIONS,
        Permission.MANAGE_EXAM_SESSIONS,
        Permission.SCHEDULE_EXAMS,
        Permission.VIEW_INSTITUTION_DATA,
        Permission.VIEW_PUBLIC_DATA,
        Permission.CHANGE_PASSWORD,
        Permission.SEARCH_DATA,
    ],
}

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> TokenData:
    """Verify and decode a JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        user_type: str = payload.get("user_type")
        permissions: List[str] = payload.get("permissions", [])
        
        if user_id is None or user_type is None:
            raise credentials_exception
            
        token_data = TokenData(
            user_id=user_id, 
            user_type=user_type,
            permissions=permissions
        )
        return token_data
    except (JWTError, ValueError):
        raise credentials_exception

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get the current authenticated user."""
    try:
        token_data = AuthService.verify_token(credentials.credentials)
        user_id = token_data["user_id"]
        user_type = token_data["user_type"]
        
        # Find user based on user_type
        user = None
        if user_type == "student":
            user = db.query(Student).filter(Student.student_id == user_id).first()
        elif user_type == "institutional_admin":
            user = db.query(InstitutionalAdmin).filter(InstitutionalAdmin.institutional_admin_id == user_id).first()
        elif user_type == "ministry_admin":
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
        
        # Add user_type and permissions to user object for easy access
        user.user_type = user_type
        user.permissions = token_data.get("permissions", [])
        
        # Log successful authentication
        security_logger.info(f"User authenticated: {user.email} ({user.user_type})")
        
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting current user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

def get_current_active_user(current_user = Depends(get_current_user)):
    """Get the current active user."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user

def get_user_permissions(user_type: str) -> List[str]:
    """Get permissions for a user type."""
    role = UserRole(user_type)
    return [perm.value for perm in ROLE_PERMISSIONS.get(role, [])]

def has_permission(user, required_permission: Permission) -> bool:
    """Check if user has a specific permission."""
    return required_permission.value in getattr(user, 'permissions', [])

def require_permission(required_permission: Permission):
    """Decorator to require a specific permission."""
    def permission_checker(current_user = Depends(get_current_active_user)):
        if not has_permission(current_user, required_permission):
            security_logger.warning(f"Permission denied: {current_user.email} lacks {required_permission.value}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{required_permission.value}' required"
            )
        return current_user
    
    return permission_checker

def require_permissions(required_permissions: List[Permission]):
    """Decorator to require multiple permissions (all must be present)."""
    def permission_checker(current_user = Depends(get_current_active_user)):
        for permission in required_permissions:
            if not has_permission(current_user, permission):
                security_logger.warning(f"Permission denied: {current_user.email} lacks {permission.value}")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission '{permission.value}' required"
                )
        return current_user
    
    return permission_checker

def require_any_permission(required_permissions: List[Permission]):
    """Decorator to require any of the specified permissions."""
    def permission_checker(current_user = Depends(get_current_active_user)):
        for permission in required_permissions:
            if has_permission(current_user, permission):
                return current_user
        
        permission_names = [perm.value for perm in required_permissions]
        security_logger.warning(f"Permission denied: {current_user.email} lacks any of {permission_names}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"One of these permissions required: {', '.join(permission_names)}"
        )
    
    return permission_checker

# Role-based access control decorators
def require_role(allowed_roles: Union[UserRole, List[UserRole]]):
    """Decorator to require specific roles."""
    if isinstance(allowed_roles, UserRole):
        allowed_roles = [allowed_roles]
    
    def role_checker(current_user = Depends(get_current_active_user)):
        if current_user.user_type not in [role.value for role in allowed_roles]:
            security_logger.warning(f"Role access denied: {current_user.email} ({current_user.user_type}) attempted access requiring {[r.value for r in allowed_roles]}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient role permissions"
            )
        return current_user
    
    return role_checker

# Specific role dependencies
def get_ministry_admin(current_user = Depends(require_role(UserRole.MINISTRY_ADMIN))):
    return current_user

def get_institutional_admin(current_user = Depends(require_role(UserRole.INSTITUTIONAL_ADMIN))):
    return current_user

def get_student(current_user = Depends(get_current_user)) -> Student:
    """Get current student user"""
    if current_user.user_type != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student access required"
        )
    return current_user

def get_institutional_admin(current_user = Depends(get_current_user)) -> InstitutionalAdmin:
    """Get current institutional admin user"""
    if current_user.user_type != "institutional_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Institutional admin access required"
        )
    return current_user

def get_ministry_admin(current_user = Depends(get_current_user)) -> MinistryAdmin:
    """Get current ministry admin user"""
    if current_user.user_type != "ministry_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ministry admin access required"
        )
    return current_user

def get_admin_user(current_user = Depends(get_current_user)):
    """Get current admin user (institutional or ministry)"""
    if current_user.user_type not in ["institutional_admin", "ministry_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# Resource-based access control
def can_access_student_data(current_user, student_id: str, db: Session) -> bool:
    """Check if user can access specific student data."""
    if current_user.user_type == UserRole.MINISTRY_ADMIN:
        return True
    elif current_user.user_type == UserRole.INSTITUTIONAL_ADMIN:
        # Can access students from their institution
        student = db.query(Student).filter(Student.student_id == student_id).first()
        return student and student.institution_id == current_user.institution_id
    elif current_user.user_type == UserRole.STUDENT:
        # Can only access their own data
        return str(current_user.student_id) == student_id
    
    return False

def can_access_institution_data(current_user, institution_id: str) -> bool:
    """Check if user can access specific institution data."""
    if current_user.user_type == UserRole.MINISTRY_ADMIN:
        return True
    elif current_user.user_type == UserRole.INSTITUTIONAL_ADMIN:
        return str(current_user.institution_id) == institution_id
    
    return False

def can_manage_exam(current_user, exam_id: str, db: Session) -> bool:
    """Check if user can manage a specific exam."""
    if current_user.user_type == UserRole.MINISTRY_ADMIN:
        return True
    
    # Add more specific logic based on exam ownership/assignment
    return False

def can_publish_results(current_user) -> bool:
    """Check if user can publish results."""
    return current_user.user_type == UserRole.MINISTRY_ADMIN

def can_verify_institution(current_user) -> bool:
    """Check if user can verify institutions."""
    return current_user.user_type == UserRole.MINISTRY_ADMIN

# Context-aware permission checking
class PermissionContext:
    """Context for permission checking with additional parameters."""
    
    def __init__(self, user, db: Session, **kwargs):
        self.user = user
        self.db = db
        self.context = kwargs
    
    def can_access_student(self, student_id: str) -> bool:
        return can_access_student_data(self.user, student_id, self.db)
    
    def can_access_institution(self, institution_id: str) -> bool:
        return can_access_institution_data(self.user, institution_id)
    
    def can_manage_exam(self, exam_id: str) -> bool:
        return can_manage_exam(self.user, exam_id, self.db)

def get_permission_context(
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> PermissionContext:
    """Get permission context for complex permission checking."""
    return PermissionContext(current_user, db)

# Audit logging for permission checks
def log_permission_check(user, permission: str, resource: str = None, granted: bool = True):
    """Log permission checks for audit purposes."""
    security_logger.info(f"Permission check: User {user.email} - Permission: {permission} - Resource: {resource} - Granted: {granted}")

# Permission middleware for FastAPI
def check_permission_middleware(required_permission: Permission):
    """Middleware to check permissions before route execution."""
    def middleware(current_user = Depends(get_current_active_user)):
        if not has_permission(current_user, required_permission):
            log_permission_check(current_user, required_permission.value, granted=False)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{required_permission.value}' required"
            )
        
        log_permission_check(current_user, required_permission.value, granted=True)
        return current_user
    
    return middleware

# Security audit trail
class SecurityAuditTrail:
    """Security audit trail for tracking user actions."""
    
    @staticmethod
    def log_login(user_email: str, user_type: str, ip_address: str = None):
        security_logger.info(f"LOGIN: {user_email} ({user_type}) from {ip_address}")
    
    @staticmethod
    def log_logout(user_email: str, user_type: str):
        security_logger.info(f"LOGOUT: {user_email} ({user_type})")
    
    @staticmethod
    def log_failed_login(email: str, ip_address: str = None):
        security_logger.warning(f"FAILED_LOGIN: {email} from {ip_address}")
    
    @staticmethod
    def log_permission_denied(user_email: str, permission: str, resource: str = None):
        security_logger.warning(f"PERMISSION_DENIED: {user_email} - {permission} - {resource}")
    
    @staticmethod
    def log_data_access(user_email: str, action: str, resource: str, resource_id: str = None):
        security_logger.info(f"DATA_ACCESS: {user_email} - {action} - {resource} - {resource_id}")
    
    @staticmethod
    def log_admin_action(user_email: str, action: str, target: str = None):
        security_logger.info(f"ADMIN_ACTION: {user_email} - {action} - {target}")
