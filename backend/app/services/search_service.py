from sqlalchemy.orm import Session
from sqlalchemy import text, func, and_, or_, desc, asc, case
from typing import List, Dict, Any, Optional
from datetime import datetime, date
import logging

from app.models import *
from app.core.database_operations import DatabaseOperations

search_logger = logging.getLogger("search")

class SearchService:
    """Advanced search service with optimized queries."""
    
    @staticmethod
    def global_search(db: Session, search_term: str, user_role: str, user_id: str = None) -> Dict[str, Any]:
        """Global search across multiple entities based on user role."""
        results = {
            "students": [],
            "exams": [],
            "institutions": [],
            "results": [],
            "total_count": 0
        }
        
        try:
            # Students search (role-based access)
            if user_role in ["ministry_admin", "institutional_admin"]:
                students_query = db.query(Student).filter(
                    or_(
                        Student.first_name.ilike(f"%{search_term}%"),
                        Student.last_name.ilike(f"%{search_term}%"),
                        Student.email.ilike(f"%{search_term}%"),
                        Student.student_number.ilike(f"%{search_term}%")
                    )
                )
                
                # Institutional admin can only see their institution's students
                if user_role == "institutional_admin":
                    admin = db.query(InstitutionalAdmin).filter(InstitutionalAdmin.institutional_admin_id == user_id).first()
                    if admin:
                        students_query = students_query.filter(Student.institution_id == admin.institution_id)
                
                students = students_query.limit(10).all()
                results["students"] = [
                    {
                        "id": str(s.student_id),
                        "name": f"{s.first_name} {s.last_name}",
                        "email": s.email,
                        "institution": s.institution.name if s.institution else None,
                        "type": "student"
                    } for s in students
                ]
            
            # Exams search (public for most users)
            exams_query = db.query(Exam).filter(
                or_(
                    Exam.title.ilike(f"%{search_term}%"),
                    Exam.description.ilike(f"%{search_term}%"),
                    Exam.type.ilike(f"%{search_term}%")
                )
            )
            
            exams = exams_query.limit(10).all()
            results["exams"] = [
                {
                    "id": str(e.exam_id),
                    "title": e.title,
                    "type": e.type,
                    "date": e.date.isoformat() if e.date else None,
                    "status": e.status,
                    "type": "exam"
                } for e in exams
            ]
            
            # Institutions search
            if user_role in ["ministry_admin", "institutional_admin"]:
                institutions_query = db.query(Institution).filter(
                    or_(
                        Institution.name.ilike(f"%{search_term}%"),
                        Institution.address.ilike(f"%{search_term}%"),
                        Institution.region.ilike(f"%{search_term}%")
                    )
                )
                
                institutions = institutions_query.limit(10).all()
                results["institutions"] = [
                    {
                        "id": str(i.institution_id),
                        "name": i.name,
                        "type": i.type,
                        "region": i.region,
                        "verified": i.is_verified,
                        "type": "institution"
                    } for i in institutions
                ]
            
            results["total_count"] = len(results["students"]) + len(results["exams"]) + len(results["institutions"])
            search_logger.info(f"Global search performed: '{search_term}' by {user_role} - {results['total_count']} results")
            
        except Exception as e:
            search_logger.error(f"Global search failed: {str(e)}")
            raise
        
        return results
    
    @staticmethod
    def advanced_student_search(db: Session, filters: Dict[str, Any], user_role: str, user_id: str = None) -> List[Dict[str, Any]]:
        """Advanced student search with multiple filters."""
        try:
            query = db.query(Student).join(Institution, Student.institution_id == Institution.institution_id)
            
            # Apply filters
            if filters.get("name"):
                query = query.filter(
                    or_(
                        Student.first_name.ilike(f"%{filters['name']}%"),
                        Student.last_name.ilike(f"%{filters['name']}%")
                    )
                )
            
            if filters.get("email"):
                query = query.filter(Student.email.ilike(f"%{filters['email']}%"))
            
            if filters.get("institution_id"):
                query = query.filter(Student.institution_id == filters["institution_id"])
            
            if filters.get("region"):
                query = query.filter(Institution.region == filters["region"])
            
            if filters.get("gender"):
                query = query.filter(Student.gender == filters["gender"])
            
            if filters.get("is_active") is not None:
                query = query.filter(Student.is_active == filters["is_active"])
            
            if filters.get("enrollment_date_from"):
                query = query.filter(Student.enrollment_date >= filters["enrollment_date_from"])
            
            if filters.get("enrollment_date_to"):
                query = query.filter(Student.enrollment_date <= filters["enrollment_date_to"])
            
            # Role-based access control
            if user_role == "institutional_admin":
                admin = db.query(InstitutionalAdmin).filter(InstitutionalAdmin.institutional_admin_id == user_id).first()
                if admin:
                    query = query.filter(Student.institution_id == admin.institution_id)
            
            # Pagination
            page = filters.get("page", 1)
            size = filters.get("size", 20)
            offset = (page - 1) * size
            
            students = query.offset(offset).limit(size).all()
            
            return [
                {
                    "student_id": str(s.student_id),
                    "first_name": s.first_name,
                    "last_name": s.last_name,
                    "email": s.email,
                    "phone_number": s.phone_number,
                    "gender": s.gender,
                    "institution_name": s.institution.name,
                    "institution_region": s.institution.region,
                    "enrollment_date": s.enrollment_date.isoformat() if s.enrollment_date else None,
                    "is_active": s.is_active
                } for s in students
            ]
            
        except Exception as e:
            search_logger.error(f"Advanced student search failed: {str(e)}")
            raise
    
    @staticmethod
    def search_exam_results(db: Session, filters: Dict[str, Any], user_role: str, user_id: str = None) -> List[Dict[str, Any]]:
        """Search exam results with comprehensive filters."""
        try:
            query = db.query(Results).join(Student).join(Exam)
            
            # Apply filters
            if filters.get("exam_id"):
                query = query.filter(Results.exam_id == filters["exam_id"])
            
            if filters.get("student_id"):
                query = query.filter(Results.student_id == filters["student_id"])
            
            if filters.get("status"):
                query = query.filter(Results.status == filters["status"])
            
            if filters.get("exam_type"):
                query = query.filter(Exam.type == filters["exam_type"])
            
            if filters.get("institution_id"):
                query = query.filter(Student.institution_id == filters["institution_id"])
            
            if filters.get("published_only"):
                query = query.filter(Results.is_published == True)
            
            if filters.get("grade_min"):
                query = query.filter(Results.grade >= filters["grade_min"])
            
            if filters.get("grade_max"):
                query = query.filter(Results.grade <= filters["grade_max"])
            
            # Role-based access control
            if user_role == "student":
                query = query.filter(Results.student_id == user_id)
                query = query.filter(Results.is_published == True)
            elif user_role == "institutional_admin":
                admin = db.query(InstitutionalAdmin).filter(InstitutionalAdmin.institutional_admin_id == user_id).first()
                if admin:
                    query = query.filter(Student.institution_id == admin.institution_id)
            
            # Sorting
            sort_by = filters.get("sort_by", "created_at")
            sort_order = filters.get("sort_order", "desc")
            
            if hasattr(Results, sort_by):
                if sort_order == "asc":
                    query = query.order_by(asc(getattr(Results, sort_by)))
                else:
                    query = query.order_by(desc(getattr(Results, sort_by)))
            
            results = query.limit(filters.get("limit", 50)).all()
            
            return [
                {
                    "result_id": str(r.result_id),
                    "student_name": f"{r.student.first_name} {r.student.last_name}",
                    "exam_title": r.exam.title,
                    "exam_type": r.exam.type,
                    "grade": r.grade,
                    "status": r.status,
                    "is_published": r.is_published,
                    "published_date": r.published_date.isoformat() if r.published_date else None,
                    "institution": r.student.institution.name if r.student.institution else None
                } for r in results
            ]
            
        except Exception as e:
            search_logger.error(f"Exam results search failed: {str(e)}")
            raise
    
    @staticmethod
    def search_institutions_with_stats(db: Session, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search institutions with statistical information."""
        try:
            # Base query with statistics
            query = db.query(
                Institution,
                func.count(Student.student_id).label('student_count'),
                func.count(InstitutionalAdmin.institutional_admin_id).label('admin_count')
            ).outerjoin(Student).outerjoin(InstitutionalAdmin).group_by(Institution.institution_id)
            
            # Apply filters
            if filters.get("name"):
                query = query.filter(Institution.name.ilike(f"%{filters['name']}%"))
            
            if filters.get("region"):
                query = query.filter(Institution.region == filters["region"])
            
            if filters.get("type"):
                query = query.filter(Institution.type == filters["type"])
            
            if filters.get("verified_only"):
                query = query.filter(Institution.is_verified == True)
            
            # Sorting
            sort_by = filters.get("sort_by", "name")
            if sort_by == "student_count":
                query = query.order_by(desc(func.count(Student.student_id)))
            elif sort_by == "name":
                query = query.order_by(Institution.name)
            
            results = query.limit(filters.get("limit", 50)).all()
            
            return [
                {
                    "institution_id": str(r.Institution.institution_id),
                    "name": r.Institution.name,
                    "type": r.Institution.type,
                    "region": r.Institution.region,
                    "address": r.Institution.address,
                    "is_verified": r.Institution.is_verified,
                    "student_count": r.student_count,
                    "admin_count": r.admin_count,
                    "registration_date": r.Institution.registration_date.isoformat() if r.Institution.registration_date else None
                } for r in results
            ]
            
        except Exception as e:
            search_logger.error(f"Institution search with stats failed: {str(e)}")
            raise
    
    @staticmethod
    def search_notifications(db: Session, user_id: str, user_type: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search user notifications with filters."""
        try:
            query = db.query(Notifications).filter(
                and_(
                    Notifications.user_id == user_id,
                    Notifications.user_type == user_type
                )
            )
            
            # Apply filters
            if filters.get("is_read") is not None:
                query = query.filter(Notifications.is_read == filters["is_read"])
            
            if filters.get("type"):
                query = query.filter(Notifications.type == filters["type"])
            
            if filters.get("date_from"):
                query = query.filter(Notifications.date >= filters["date_from"])
            
            if filters.get("date_to"):
                query = query.filter(Notifications.date <= filters["date_to"])
            
            if filters.get("search_term"):
                query = query.filter(
                    or_(
                        Notifications.title.ilike(f"%{filters['search_term']}%"),
                        Notifications.message.ilike(f"%{filters['search_term']}%")
                    )
                )
            
            # Sorting (newest first by default)
            query = query.order_by(desc(Notifications.created_at))
            
            # Pagination
            page = filters.get("page", 1)
            size = filters.get("size", 20)
            offset = (page - 1) * size
            
            notifications = query.offset(offset).limit(size).all()
            
            return [
                {
                    "notification_id": str(n.notification_id),
                    "title": n.title,
                    "message": n.message,
                    "type": n.type,
                    "is_read": n.is_read,
                    "date": n.date.isoformat() if n.date else None,
                    "created_at": n.created_at.isoformat() if n.created_at else None
                } for n in notifications
            ]
            
        except Exception as e:
            search_logger.error(f"Notification search failed: {str(e)}")
            raise

# SQL Query representations for the five search operations

SEARCH_QUERIES_SQL = {
    "global_search": """
        -- Global search across multiple entities
        WITH student_search AS (
            SELECT 'student' as type, student_id as id, 
                   CONCAT(first_name, ' ', last_name) as name,
                   email, institution_id
            FROM student 
            WHERE first_name ILIKE %s OR last_name ILIKE %s 
                  OR email ILIKE %s OR student_number ILIKE %s
            LIMIT 10
        ),
        exam_search AS (
            SELECT 'exam' as type, exam_id as id, title as name,
                   type as exam_type, date
            FROM exam
            WHERE title ILIKE %s OR description ILIKE %s OR type ILIKE %s
            LIMIT 10
        ),
        institution_search AS (
            SELECT 'institution' as type, institution_id as id, name,
                   type as inst_type, region
            FROM institution
            WHERE name ILIKE %s OR address ILIKE %s OR region ILIKE %s
            LIMIT 10
        )
        SELECT * FROM student_search
        UNION ALL
        SELECT * FROM exam_search
        UNION ALL
        SELECT * FROM institution_search;
    """,
    
    "advanced_student_search": """
        -- Advanced student search with joins and filters
        SELECT s.student_id, s.first_name, s.last_name, s.email,
               s.phone_number, s.gender, s.enrollment_date, s.is_active,
               i.name as institution_name, i.region as institution_region
        FROM student s
        JOIN institution i ON s.institution_id = i.institution_id
        WHERE ($1 IS NULL OR s.first_name ILIKE $1 OR s.last_name ILIKE $1)
          AND ($2 IS NULL OR s.email ILIKE $2)
          AND ($3 IS NULL OR s.institution_id = $3)
          AND ($4 IS NULL OR i.region = $4)
          AND ($5 IS NULL OR s.gender = $5)
          AND ($6 IS NULL OR s.is_active = $6)
          AND ($7 IS NULL OR s.enrollment_date >= $7)
          AND ($8 IS NULL OR s.enrollment_date <= $8)
        ORDER BY s.last_name, s.first_name
        LIMIT $9 OFFSET $10;
    """,
    
    "search_exam_results": """
        -- Search exam results with comprehensive filters
        SELECT r.result_id, r.grade, r.status, r.is_published, r.published_date,
               CONCAT(s.first_name, ' ', s.last_name) as student_name,
               e.title as exam_title, e.type as exam_type,
               i.name as institution_name
        FROM results r
        JOIN student s ON r.student_id = s.student_id
        JOIN exam e ON r.exam_id = e.exam_id
        JOIN institution i ON s.institution_id = i.institution_id
        WHERE ($1 IS NULL OR r.exam_id = $1)
          AND ($2 IS NULL OR r.student_id = $2)
          AND ($3 IS NULL OR r.status = $3)
          AND ($4 IS NULL OR e.type = $4)
          AND ($5 IS NULL OR s.institution_id = $5)
          AND ($6 IS NULL OR r.is_published = $6)
          AND ($7 IS NULL OR r.grade >= $7)
          AND ($8 IS NULL OR r.grade <= $8)
        ORDER BY r.created_at DESC
        LIMIT $9;
    """,
    
    "search_institutions_with_stats": """
        -- Search institutions with statistical information
        SELECT i.institution_id, i.name, i.type, i.region, i.address,
               i.is_verified, i.registration_date,
               COUNT(DISTINCT s.student_id) as student_count,
               COUNT(DISTINCT ia.institutional_admin_id) as admin_count
        FROM institution i
        LEFT JOIN student s ON i.institution_id = s.institution_id
        LEFT JOIN institutional_admin ia ON i.institution_id = ia.institution_id
        WHERE ($1 IS NULL OR i.name ILIKE $1)
          AND ($2 IS NULL OR i.region = $2)
          AND ($3 IS NULL OR i.type = $3)
          AND ($4 IS NULL OR i.is_verified = $4)
        GROUP BY i.institution_id, i.name, i.type, i.region, i.address,
                 i.is_verified, i.registration_date
        ORDER BY CASE WHEN $5 = 'student_count' THEN COUNT(DISTINCT s.student_id) END DESC,
                 CASE WHEN $5 = 'name' THEN i.name END ASC
        LIMIT $6;
    """,
    
    "search_notifications": """
        -- Search user notifications with filters
        SELECT notification_id, title, message, type, is_read, date, created_at
        FROM notifications
        WHERE user_id = $1 AND user_type = $2
          AND ($3 IS NULL OR is_read = $3)
          AND ($4 IS NULL OR type = $4)
          AND ($5 IS NULL OR date >= $5)
          AND ($6 IS NULL OR date <= $6)
          AND ($7 IS NULL OR title ILIKE $7 OR message ILIKE $7)
        ORDER BY created_at DESC
        LIMIT $8 OFFSET $9;
    """
}
