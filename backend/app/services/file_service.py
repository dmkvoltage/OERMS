from typing import List, Optional
import os
import uuid
from fastapi import UploadFile, HTTPException, status
from pathlib import Path
import shutil

class FileService:
    """Service for handling file uploads (student documents, etc.)"""
    
    def __init__(self):
        self.upload_dir = Path("uploads")
        self.upload_dir.mkdir(exist_ok=True)
        
        # Create subdirectories for different file types
        (self.upload_dir / "student_documents").mkdir(exist_ok=True)
        (self.upload_dir / "exam_materials").mkdir(exist_ok=True)
        (self.upload_dir / "results").mkdir(exist_ok=True)
    
    def validate_file(self, file: UploadFile, allowed_types: List[str], max_size_mb: int = 10) -> bool:
        """Validate uploaded file"""
        # Check file type
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type {file.content_type} not allowed. Allowed types: {allowed_types}"
            )
        
        # Check file size (approximate)
        if hasattr(file.file, 'seek') and hasattr(file.file, 'tell'):
            file.file.seek(0, 2)  # Seek to end
            size = file.file.tell()
            file.file.seek(0)  # Reset to beginning
            
            if size > max_size_mb * 1024 * 1024:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"File size exceeds {max_size_mb}MB limit"
                )
        
        return True
    
    def save_student_document(
        self, 
        file: UploadFile, 
        student_id: str, 
        document_type: str
    ) -> str:
        """Save student document and return file path"""
        # Validate file
        allowed_types = [
            "application/pdf",
            "image/jpeg", 
            "image/png",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]
        self.validate_file(file, allowed_types)
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix
        unique_filename = f"{student_id}_{document_type}_{uuid.uuid4().hex[:8]}{file_extension}"
        
        # Create student directory
        student_dir = self.upload_dir / "student_documents" / student_id
        student_dir.mkdir(exist_ok=True)
        
        file_path = student_dir / unique_filename
        
        # Save file
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save file: {str(e)}"
            )
        
        return str(file_path)
    
    def get_student_documents(self, student_id: str) -> List[dict]:
        """Get list of documents for a student"""
        student_dir = self.upload_dir / "student_documents" / student_id
        
        if not student_dir.exists():
            return []
        
        documents = []
        for file_path in student_dir.iterdir():
            if file_path.is_file():
                documents.append({
                    "filename": file_path.name,
                    "path": str(file_path),
                    "size": file_path.stat().st_size,
                    "created": file_path.stat().st_ctime
                })
        
        return documents
    
    def delete_file(self, file_path: str) -> bool:
        """Delete a file"""
        try:
            Path(file_path).unlink()
            return True
        except Exception:
            return False
