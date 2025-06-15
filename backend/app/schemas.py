from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Any, Dict
from datetime import datetime, date
from enum import Enum
from uuid import UUID

# Base response schemas
class APIResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[Any] = None
    errors: Optional[List[str]] = None

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    size: int
    pages: int

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    user_type: str
    user_id: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
    user_type: Optional[str] = None
    permissions: Optional[List[str]] = None

class UserResponse(BaseModel):
    user_id: str
    user_type: str
    first_name: str
    last_name: str
    email: str
    phone_number: Optional[str] = None
    is_active: bool
    permissions: List[str]
    created_at: Optional[str] = None
    # Type-specific fields
    gender: Optional[str] = None
    institution_name: Optional[str] = None
    title: Optional[str] = None
    type: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# Enum schemas
class UserRole(str, Enum):
    STUDENT = "student"
    INSTITUTIONAL_ADMIN = "institutional_admin"
    MINISTRY_ADMIN = "ministry_admin"
    EXAMINATION_OFFICER = "examination_officer"

class ExamType(str, Enum):
    CAP = "CAP"
    BAC = "BAC"
    TECHNICAL_GCE = "Technical GCE"
    GCE_OL = "GCE O/L"
    GCE_AL = "GCE A/L"
    HND = "HND"
    CONCOURS = "Concours"
    INTERNAL = "Internal"

class ExamLevel(str, Enum):
    FORM1 = "Form 1"
    FORM2 = "Form 2"
    FORM3 = "Form 3"
    FORM4 = "Form 4"
    FORM5 = "Form 5"
    LOWER6 = "Lower 6"
    UPPER6 = "Upper 6"
    YEAR1 = "Year 1"
    YEAR2 = "Year 2"
    YEAR3 = "Year 3"

class ExamStatus(str, Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class RegistrationStatus(str, Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    PAID = "Paid"

class ResultStatus(str, Enum):
    PASS = "Pass"
    FAIL = "Fail"
    ABSENT = "Absent"
    PENDING = "Pending"

class InstitutionType(str, Enum):
    SECONDARY_SCHOOL = "Secondary School"
    TECHNICAL_SCHOOL = "Technical School"
    UNIVERSITY = "University"
    HIGHER_INSTITUTE = "Higher Institute"

class RegionType(str, Enum):
    ADAMAWA = "Adamawa"
    CENTRE = "Centre"
    EAST = "East"
    FAR_NORTH = "Far North"
    LITTORAL = "Littoral"
    NORTH = "North"
    NORTHWEST = "Northwest"
    SOUTH = "South"
    SOUTHWEST = "Southwest"
    WEST = "West"

class GenderType(str, Enum):
    MALE = "Male"
    FEMALE = "Female"

class NotificationType(str, Enum):
    INFO = "info"
    EXAM_REGISTRATION = "exam_registration"
    RESULTS_PUBLISHED = "results_published"
    SYSTEM_ALERT = "system_alert"
    ANNOUNCEMENT = "announcement"

# Student schemas
class StudentBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    gender: GenderType
    institution_name: str

class StudentCreate(StudentBase):
    password: str

class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    institution_name: Optional[str] = None

class StudentResponse(StudentBase):
    student_id: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Ministry Admin schemas
class MinistryAdminBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    type: Optional[str] = None

    class Config:
        from_attributes = True

class MinistryAdminCreate(MinistryAdminBase):
    password: str

class MinistryAdminUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    type: Optional[str] = None

class MinistryAdminResponse(MinistryAdminBase):
    ministry_admin_id: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Institutional Admin schemas
class InstitutionalAdminBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    institution_name: str
    title: Optional[str] = None

class InstitutionalAdminCreate(InstitutionalAdminBase):
    password: str

class InstitutionalAdminUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    institution_name: Optional[str] = None
    title: Optional[str] = None

class InstitutionalAdminResponse(InstitutionalAdminBase):
    institutional_admin_id: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Institution schemas - FIXED
class InstitutionBase(BaseModel):
    name: str
    address: str
    type: InstitutionType
    region: RegionType
    phone_number: Optional[str] = None
    email: Optional[str] = None

class InstitutionCreate(BaseModel):
    name: str
    address: str
    type: InstitutionType
    region: RegionType
    phone_number: Optional[str] = None
    email: Optional[str] = None

    class Config:
        use_enum_values = True

class InstitutionUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    type: Optional[InstitutionType] = None
    region: Optional[RegionType] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None

    class Config:
        use_enum_values = True

class InstitutionResponse(BaseModel):
    institution_id: str
    name: str
    address: str
    type: str
    region: str
    phone_number: Optional[str] = None
    email: Optional[str] = None
    is_verified: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Exam schemas
class ExamBase(BaseModel):
    title: str
    description: Optional[str] = None
    type: ExamType
    level: ExamLevel
    date: Optional[date] = None
    registration_deadline: Optional[date] = None
    exam_fee: Optional[float] = None

class ExamCreate(ExamBase):
    exam_body_id: Optional[str] = None

class ExamUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[ExamType] = None
    level: Optional[ExamLevel] = None
    date: Optional[date] = None
    registration_deadline: Optional[date] = None
    exam_fee: Optional[float] = None
    status: Optional[ExamStatus] = None

class ExamResponse(ExamBase):
    exam_id: str
    status: ExamStatus
    created_at: Optional[datetime] = None
    created_by: Optional[str] = None

    class Config:
        from_attributes = True

# Result schemas
class ResultBase(BaseModel):
    student_id: str
    exam_id: str
    grade: Optional[float] = None
    status: ResultStatus
    remarks: Optional[str] = None

class ResultCreate(ResultBase):
    pass

class ResultUpdate(BaseModel):
    grade: Optional[float] = None
    status: Optional[ResultStatus] = None
    remarks: Optional[str] = None

class ResultResponse(ResultBase):
    result_id: str
    is_published: bool = False
    published_date: Optional[date] = None
    verified_by: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Registration schemas
class ExamRegistrationBase(BaseModel):
    student_id: str
    exam_id: str

class ExamRegistrationCreate(ExamRegistrationBase):
    pass

class ExamRegistrationResponse(ExamRegistrationBase):
    registration_id: str
    status: RegistrationStatus
    registration_date: Optional[datetime] = None
    approved_by: Optional[str] = None

    class Config:
        from_attributes = True

# Notification schemas
class NotificationBase(BaseModel):
    user_id: str
    user_type: UserRole
    title: str
    message: str
    notification_type: NotificationType
    data: Optional[Dict[str, Any]] = None
    expires_at: Optional[datetime] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None
    read_at: Optional[datetime] = None

class NotificationResponse(BaseModel):
    notification_id: str
    user_id: str
    user_type: str
    title: str
    message: str
    notification_type: str
    data: Optional[Dict[str, Any]] = None
    is_read: bool = False
    read_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Public search schemas
class PublicResultSearch(BaseModel):
    candidate_number: Optional[str] = None
    exam_code: Optional[str] = None
    student_number: Optional[str] = None

class PublicResultResponse(BaseModel):
    candidate_number: str
    student_name: str
    exam_title: str
    exam_year: str
    institution_name: str
    results: Dict[str, Any]
    overall_status: str

# Dashboard schemas
class DashboardStats(BaseModel):
    total_students: int
    total_exams: int
    total_institutions: int
    total_results: int

class StudentDashboard(BaseModel):
    student_info: StudentResponse
    available_exams: List[ExamResponse]
    registered_exams: List[ExamRegistrationResponse]
    recent_results: List[ResultResponse]

class InstitutionDashboard(BaseModel):
    institution_info: InstitutionResponse
    total_students: int
    total_registrations: int
    recent_results: List[ResultResponse]
    statistics: Dict[str, Any]

class MinistryDashboard(BaseModel):
    system_stats: DashboardStats
    recent_exams: List[ExamResponse]
    recent_institutions: List[InstitutionResponse]
    analytics: Dict[str, Any]
