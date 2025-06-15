from typing import List, Optional, Union
from sqlalchemy.orm import Session
from sqlalchemy import and_, text
from datetime import datetime, date
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import uuid

from app.models import Notifications, Student, InstitutionalAdmin, MinistryAdmin, Results, Exam, Institution
from app.core.config import settings

class NotificationService:
    """Enhanced service for handling notifications with proper relationships"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_notification(
        self, 
        user_id: Union[uuid.UUID, str], 
        user_type: str,
        message: str,
        title: Optional[str] = None,
        notification_type: str = "info"
    ) -> Notifications:
        """Create a new notification for a user with validation"""
        # Convert string UUID to UUID object if needed
        if isinstance(user_id, str):
            user_id = uuid.UUID(user_id)
            
        # Validate user exists
        if user_type == "student":
            user = self.db.query(Student).filter(Student.student_id == user_id).first()
            if not user:
                raise ValueError(f"Student with ID {user_id} not found")
        elif user_type == "institutional_admin":
            user = self.db.query(InstitutionalAdmin).filter(InstitutionalAdmin.institutional_admin_id == user_id).first()
            if not user:
                raise ValueError(f"Institutional admin with ID {user_id} not found")
        elif user_type == "ministry_admin":
            user = self.db.query(MinistryAdmin).filter(MinistryAdmin.ministry_admin_id == user_id).first()
            if not user:
                raise ValueError(f"Ministry admin with ID {user_id} not found")
        else:
            raise ValueError(f"Invalid user type: {user_type}")
        
        # Create notification
        notification = Notifications(
            user_id=user_id,
            user_type=user_type,
            message=message,
            title=title,
            type=notification_type,
            date=date.today()
        )
        
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        
        return notification
    
    def notify_exam_registration_opened(self, exam_id: Union[uuid.UUID, str]) -> int:
        """Notify all students when exam registration opens using database function"""
        if isinstance(exam_id, str):
            exam_id = uuid.UUID(exam_id)
            
        # Get exam details
        exam = self.db.query(Exam).filter(Exam.exam_id == exam_id).first()
        if not exam:
            raise ValueError(f"Exam with ID {exam_id} not found")
        
        # Use the database function to send notifications to all students
        title = f"Registration Open: {exam.title}"
        message = f"Registration is now open for {exam.title}. Register before {exam.registration_end_date}."
        
        # Get all active students
        students = self.db.query(Student).filter(Student.is_active == True).all()
        
        notifications_sent = 0
        for student in students:
            self.create_notification(
                user_id=student.student_id,
                user_type="student",
                title=title,
                message=message,
                notification_type="exam_registration"
            )
            notifications_sent += 1
        
        return notifications_sent
    
    def notify_results_published(self, exam_id: Union[uuid.UUID, str]) -> int:
        """Notify students when their results are published"""
        if isinstance(exam_id, str):
            exam_id = uuid.UUID(exam_id)
            
        # Get exam details
        exam = self.db.query(Exam).filter(Exam.exam_id == exam_id).first()
        if not exam:
            raise ValueError(f"Exam with ID {exam_id} not found")
            
        # Get all students who have results for this exam
        results = self.db.query(Results).filter(
            and_(
                Results.exam_id == exam_id,
                Results.is_published == True
            )
        ).all()
        
        notifications_sent = 0
        
        for result in results:
            title = f"Results Published: {exam.title}"
            message = f"Your results for {exam.title} have been published. Check your dashboard to view them."
            
            self.create_notification(
                user_id=result.student_id,
                user_type="student",
                title=title,
                message=message,
                notification_type="result_published"
            )
            notifications_sent += 1
        
        return notifications_sent
    
    def notify_institution_students(
        self, 
        institution_id: Union[uuid.UUID, str],
        title: str,
        message: str,
        notification_type: str = "info"
    ) -> int:
        """Notify all students in an institution"""
        if isinstance(institution_id, str):
            institution_id = uuid.UUID(institution_id)
            
        # Get institution
        institution = self.db.query(Institution).filter(Institution.institution_id == institution_id).first()
        if not institution:
            raise ValueError(f"Institution with ID {institution_id} not found")
            
        # Get all students in the institution
        students = self.db.query(Student).filter(Student.institution_id == institution_id).all()
        
        notifications_sent = 0
        for student in students:
            self.create_notification(
                user_id=student.student_id,
                user_type="student",
                title=title,
                message=message,
                notification_type=notification_type
            )
            notifications_sent += 1
        
        return notifications_sent
    
    def notify_institutional_admins(
        self,
        title: str,
        message: str,
        notification_type: str = "info"
    ) -> int:
        """Notify all institutional admins"""
        # Get all institutional admins
        admins = self.db.query(InstitutionalAdmin).all()
        
        notifications_sent = 0
        for admin in admins:
            self.create_notification(
                user_id=admin.institutional_admin_id,
                user_type="institutional_admin",
                title=title,
                message=message,
                notification_type=notification_type
            )
            notifications_sent += 1
        
        return notifications_sent
    
    def get_user_notifications(
        self, 
        user_id: Union[uuid.UUID, str],
        user_type: str,
        unread_only: bool = False,
        limit: int = 20
    ) -> List[Notifications]:
        """Get notifications for a specific user"""
        if isinstance(user_id, str):
            user_id = uuid.UUID(user_id)
            
        query = self.db.query(Notifications).filter(
            and_(
                Notifications.user_id == user_id,
                Notifications.user_type == user_type
            )
        )
        
        if unread_only:
            query = query.filter(Notifications.is_read == False)
        
        return query.order_by(Notifications.created_at.desc()).limit(limit).all()
    
    def mark_notification_read(self, notification_id: Union[uuid.UUID, str]) -> bool:
        """Mark a notification as read"""
        if isinstance(notification_id, str):
            notification_id = uuid.UUID(notification_id)
            
        notification = self.db.query(Notifications).filter(
            Notifications.notification_id == notification_id
        ).first()
        
        if not notification:
            return False
        
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        self.db.commit()
        
        return True
    
    def mark_all_user_notifications_read(
        self, 
        user_id: Union[uuid.UUID, str],
        user_type: str
    ) -> int:
        """Mark all notifications for a user as read"""
        if isinstance(user_id, str):
            user_id = uuid.UUID(user_id)
            
        result = self.db.query(Notifications).filter(
            and_(
                Notifications.user_id == user_id,
                Notifications.user_type == user_type,
                Notifications.is_read == False
            )
        ).update({
            "is_read": True,
            "read_at": datetime.utcnow()
        })
        
        self.db.commit()
        return result
    
    def send_email_notification(self, email: str, subject: str, message: str) -> bool:
        """Send email notification (if SMTP is configured)"""
        if not all([settings.SMTP_HOST, settings.SMTP_USER, settings.SMTP_PASSWORD]):
            return False
        
        try:
            msg = MIMEMultipart()
            msg['From'] = settings.SMTP_USER
            msg['To'] = email
            msg['Subject'] = subject
            
            msg.attach(MIMEText(message, 'plain'))
            
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            text = msg.as_string()
            server.sendmail(settings.SMTP_USER, email, text)
            server.quit()
            
            return True
        except Exception as e:
            print(f"Email sending failed: {e}")
            return False
