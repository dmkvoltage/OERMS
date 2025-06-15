from sqlalchemy.orm import Session
from sqlalchemy import text, func
from typing import List, Dict, Any, Optional
from datetime import datetime, date
import logging

from app.models import *

param_logger = logging.getLogger("parameterized_queries")

class ParameterizedQueries:
    """Parameterized queries using SQLAlchemy and raw SQL for complex operations."""
    
    @staticmethod
    def get_student_performance_report(db: Session, student_id: str, start_date: date = None, end_date: date = None) -> Dict[str, Any]:
        """Parameterized query to get comprehensive student performance report."""
        try:
            query = text("""
                WITH student_exams AS (
                    SELECT 
                        e.exam_id,
                        e.title,
                        e.type,
                        e.date,
                        r.grade,
                        r.status,
                        r.is_published,
                        ROW_NUMBER() OVER (ORDER BY e.date DESC) as exam_sequence
                    FROM exam e
                    JOIN results r ON e.exam_id = r.exam_id
                    WHERE r.student_id = :student_id
                      AND (:start_date IS NULL OR e.date >= :start_date)
                      AND (:end_date IS NULL OR e.date <= :end_date)
                      AND r.is_published = true
                ),
                performance_stats AS (
                    SELECT 
                        COUNT(*) as total_exams,
                        AVG(CASE WHEN grade IS NOT NULL THEN grade END) as average_grade,
                        COUNT(CASE WHEN status = 'Pass' THEN 1 END) as passed_exams,
                        COUNT(CASE WHEN status = 'Fail' THEN 1 END) as failed_exams,
                        MAX(grade) as highest_grade,
                        MIN(grade) as lowest_grade
                    FROM student_exams
                )
                SELECT 
                    s.first_name,
                    s.last_name,
                    s.email,
                    i.name as institution_name,
                    ps.*,
                    json_agg(
                        json_build_object(
                            'exam_id', se.exam_id,
                            'title', se.title,
                            'type', se.type,
                            'date', se.date,
                            'grade', se.grade,
                            'status', se.status
                        ) ORDER BY se.date DESC
                    ) as exam_history
                FROM student s
                JOIN institution i ON s.institution_id = i.institution_id
                CROSS JOIN performance_stats ps
                LEFT JOIN student_exams se ON true
                WHERE s.student_id = :student_id
                GROUP BY s.student_id, s.first_name, s.last_name, s.email, i.name, 
                         ps.total_exams, ps.average_grade, ps.passed_exams, ps.failed_exams,
                         ps.highest_grade, ps.lowest_grade
            """)
            
            result = db.execute(query, {
                "student_id": student_id,
                "start_date": start_date,
                "end_date": end_date
            }).fetchone()
            
            if result:
                return dict(result._mapping)
            return {}
            
        except Exception as e:
            param_logger.error(f"Failed to get student performance report: {str(e)}")
            raise
    
    @staticmethod
    def get_institution_analytics(db: Session, institution_id: str, academic_year: int = None) -> Dict[str, Any]:
        """Parameterized query for comprehensive institution analytics."""
        try:
            query = text("""
                WITH institution_stats AS (
                    SELECT 
                        COUNT(DISTINCT s.student_id) as total_students,
                        COUNT(DISTINCT CASE WHEN s.is_active = true THEN s.student_id END) as active_students,
                        COUNT(DISTINCT s.gender) as gender_diversity,
                        COUNT(DISTINCT ia.institutional_admin_id) as total_admins
                    FROM institution i
                    LEFT JOIN student s ON i.institution_id = s.institution_id
                    LEFT JOIN institutional_admin ia ON i.institution_id = ia.institution_id
                    WHERE i.institution_id = :institution_id
                ),
                exam_participation AS (
                    SELECT 
                        COUNT(DISTINCT er.exam_id) as exams_participated,
                        COUNT(DISTINCT er.registration_id) as total_registrations,
                        COUNT(CASE WHEN er.status = 'Approved' THEN 1 END) as approved_registrations,
                        COUNT(CASE WHEN er.status = 'Pending' THEN 1 END) as pending_registrations
                    FROM student s
                    JOIN exam_registration er ON s.student_id = er.student_id
                    JOIN exam e ON er.exam_id = e.exam_id
                    WHERE s.institution_id = :institution_id
                      AND (:academic_year IS NULL OR EXTRACT(YEAR FROM e.date) = :academic_year)
                ),
                results_summary AS (
                    SELECT 
                        COUNT(DISTINCT r.result_id) as total_results,
                        COUNT(CASE WHEN r.status = 'Pass' THEN 1 END) as passed_results,
                        COUNT(CASE WHEN r.status = 'Fail' THEN 1 END) as failed_results,
                        AVG(CASE WHEN r.grade IS NOT NULL THEN r.grade END) as average_grade,
                        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY r.grade) as median_grade
                    FROM student s
                    JOIN results r ON s.student_id = r.student_id
                    JOIN exam e ON r.exam_id = e.exam_id
                    WHERE s.institution_id = :institution_id
                      AND r.is_published = true
                      AND (:academic_year IS NULL OR EXTRACT(YEAR FROM e.date) = :academic_year)
                )
                SELECT 
                    i.name as institution_name,
                    i.type as institution_type,
                    i.region,
                    i.is_verified,
                    ist.*,
                    ep.*,
                    rs.*,
                    CASE 
                        WHEN rs.total_results > 0 THEN 
                            ROUND((rs.passed_results::decimal / rs.total_results * 100), 2)
                        ELSE 0 
                    END as pass_rate_percentage
                FROM institution i
                CROSS JOIN institution_stats ist
                CROSS JOIN exam_participation ep
                CROSS JOIN results_summary rs
                WHERE i.institution_id = :institution_id
            """)
            
            result = db.execute(query, {
                "institution_id": institution_id,
                "academic_year": academic_year
            }).fetchone()
            
            if result:
                return dict(result._mapping)
            return {}
            
        except Exception as e:
            param_logger.error(f"Failed to get institution analytics: {str(e)}")
            raise
    
    @staticmethod
    def get_exam_statistics_by_type(db: Session, exam_type: str, start_date: date = None, end_date: date = None) -> List[Dict[str, Any]]:
        """Parameterized query for exam statistics by type with date filtering."""
        try:
            query = text("""
                WITH exam_stats AS (
                    SELECT 
                        e.exam_id,
                        e.title,
                        e.date,
                        e.status,
                        COUNT(DISTINCT er.registration_id) as total_registrations,
                        COUNT(DISTINCT CASE WHEN er.status = 'Approved' THEN er.registration_id END) as approved_registrations,
                        COUNT(DISTINCT r.result_id) as total_results,
                        COUNT(CASE WHEN r.status = 'Pass' THEN 1 END) as passed_count,
                        COUNT(CASE WHEN r.status = 'Fail' THEN 1 END) as failed_count,
                        COUNT(CASE WHEN r.status = 'Absent' THEN 1 END) as absent_count,
                        AVG(CASE WHEN r.grade IS NOT NULL THEN r.grade END) as average_grade,
                        MAX(r.grade) as highest_grade,
                        MIN(r.grade) as lowest_grade,
                        STDDEV(r.grade) as grade_std_deviation
                    FROM exam e
                    LEFT JOIN exam_registration er ON e.exam_id = er.exam_id
                    LEFT JOIN results r ON e.exam_id = r.exam_id AND r.is_published = true
                    WHERE e.type = :exam_type
                      AND (:start_date IS NULL OR e.date >= :start_date)
                      AND (:end_date IS NULL OR e.date <= :end_date)
                    GROUP BY e.exam_id, e.title, e.date, e.status
                ),
                regional_breakdown AS (
                    SELECT 
                        e.exam_id,
                        i.region,
                        COUNT(DISTINCT s.student_id) as students_from_region,
                        COUNT(CASE WHEN r.status = 'Pass' THEN 1 END) as regional_passes
                    FROM exam e
                    JOIN results r ON e.exam_id = r.exam_id
                    JOIN student s ON r.student_id = s.student_id
                    JOIN institution i ON s.institution_id = i.institution_id
                    WHERE e.type = :exam_type
                      AND r.is_published = true
                      AND (:start_date IS NULL OR e.date >= :start_date)
                      AND (:end_date IS NULL OR e.date <= :end_date)
                    GROUP BY e.exam_id, i.region
                )
                SELECT 
                    es.*,
                    CASE 
                        WHEN es.total_results > 0 THEN 
                            ROUND((es.passed_count::decimal / es.total_results * 100), 2)
                        ELSE 0 
                    END as pass_rate,
                    json_agg(
                        json_build_object(
                            'region', rb.region,
                            'students_count', rb.students_from_region,
                            'passes', rb.regional_passes,
                            'regional_pass_rate', 
                            CASE 
                                WHEN rb.students_from_region > 0 THEN 
                                    ROUND((rb.regional_passes::decimal / rb.students_from_region * 100), 2)
                                ELSE 0 
                            END
                        )
                    ) as regional_breakdown
                FROM exam_stats es
                LEFT JOIN regional_breakdown rb ON es.exam_id = rb.exam_id
                GROUP BY es.exam_id, es.title, es.date, es.status, es.total_registrations,
                         es.approved_registrations, es.total_results, es.passed_count,
                         es.failed_count, es.absent_count, es.average_grade, es.highest_grade,
                         es.lowest_grade, es.grade_std_deviation
                ORDER BY es.date DESC
            """)
            
            result = db.execute(query, {
                "exam_type": exam_type,
                "start_date": start_date,
                "end_date": end_date
            }).fetchall()
            
            return [dict(row._mapping) for row in result]
            
        except Exception as e:
            param_logger.error(f"Failed to get exam statistics by type: {str(e)}")
            raise
    
    @staticmethod
    def get_user_activity_log(db: Session, user_id: str, user_type: str, days_back: int = 30) -> List[Dict[str, Any]]:
        """Parameterized query for user activity tracking."""
        try:
            query = text("""
                WITH user_activities AS (
                    -- Login activities (simulated from notifications)
                    SELECT 
                        'login' as activity_type,
                        created_at as activity_time,
                        'User logged in' as description,
                        null as resource_id,
                        null as resource_type
                    FROM notifications
                    WHERE user_id = :user_id 
                      AND user_type = :user_type
                      AND type = 'system'
                      AND created_at >= CURRENT_DATE - INTERVAL ':days_back days'
                    
                    UNION ALL
                    
                    -- Exam registrations
                    SELECT 
                        'exam_registration' as activity_type,
                        er.registration_date as activity_time,
                        CONCAT('Registered for exam: ', e.title) as description,
                        er.exam_id as resource_id,
                        'exam' as resource_type
                    FROM exam_registration er
                    JOIN exam e ON er.exam_id = e.exam_id
                    WHERE er.student_id = :user_id
                      AND :user_type = 'student'
                      AND er.registration_date >= CURRENT_DATE - INTERVAL ':days_back days'
                    
                    UNION ALL
                    
                    -- Result publications (for ministry admins)
                    SELECT 
                        'result_publication' as activity_type,
                        rp.publication_date as activity_time,
                        CONCAT('Published results for exam: ', e.title) as description,
                        rp.exam_id as resource_id,
                        'exam' as resource_type
                    FROM result_publication rp
                    JOIN exam e ON rp.exam_id = e.exam_id
                    WHERE rp.published_by = :user_id
                      AND :user_type = 'ministry_admin'
                      AND rp.publication_date >= CURRENT_DATE - INTERVAL ':days_back days'
                    
                    UNION ALL
                    
                    -- Student enrollments (for institutional admins)
                    SELECT 
                        'student_enrollment' as activity_type,
                        s.created_at as activity_time,
                        CONCAT('Enrolled student: ', s.first_name, ' ', s.last_name) as description,
                        s.student_id as resource_id,
                        'student' as resource_type
                    FROM student s
                    WHERE s.enrolled_by = :user_id
                      AND :user_type = 'institutional_admin'
                      AND s.created_at >= CURRENT_DATE - INTERVAL ':days_back days'
                )
                SELECT 
                    activity_type,
                    activity_time,
                    description,
                    resource_id,
                    resource_type,
                    DATE(activity_time) as activity_date,
                    EXTRACT(HOUR FROM activity_time) as activity_hour
                FROM user_activities
                ORDER BY activity_time DESC
                LIMIT 100
            """)
            
            result = db.execute(query, {
                "user_id": user_id,
                "user_type": user_type,
                "days_back": days_back
            }).fetchall()
            
            return [dict(row._mapping) for row in result]
            
        except Exception as e:
            param_logger.error(f"Failed to get user activity log: {str(e)}")
            raise
    
    @staticmethod
    def get_system_health_metrics(db: Session, metric_date: date = None) -> Dict[str, Any]:
        """Parameterized query for system health and performance metrics."""
        try:
            if metric_date is None:
                metric_date = date.today()
            
            query = text("""
                WITH daily_metrics AS (
                    SELECT 
                        :metric_date as report_date,
                        COUNT(DISTINCT s.student_id) as total_active_students,
                        COUNT(DISTINCT i.institution_id) as total_institutions,
                        COUNT(DISTINCT e.exam_id) as total_active_exams,
                        COUNT(DISTINCT er.registration_id) as daily_registrations,
                        COUNT(DISTINCT r.result_id) as daily_results_published
                    FROM student s
                    CROSS JOIN institution i
                    CROSS JOIN exam e
                    LEFT JOIN exam_registration er ON DATE(er.registration_date) = :metric_date
                    LEFT JOIN results r ON DATE(r.published_date) = :metric_date AND r.is_published = true
                    WHERE s.is_active = true
                      AND e.status = 'Active'
                ),
                performance_metrics AS (
                    SELECT 
                        COUNT(*) as total_notifications_sent,
                        COUNT(CASE WHEN is_read = true THEN 1 END) as notifications_read,
                        AVG(EXTRACT(EPOCH FROM (read_at - created_at))/3600) as avg_read_time_hours
                    FROM notifications
                    WHERE DATE(created_at) = :metric_date
                ),
                error_metrics AS (
                    SELECT 
                        COUNT(*) as total_failed_operations,
                        COUNT(DISTINCT user_id) as users_with_errors
                    FROM notifications
                    WHERE DATE(created_at) = :metric_date
                      AND type = 'system'
                      AND message LIKE '%error%' OR message LIKE '%failed%'
                )
                SELECT 
                    dm.*,
                    pm.total_notifications_sent,
                    pm.notifications_read,
                    pm.avg_read_time_hours,
                    em.total_failed_operations,
                    em.users_with_errors,
                    CASE 
                        WHEN pm.total_notifications_sent > 0 THEN 
                            ROUND((pm.notifications_read::decimal / pm.total_notifications_sent * 100), 2)
                        ELSE 0 
                    END as notification_read_rate,
                    CASE 
                        WHEN dm.total_active_students > 0 THEN 
                            ROUND((dm.daily_registrations::decimal / dm.total_active_students * 100), 4)
                        ELSE 0 
                    END as student_engagement_rate
                FROM daily_metrics dm
                CROSS JOIN performance_metrics pm
                CROSS JOIN error_metrics em
            """)
            
            result = db.execute(query, {
                "metric_date": metric_date
            }).fetchone()
            
            if result:
                return dict(result._mapping)
            return {}
            
        except Exception as e:
            param_logger.error(f"Failed to get system health metrics: {str(e)}")
            raise

# Raw SQL representations of the parameterized queries
PARAMETERIZED_QUERIES_SQL = {
    "student_performance_report": """
        -- Student Performance Report with Parameters
        -- Parameters: student_id, start_date, end_date
        WITH student_exams AS (
            SELECT 
                e.exam_id, e.title, e.type, e.date,
                r.grade, r.status, r.is_published,
                ROW_NUMBER() OVER (ORDER BY e.date DESC) as exam_sequence
            FROM exam e
            JOIN results r ON e.exam_id = r.exam_id
            WHERE r.student_id = $1
              AND ($2 IS NULL OR e.date >= $2)
              AND ($3 IS NULL OR e.date <= $3)
              AND r.is_published = true
        )
        SELECT s.first_name, s.last_name, s.email, i.name as institution_name,
               COUNT(se.exam_id) as total_exams,
               AVG(se.grade) as average_grade,
               COUNT(CASE WHEN se.status = 'Pass' THEN 1 END) as passed_exams
        FROM student s
        JOIN institution i ON s.institution_id = i.institution_id
        LEFT JOIN student_exams se ON true
        WHERE s.student_id = $1
        GROUP BY s.student_id, s.first_name, s.last_name, s.email, i.name;
    """,
    
    "institution_analytics": """
        -- Institution Analytics with Academic Year Parameter
        -- Parameters: institution_id, academic_year
        SELECT i.name, i.type, i.region,
               COUNT(DISTINCT s.student_id) as total_students,
               COUNT(DISTINCT er.registration_id) as total_registrations,
               AVG(r.grade) as average_grade,
               COUNT(CASE WHEN r.status = 'Pass' THEN 1 END) as total_passes
        FROM institution i
        LEFT JOIN student s ON i.institution_id = s.institution_id
        LEFT JOIN exam_registration er ON s.student_id = er.student_id
        LEFT JOIN results r ON s.student_id = r.student_id
        LEFT JOIN exam e ON r.exam_id = e.exam_id
        WHERE i.institution_id = $1
          AND ($2 IS NULL OR EXTRACT(YEAR FROM e.date) = $2)
        GROUP BY i.institution_id, i.name, i.type, i.region;
    """,
    
    "exam_statistics_by_type": """
        -- Exam Statistics by Type with Date Range
        -- Parameters: exam_type, start_date, end_date
        SELECT e.exam_id, e.title, e.date,
               COUNT(DISTINCT er.registration_id) as registrations,
               COUNT(DISTINCT r.result_id) as results,
               AVG(r.grade) as average_grade,
               COUNT(CASE WHEN r.status = 'Pass' THEN 1 END) as passes
        FROM exam e
        LEFT JOIN exam_registration er ON e.exam_id = er.exam_id
        LEFT JOIN results r ON e.exam_id = r.exam_id
        WHERE e.type = $1
          AND ($2 IS NULL OR e.date >= $2)
          AND ($3 IS NULL OR e.date <= $3)
        GROUP BY e.exam_id, e.title, e.date
        ORDER BY e.date DESC;
    """,
    
    "user_activity_log": """
        -- User Activity Log with Time Range
        -- Parameters: user_id, user_type, days_back
        SELECT 'exam_registration' as activity_type,
               er.registration_date as activity_time,
               CONCAT('Registered for: ', e.title) as description
        FROM exam_registration er
        JOIN exam e ON er.exam_id = e.exam_id
        WHERE er.student_id = $1 AND $2 = 'student'
          AND er.registration_date >= CURRENT_DATE - INTERVAL '$3 days'
        UNION ALL
        SELECT 'result_publication' as activity_type,
               rp.publication_date as activity_time,
               CONCAT('Published results for: ', e.title) as description
        FROM result_publication rp
        JOIN exam e ON rp.exam_id = e.exam_id
        WHERE rp.published_by = $1 AND $2 = 'ministry_admin'
          AND rp.publication_date >= CURRENT_DATE - INTERVAL '$3 days'
        ORDER BY activity_time DESC;
    """,
    
    "system_health_metrics": """
        -- System Health Metrics for Specific Date
        -- Parameters: metric_date
        SELECT $1 as report_date,
               COUNT(DISTINCT s.student_id) as active_students,
               COUNT(DISTINCT i.institution_id) as total_institutions,
               COUNT(DISTINCT e.exam_id) as active_exams,
               COUNT(CASE WHEN DATE(er.registration_date) = $1 THEN 1 END) as daily_registrations,
               COUNT(CASE WHEN DATE(r.published_date) = $1 THEN 1 END) as daily_publications
        FROM student s
        CROSS JOIN institution i
        CROSS JOIN exam e
        LEFT JOIN exam_registration er ON true
        LEFT JOIN results r ON r.is_published = true
        WHERE s.is_active = true AND e.status = 'Active';
    """
}
