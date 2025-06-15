from sqlalchemy.orm import Session
from sqlalchemy import text, func, and_, or_, desc, asc
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, date
import logging
from contextlib import contextmanager

from app.database import SessionLocal, engine
from app.models import *
from app.core.security import SecurityAuditTrail

# Setup logging
db_logger = logging.getLogger("database")

class DatabaseOperations:
    """Comprehensive database operations with transaction management."""
    
    @staticmethod
    @contextmanager
    def get_db_transaction():
        """Context manager for database transactions with ACID properties."""
        db = SessionLocal()
        try:
            db.begin()
            yield db
            db.commit()
            db_logger.info("Transaction committed successfully")
        except Exception as e:
            db.rollback()
            db_logger.error(f"Transaction rolled back due to error: {str(e)}")
            raise
        finally:
            db.close()
    
    @staticmethod
    def execute_with_retry(operation, max_retries: int = 3):
        """Execute database operation with retry logic for concurrency control."""
        for attempt in range(max_retries):
            try:
                return operation()
            except SQLAlchemyError as e:
                if attempt == max_retries - 1:
                    db_logger.error(f"Operation failed after {max_retries} attempts: {str(e)}")
                    raise
                db_logger.warning(f"Attempt {attempt + 1} failed, retrying: {str(e)}")
        
    # SEARCH QUERIES - Four different search implementations
    
    @staticmethod
    def search_students_by_criteria(db: Session, search_term: str, institution_id: str = None) -> List[Student]:
        """Search students by name, email, or student number."""
        query = db.query(Student).filter(
            or_(
                Student.first_name.ilike(f"%{search_term}%"),
                Student.last_name.ilike(f"%{search_term}%"),
                Student.email.ilike(f"%{search_term}%"),
                Student.student_number.ilike(f"%{search_term}%")
            )
        )
        
        if institution_id:
            query = query.filter(Student.institution_id == institution_id)
        
        return query.all()
    
    @staticmethod
    def search_exams_by_type_and_date(db: Session, exam_type: str = None, start_date: date = None, end_date: date = None) -> List[Exam]:
        """Search exams by type and date range."""
        query = db.query(Exam)
        
        if exam_type:
            query = query.filter(Exam.type == exam_type)
        
        if start_date:
            query = query.filter(Exam.date >= start_date)
        
        if end_date:
            query = query.filter(Exam.date <= end_date)
        
        return query.order_by(Exam.date.desc()).all()
    
    @staticmethod
    def search_institutions_by_region(db: Session, region: str, institution_type: str = None) -> List[Institution]:
        """Search institutions by region and type."""
        query = db.query(Institution).filter(Institution.region == region)
        
        if institution_type:
            query = query.filter(Institution.type == institution_type)
        
        return query.order_by(Institution.name).all()
    
    @staticmethod
    def search_results_by_status(db: Session, status: str, exam_id: str = None, institution_id: str = None) -> List[Results]:
        """Search results by status with optional filters."""
        query = db.query(Results).filter(Results.status == status)
        
        if exam_id:
            query = query.filter(Results.exam_id == exam_id)
        
        if institution_id:
            query = query.join(Student).filter(Student.institution_id == institution_id)
        
        return query.all()
    
    # DATA ADDITION - Five main data addition operations
    
    @staticmethod
    def add_student(db: Session, student_data: dict, enrolled_by: str) -> Student:
        """Add a new student with transaction management."""
        try:
            student = Student(**student_data)
            student.enrolled_by = enrolled_by
            db.add(student)
            db.flush()  # Get the ID without committing
            
            db.commit()
            db_logger.info(f"Student added: {student.email}")
            return student
        except Exception as e:
            db.rollback()
            db_logger.error(f"Failed to add student: {str(e)}")
            raise
    
    @staticmethod
    def add_exam(db: Session, exam_data: dict, created_by: str) -> Exam:
        """Add a new exam."""
        try:
            exam = Exam(**exam_data)
            exam.created_by = created_by
            db.add(exam)
            db.commit()
            db_logger.info(f"Exam added: {exam.title}")
            return exam
        except Exception as e:
            db.rollback()
            db_logger.error(f"Failed to add exam: {str(e)}")
            raise
    
    @staticmethod
    def add_institution(db: Session, institution_data: dict) -> Institution:
        """Add a new institution."""
        try:
            institution = Institution(**institution_data)
            db.add(institution)
            db.commit()
            db_logger.info(f"Institution added: {institution.name}")
            return institution
        except Exception as e:
            db.rollback()
            db_logger.error(f"Failed to add institution: {str(e)}")
            raise
    
    @staticmethod
    def add_exam_registration(db: Session, student_id: str, exam_id: str) -> ExamRegistration:
        """Register a student for an exam."""
        try:
            # Check if already registered
            existing = db.query(ExamRegistration).filter(
                and_(
                    ExamRegistration.student_id == student_id,
                    ExamRegistration.exam_id == exam_id
                )
            ).first()
            
            if existing:
                raise ValueError("Student already registered for this exam")
            
            registration = ExamRegistration(
                student_id=student_id,
                exam_id=exam_id,
                status=RegistrationStatus.PENDING
            )
            db.add(registration)
            
            db.commit()
            db_logger.info(f"Exam registration added: Student {student_id} for Exam {exam_id}")
            return registration
        except Exception as e:
            db.rollback()
            db_logger.error(f"Failed to add exam registration: {str(e)}")
            raise
    
    @staticmethod
    def add_result(db: Session, result_data: dict, verified_by: str) -> Results:
        """Add exam result."""
        try:
            result = Results(**result_data)
            result.verified_by = verified_by
            db.add(result)
            db.commit()
            db_logger.info(f"Result added for student {result.student_id}")
            return result
        except Exception as e:
            db.rollback()
            db_logger.error(f"Failed to add result: {str(e)}")
            raise
    
    # DATA MODIFICATION - Five update and five modification operations
    
    @staticmethod
    def update_student_profile(db: Session, student_id: str, update_data: dict) -> Student:
        """Update student profile information."""
        try:
            student = db.query(Student).filter(Student.student_id == student_id).first()
            if not student:
                raise ValueError("Student not found")
            
            for key, value in update_data.items():
                if hasattr(student, key):
                    setattr(student, key, value)
            
            student.updated_at = func.now()
            db.commit()
            db_logger.info(f"Student profile updated: {student_id}")
            return student
        except Exception as e:
            db.rollback()
            db_logger.error(f"Failed to update student profile: {str(e)}")
            raise
    
    @staticmethod
    def update_exam_status(db: Session, exam_id: str, new_status: str, updated_by: str) -> Exam:
        """Update exam status."""
        try:
            exam = db.query(Exam).filter(Exam.exam_id == exam_id).first()
            if not exam:
                raise ValueError("Exam not found")
            
            old_status = exam.status
            exam.status = new_status
            exam.updated_at = func.now()
            
            db.commit()
            db_logger.info(f"Exam status updated: {exam_id} from {old_status} to {new_status} by {updated_by}")
            return exam
        except Exception as e:
            db.rollback()
            db_logger.error(f"Failed to update exam status: {str(e)}")
            raise
    
    @staticmethod
    def update_institution_verification(db: Session, institution_id: str, is_verified: bool, verified_by: str) -> Institution:
        """Update institution verification status."""
        try:
            institution = db.query(Institution).filter(Institution.institution_id == institution_id).first()
            if not institution:
                raise ValueError("Institution not found")
            
            institution.is_verified = is_verified
            institution.updated_at = func.now()
            
            # Create verification record
            verification = StudentVerification(
                institution_id=institution_id,
                status=VerificationStatus.APPROVED if is_verified else VerificationStatus.REJECTED,
                verified_by=verified_by,
                verification_date=func.current_date()
            )
            db.add(verification)
            
            db.commit()
            db_logger.info(f"Institution verification updated: {institution_id} - {is_verified}")
            return institution
        except Exception as e:
            db.rollback()
            db_logger.error(f"Failed to update institution verification: {str(e)}")
            raise
    
    @staticmethod
    def update_registration_status(db: Session, registration_id: str, new_status: str, verified_by: str) -> ExamRegistration:
        """Update exam registration status."""
        try:
            registration = db.query(ExamRegistration).filter(ExamRegistration.registration_id == registration_id).first()
            if not registration:
                raise ValueError("Registration not found")
            
            registration.status = new_status
            registration.verified_by = verified_by
            registration.verification_date = func.current_date()
            
            # Generate candidate number if approved
            if new_status == RegistrationStatus.APPROVED:
                exam = db.query(Exam).filter(Exam.exam_id == registration.exam_id).first()
                candidate_number = f"{exam.type[:3]}{exam.date.year}{str(registration.student_id)[-6:].upper()}"
                registration.candidate_number = candidate_number
            
            db.commit()
            db_logger.info(f"Registration status updated: {registration_id} - {new_status}")
            return registration
        except Exception as e:
            db.rollback()
            db_logger.error(f"Failed to update registration status: {str(e)}")
            raise
    
    @staticmethod
    def update_result_publication(db: Session, exam_id: str, published_by: str) -> int:
        """Publish all results for an exam."""
        try:
            # Update all results for the exam
            updated_count = db.query(Results).filter(
                and_(
                    Results.exam_id == exam_id,
                    Results.is_published == False
                )
            ).update({
                Results.is_published: True,
                Results.published_date: func.current_date()
            })
            
            # Create publication record
            publication = ResultPublication(
                exam_id=exam_id,
                published_by=published_by,
                status=PublicationStatus.PUBLISHED,
                total_results=updated_count
            )
            db.add(publication)
            
            db.commit()
            db_logger.info(f"Results published for exam {exam_id}: {updated_count} results")
            return updated_count
        except Exception as e:
            db.rollback()
            db_logger.error(f"Failed to publish results: {str(e)}")
            raise
    
    # DATA DELETION - Two main deletion operations
    
    @staticmethod
    def delete_exam(db: Session, exam_id: str, deleted_by: str) -> bool:
        """Delete an exam (Ministry Admin only)."""
        try:
            exam = db.query(Exam).filter(Exam.exam_id == exam_id).first()
            if not exam:
                raise ValueError("Exam not found")
            
            # Check if exam has registrations
            registration_count = db.query(ExamRegistration).filter(ExamRegistration.exam_id == exam_id).count()
            if registration_count > 0:
                raise ValueError(f"Cannot delete exam with {registration_count} registrations")
            
            # Check if exam has results
            result_count = db.query(Results).filter(Results.exam_id == exam_id).count()
            if result_count > 0:
                raise ValueError(f"Cannot delete exam with {result_count} results")
            
            exam_title = exam.title
            db.delete(exam)
            db.commit()
            
            SecurityAuditTrail.log_admin_action(deleted_by, "DELETE_EXAM", f"Exam: {exam_title}")
            db_logger.info(f"Exam deleted: {exam_title} by {deleted_by}")
            return True
        except Exception as e:
            db.rollback()
            db_logger.error(f"Failed to delete exam: {str(e)}")
            raise
    
    @staticmethod
    def delete_institution(db: Session, institution_id: str, deleted_by: str) -> bool:
        """Delete an institution (Ministry Admin only)."""
        try:
            institution = db.query(Institution).filter(Institution.institution_id == institution_id).first()
            if not institution:
                raise ValueError("Institution not found")
            
            # Check if institution has students
            student_count = db.query(Student).filter(Student.institution_id == institution_id).count()
            if student_count > 0:
                raise ValueError(f"Cannot delete institution with {student_count} students")
            
            # Check if institution has admins
            admin_count = db.query(InstitutionalAdmin).filter(InstitutionalAdmin.institution_id == institution_id).count()
            if admin_count > 0:
                raise ValueError(f"Cannot delete institution with {admin_count} administrators")
            
            institution_name = institution.name
            db.delete(institution)
            db.commit()
            
            SecurityAuditTrail.log_admin_action(deleted_by, "DELETE_INSTITUTION", f"Institution: {institution_name}")
            db_logger.info(f"Institution deleted: {institution_name} by {deleted_by}")
            return True
        except Exception as e:
            db.rollback()
            db_logger.error(f"Failed to delete institution: {str(e)}")
            raise
    
    # DATA RECOVERY - Two recovery operations
    
    @staticmethod
    def recover_deleted_student_data(db: Session, student_email: str) -> Dict[str, Any]:
        """Recover student data from audit logs (simulated)."""
        try:
            # In a real system, this would query audit/backup tables
            # For demonstration, we'll show the concept
            recovery_data = {
                "status": "recovery_initiated",
                "student_email": student_email,
                "recovery_timestamp": datetime.utcnow(),
                "estimated_completion": "24 hours",
                "recovery_id": f"REC_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
            }
            
            db_logger.info(f"Student data recovery initiated for: {student_email}")
            return recovery_data
        except Exception as e:
            db_logger.error(f"Failed to initiate student data recovery: {str(e)}")
            raise
    
    @staticmethod
    def recover_exam_results_after_failure(db: Session, exam_id: str) -> Dict[str, Any]:
        """Recover exam results after system failure."""
        try:
            # Check for backup data
            exam = db.query(Exam).filter(Exam.exam_id == exam_id).first()
            if not exam:
                raise ValueError("Exam not found")
            
            # Simulate recovery process
            recovery_info = {
                "status": "recovery_in_progress",
                "exam_id": exam_id,
                "exam_title": exam.title,
                "recovery_timestamp": datetime.utcnow(),
                "backup_source": "automated_backup_20241201",
                "estimated_records": 150
            }
            
            db_logger.info(f"Exam results recovery initiated for: {exam.title}")
            return recovery_info
        except Exception as e:
            db_logger.error(f"Failed to recover exam results: {str(e)}")
            raise

# Performance monitoring and optimization
class DatabasePerformance:
    """Database performance monitoring and optimization."""
    
    @staticmethod
    def analyze_query_performance(db: Session, query_sql: str) -> Dict[str, Any]:
        """Analyze query performance using EXPLAIN."""
        try:
            explain_query = text(f"EXPLAIN ANALYZE {query_sql}")
            result = db.execute(explain_query)
            execution_plan = result.fetchall()
            
            return {
                "query": query_sql,
                "execution_plan": [str(row) for row in execution_plan],
                "analysis_timestamp": datetime.utcnow()
            }
        except Exception as e:
            db_logger.error(f"Failed to analyze query performance: {str(e)}")
            raise
    
    @staticmethod
    def get_slow_queries(db: Session, limit: int = 10) -> List[Dict[str, Any]]:
        """Get slow running queries (PostgreSQL specific)."""
        try:
            slow_query_sql = text("""
                SELECT query, mean_time, calls, total_time
                FROM pg_stat_statements
                ORDER BY mean_time DESC
                LIMIT :limit
            """)
            
            result = db.execute(slow_query_sql, {"limit": limit})
            return [dict(row) for row in result.fetchall()]
        except Exception as e:
            db_logger.warning(f"Could not retrieve slow queries: {str(e)}")
            return []
    
    @staticmethod
    def get_table_statistics(db: Session) -> Dict[str, Any]:
        """Get table size and row count statistics."""
        try:
            stats_query = text("""
                SELECT 
                    schemaname,
                    tablename,
                    attname,
                    n_distinct,
                    correlation
                FROM pg_stats
                WHERE schemaname = 'public'
                ORDER BY tablename, attname
            """)
            
            result = db.execute(stats_query)
            return {"table_statistics": [dict(row) for row in result.fetchall()]}
        except Exception as e:
            db_logger.warning(f"Could not retrieve table statistics: {str(e)}")
            return {}

# Indexing strategies
class IndexingStrategy:
    """Database indexing strategies for performance optimization."""
    
    @staticmethod
    def create_performance_indexes(db: Session):
        """Create indexes for better query performance."""
        indexes = [
            # Student indexes
            "CREATE INDEX IF NOT EXISTS idx_student_email ON student(email)",
            "CREATE INDEX IF NOT EXISTS idx_student_institution ON student(institution_id)",
            "CREATE INDEX IF NOT EXISTS idx_student_active ON student(is_active)",
            
            # Exam indexes
            "CREATE INDEX IF NOT EXISTS idx_exam_date ON exam(date)",
            "CREATE INDEX IF NOT EXISTS idx_exam_type ON exam(type)",
            "CREATE INDEX IF NOT EXISTS idx_exam_status ON exam(status)",
            
            # Results indexes
            "CREATE INDEX IF NOT EXISTS idx_results_student_exam ON results(student_id, exam_id)",
            "CREATE INDEX IF NOT EXISTS idx_results_published ON results(is_published)",
            "CREATE INDEX IF NOT EXISTS idx_results_status ON results(status)",
            
            # Registration indexes
            "CREATE INDEX IF NOT EXISTS idx_registration_student ON exam_registration(student_id)",
            "CREATE INDEX IF NOT EXISTS idx_registration_exam ON exam_registration(exam_id)",
            "CREATE INDEX IF NOT EXISTS idx_registration_status ON exam_registration(status)",
            
            # Institution indexes
            "CREATE INDEX IF NOT EXISTS idx_institution_region ON institution(region)",
            "CREATE INDEX IF NOT EXISTS idx_institution_type ON institution(type)",
            "CREATE INDEX IF NOT EXISTS idx_institution_verified ON institution(is_verified)"
        ]
        
        for index_sql in indexes:
            try:
                db.execute(text(index_sql))
                db.commit()
                db_logger.info(f"Index created: {index_sql}")
            except Exception as e:
                db.rollback()
                db_logger.warning(f"Failed to create index: {index_sql} - {str(e)}")
