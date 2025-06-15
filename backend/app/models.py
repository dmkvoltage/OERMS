from sqlalchemy import Column, String, Boolean, DateTime, Date, Time, Text, Integer, ForeignKey, UniqueConstraint, Index, DECIMAL
from sqlalchemy.dialects.postgresql import UUID, ENUM, ARRAY, JSONB, INET
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from enum import Enum as PyEnum

Base = declarative_base()

# Python Enums - Updated to match database exactly
class GenderType(PyEnum):
    MALE = "Male"
    FEMALE = "Female"

class InstitutionType(PyEnum):
    SECONDARY_SCHOOL = "Secondary School"
    TECHNICAL_SCHOOL = "Technical School" 
    UNIVERSITY = "University"
    HIGHER_INSTITUTE = "Higher Institute"

class ExamType(PyEnum):
    CAP = "CAP"
    BAC = "BAC"
    TECHNICAL_GCE = "Technical GCE"
    GCE_OL = "GCE O/L"
    GCE_AL = "GCE A/L"
    HND = "HND"
    CONCOURS = "Concours"
    INTERNAL = "Internal"

class ExamLevel(PyEnum):
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

class RegionType(PyEnum):
    ADAMAWA = "Adamawa"
    CENTRE = "Centre"
    EAST = "East"
    FAR_NORTH = "Far North"
    LITTORAL = "Littoral"
    NORTH = "North"
    NORTHWEST = "Northwest"
    SOUTHWEST = "Southwest"
    SOUTH = "South"
    WEST = "West"

class ExamStatus(PyEnum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class RegistrationStatus(PyEnum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    PAID = "Paid"

class ResultStatus(PyEnum):
    PASS = "Pass"
    FAIL = "Fail"
    ABSENT = "Absent"
    PENDING = "Pending"

class VerificationStatus(PyEnum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"

class PublicationStatus(PyEnum):
    DRAFT = "Draft"
    PUBLISHED = "Published"
    ARCHIVED = "Archived"

class NotificationType(PyEnum):
    INFO = "info"
    EXAM_REGISTRATION = "exam_registration"
    RESULT_PUBLISHED = "result_published"
    SYSTEM = "system"
    WARNING = "warning"
    SUCCESS = "success"
    ERROR = "error"

class UserType(PyEnum):
    STUDENT = "student"
    INSTITUTIONAL_ADMIN = "institutional_admin"
    MINISTRY_ADMIN = "ministry_admin"

class SessionStatus(PyEnum):
    SCHEDULED = "Scheduled"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

# Create enum types with explicit names to avoid caching issues
def create_enum_type(name: str, enum_class: PyEnum):
    """Create SQLAlchemy enum type with explicit name"""
    return ENUM(
        *[item.value for item in enum_class],
        name=name,
        create_constraint=True,
        validate_strings=True
    )

# SQLAlchemy Models with proper relationships

class MinistryAdmin(Base):
    """Ministry Admin - standalone table, manages the entire system"""
    __tablename__ = "ministry_admin"
    
    ministry_admin_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String(50), nullable=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    created_exams = relationship("Exam", foreign_keys="Exam.created_by", back_populates="creator")
    result_publications = relationship("ResultPublication", back_populates="publisher")
    student_verifications = relationship("StudentVerification", back_populates="verifier")
    verified_registrations = relationship("ExamRegistration", foreign_keys="ExamRegistration.verified_by", back_populates="verifier")

class Institution(Base):
    """Institution - standalone table, represents educational institutions"""
    __tablename__ = "institution"
    
    institution_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, unique=True)
    address = Column(Text)
    type = Column(create_enum_type('institutiontype', InstitutionType), nullable=False)
    region = Column(create_enum_type('regiontype', RegionType), nullable=False)
    phone_number = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    registration_date = Column(Date, server_default=func.current_date())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    is_verified = Column(Boolean, default=False)
    
    # Relationships
    institutional_admins = relationship("InstitutionalAdmin", back_populates="institution", cascade="all, delete-orphan")
    students = relationship("Student", back_populates="institution", cascade="all, delete-orphan")
    student_verifications = relationship("StudentVerification", back_populates="institution")
    exam_sessions = relationship("ExamSession", back_populates="institution")

class InstitutionalAdmin(Base):
    """Institutional Admin - belongs to an institution, enrolls students"""
    __tablename__ = "institutional_admin"
    
    institutional_admin_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    phone_number = Column(String(20))
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institution.institution_id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(100))
    assigned_date = Column(Date, server_default=func.current_date())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    institution = relationship("Institution", back_populates="institutional_admins")
    enrolled_students = relationship("Student", foreign_keys="Student.enrolled_by", back_populates="enrolled_by_admin")

class Student(Base):
    """Student - belongs to an institution, enrolled by institutional admin"""
    __tablename__ = "student"
    
    student_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    phone_number = Column(String(20))
    gender = Column(create_enum_type('gendertype', GenderType))
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institution.institution_id", ondelete="CASCADE"), nullable=False, index=True)
    student_number = Column(String(50), unique=True, index=True)
    date_of_birth = Column(Date)
    place_of_birth = Column(String(255))
    nationality = Column(String(100), default='Cameroonian')
    guardian_name = Column(String(255))
    guardian_phone = Column(String(20))
    enrollment_date = Column(Date, server_default=func.current_date())
    graduation_date = Column(Date)
    is_graduated = Column(Boolean, default=False)
    enrolled_by = Column(UUID(as_uuid=True), ForeignKey("institutional_admin.institutional_admin_id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    institution = relationship("Institution", back_populates="students")
    enrolled_by_admin = relationship("InstitutionalAdmin", foreign_keys=[enrolled_by], back_populates="enrolled_students")
    exam_registrations = relationship("ExamRegistration", back_populates="student", cascade="all, delete-orphan")
    results = relationship("Results", back_populates="student", cascade="all, delete-orphan")

class ExamBody(Base):
    """Exam Body - standalone table, examination boards"""
    __tablename__ = "exam_body"
    
    exam_body_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    type = Column(String(100))
    address = Column(Text)
    contact_email = Column(String(255))
    contact_phone_number = Column(String(20))
    established_date = Column(Date)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    exams = relationship("Exam", back_populates="exam_body")

class Exam(Base):
    """Exam - created by ministry admin"""
    __tablename__ = "exam"
    
    exam_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    type = Column(create_enum_type('examtype', ExamType), nullable=False)
    date = Column(Date)
    level = Column(create_enum_type('examlevel', ExamLevel))
    status = Column(create_enum_type('examstatus', ExamStatus), default=ExamStatus.ACTIVE)
    exam_body_id = Column(UUID(as_uuid=True), ForeignKey("exam_body.exam_body_id"), nullable=False)
    created_date = Column(Date, server_default=func.current_date())
    created_by = Column(UUID(as_uuid=True), ForeignKey("ministry_admin.ministry_admin_id"))
    description = Column(Text)
    duration = Column(Integer)  # Duration in minutes
    registration_start_date = Column(Date)
    registration_end_date = Column(Date)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    exam_body = relationship("ExamBody", back_populates="exams")
    creator = relationship("MinistryAdmin", foreign_keys=[created_by], back_populates="created_exams")
    exam_registrations = relationship("ExamRegistration", back_populates="exam", cascade="all, delete-orphan")
    results = relationship("Results", back_populates="exam", cascade="all, delete-orphan")
    result_publications = relationship("ResultPublication", back_populates="exam")
    exam_sessions = relationship("ExamSession", back_populates="exam")

class ExamSession(Base):
    """Exam Session - examination sessions and scheduling"""
    __tablename__ = "exam_session"
    
    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exam.exam_id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(UUID(as_uuid=True), nullable=True)  # Optional subject reference
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institution.institution_id"), nullable=True)
    session_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    venue = Column(String(255))
    invigilator_id = Column(UUID(as_uuid=True), nullable=True)  # Can reference any user type
    status = Column(create_enum_type('sessionstatus', SessionStatus), default=SessionStatus.SCHEDULED)
    max_candidates = Column(Integer, default=0)
    registered_candidates = Column(Integer, default=0)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    exam = relationship("Exam", back_populates="exam_sessions")
    institution = relationship("Institution", back_populates="exam_sessions")

class ExamRegistration(Base):
    """Exam Registration - students register for exams"""
    __tablename__ = "exam_registration"
    
    registration_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("student.student_id", ondelete="CASCADE"), nullable=False, index=True)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exam.exam_id", ondelete="CASCADE"), nullable=False, index=True)
    registration_date = Column(Date, server_default=func.current_date())
    status = Column(create_enum_type('registrationstatus', RegistrationStatus), default=RegistrationStatus.PENDING)
    candidate_number = Column(String(50), unique=True)
    registration_fee = Column(DECIMAL(10, 2))
    fee_paid = Column(Boolean, default=False)
    payment_date = Column(Date)
    verified_by = Column(UUID(as_uuid=True), ForeignKey("ministry_admin.ministry_admin_id"))
    verification_date = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    student = relationship("Student", back_populates="exam_registrations")
    exam = relationship("Exam", back_populates="exam_registrations")
    verifier = relationship("MinistryAdmin", foreign_keys=[verified_by], back_populates="verified_registrations")
    
    __table_args__ = (UniqueConstraint('student_id', 'exam_id'),)

class Results(Base):
    """Results - exam results for students"""
    __tablename__ = "results"
    
    result_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("student.student_id", ondelete="CASCADE"), nullable=False, index=True)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exam.exam_id", ondelete="CASCADE"), nullable=False, index=True)
    scores = Column(JSONB)  # Store multiple subject scores as JSON
    grade = Column(String(10))
    is_published = Column(Boolean, default=False, index=True)
    published_date = Column(Date)
    status = Column(create_enum_type('resultstatus', ResultStatus), default=ResultStatus.PENDING)
    remarks = Column(Text)
    verified_by = Column(UUID(as_uuid=True))  # Can reference ministry_admin_id or institutional_admin_id
    verification_date = Column(Date)
    uploaded_by = Column(UUID(as_uuid=True))  # Who uploaded this result
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    student = relationship("Student", back_populates="results")
    exam = relationship("Exam", back_populates="results")
    
    __table_args__ = (UniqueConstraint('student_id', 'exam_id'),)

class Notifications(Base):
    """Notifications - system notifications for users"""
    __tablename__ = "notifications"
    
    notification_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)  # Can reference any user type
    user_type = Column(create_enum_type('usertype', UserType), nullable=False)
    type = Column(create_enum_type('notificationtype', NotificationType), default=NotificationType.INFO)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    data = Column(JSONB, nullable=True)  # Additional data as JSON
    is_read = Column(Boolean, default=False, index=True)
    read_at = Column(DateTime(timezone=True), nullable=True)
    date = Column(Date, server_default=func.current_date())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)  # Optional expiration
    
    # Indexes for better performance
    __table_args__ = (
        Index('idx_notifications_user', 'user_id', 'user_type'),
        Index('idx_notifications_unread', 'user_id', 'is_read'),
        Index('idx_notifications_date', 'date'),
    )

class ResultPublication(Base):
    """Result Publication - ministry admin publishes results"""
    __tablename__ = "result_publication"
    
    publication_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exam.exam_id", ondelete="CASCADE"), nullable=False)
    publication_date = Column(Date, server_default=func.current_date())
    published_by = Column(UUID(as_uuid=True), ForeignKey("ministry_admin.ministry_admin_id"), nullable=False)
    status = Column(create_enum_type('publicationstatus', PublicationStatus), default=PublicationStatus.DRAFT)
    total_results = Column(Integer, default=0)
    publication_notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    exam = relationship("Exam", back_populates="result_publications")
    publisher = relationship("MinistryAdmin", back_populates="result_publications")

class StudentVerification(Base):
    """Student Verification - ministry admin verifies institutions"""
    __tablename__ = "student_verification"
    
    verification_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institution.institution_id", ondelete="CASCADE"), nullable=False)
    status = Column(create_enum_type('verificationstatus', VerificationStatus), default=VerificationStatus.PENDING)
    verification_date = Column(Date)
    verified_by = Column(UUID(as_uuid=True), ForeignKey("ministry_admin.ministry_admin_id"), nullable=False)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    institution = relationship("Institution", back_populates="student_verifications")
    verifier = relationship("MinistryAdmin", back_populates="student_verifications")

class SystemAnalytics(Base):
    """System Analytics - standalone table, system statistics"""
    __tablename__ = "system_analytics"
    
    analytics_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    record_date = Column(Date, server_default=func.current_date())
    total_users = Column(Integer, default=0)
    total_institutions = Column(Integer, default=0)
    published_results = Column(Integer, default=0)
    total_searches = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        Index('idx_analytics_date', 'record_date'),
    )
