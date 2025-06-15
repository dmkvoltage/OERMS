from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, date
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.models import Notifications, Student, InstitutionalAdmin, MinistryAdmin, Results, Exam
from app.core.config import settings

class NotificationService:
    """Service for handling notifications as per FR15"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_notification(
        self, 
        user_id: str, 
        message: str, 
        notification_type: str = "info"
    ) -> Notifications:
        """Create a new notification for a user"""
        notification = Notifications(
            user_id=user_id,
            message=message,
            type=notification_type,
            date=date.today()
        )
        
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        
        return notification
    
    def notify_exam_registration_opened(self, exam_id: str) -> int:
        """Notify all students when exam registration opens"""
        exam = self.db.query(Exam).filter(Exam.exam_id == exam_id).first()
        if not exam:
            return 0
        
        # Get all active students
        students = self.db.query(Student).filter(Student.is_active == True).all()
        
        message = f"Registration is now open for {exam.title}. Register before the deadline!"
        notifications_sent = 0
        
        for student in students:
            self.create_notification(
                user_id=str(student.student_id),
                message=message,
                notification_type="exam_registration"
            )
            notifications_sent += 1
        
        return notifications_sent
    
    def notify_results_published(self, exam_id: str) -> int:
        """Notify students when their results are published"""
        # Get all students who have results for this exam
        results = self.db.query(Results).filter(
            and_(
                Results.exam_id == exam_id,
                Results.is_published == True
            )
        ).all()
        
        notifications_sent = 0
        
        for result in results:
            exam = result.exam
            message = f"Your results for {exam.title} have been published. Check your dashboard to view them."
            
            self.create_notification(
                user_id=str(result.student_id),
                message=message,
                notification_type="result_published"
            )
            notifications_sent += 1
        
        return notifications_sent
    
    def notify_registration_verified(self, registration_id: str) -> bool:
        """Notify student when their exam registration is verified"""
        from app.models import ExamRegistration
        
        registration = self.db.query(ExamRegistration).filter(
            ExamRegistration.registration_id == registration_id
        ).first()
        
        if not registration:
            return False
        
        exam = registration.exam
        message = f"Your registration for {exam.title} has been verified. Candidate number: {registration.candidate_number}"
        
        self.create_notification(
            user_id=str(registration.student_id),
            message=message,
            notification_type="registration_verified"
        )
        
        return True
    
    def get_user_notifications(
        self, 
        user_id: str, 
        unread_only: bool = False,
        limit: int = 20
    ) -> List[Notifications]:
        """Get notifications for a specific user"""
        query = self.db.query(Notifications).filter(Notifications.user_id == user_id)
        
        if unread_only:
            query = query.filter(Notifications.is_read == False)
        
        return query.order_by(Notifications.created_at.desc()).limit(limit).all()
    
    def mark_notification_read(self, notification_id: str, user_id: str) -> bool:
        """Mark a notification as read"""
        notification = self.db.query(Notifications).filter(
            and_(
                Notifications.notification_id == notification_id,
                Notifications.user_id == user_id
            )
        ).first()
        
        if not notification:
            return False
        
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        self.db.commit()
        
        return True
    
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
