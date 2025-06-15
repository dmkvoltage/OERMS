from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Student, InstitutionalAdmin
from app.services.file_service import FileService
from app.core.auth import get_current_user, get_student, get_institutional_admin
from app.schemas import APIResponse

router = APIRouter()
file_service = FileService()

@router.post("/student-documents/{student_id}", response_model=APIResponse)
async def upload_student_documents(
    student_id: str,
    document_type: str,
    files: List[UploadFile] = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload student documents (birth certificate, transcripts, etc.)"""
    
    # Verify permissions
    if isinstance(current_user, Student):
        if str(current_user.student_id) != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Can only upload documents for yourself"
            )
    elif isinstance(current_user, InstitutionalAdmin):
        # Verify student belongs to admin's institution
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student or student.institution_name != current_user.institution_name:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Student not found in your institution"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions"
        )
    
    uploaded_files = []
    
    for file in files:
        try:
            file_path = file_service.save_student_document(
                file=file,
                student_id=student_id,
                document_type=document_type
            )
            uploaded_files.append({
                "filename": file.filename,
                "path": file_path,
                "type": document_type
            })
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload {file.filename}: {str(e)}"
            )
    
    return APIResponse(
        success=True,
        message=f"Successfully uploaded {len(uploaded_files)} documents",
        data={"uploaded_files": uploaded_files}
    )

@router.get("/student-documents/{student_id}")
async def get_student_documents(
    student_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get list of uploaded documents for a student"""
    
    # Verify permissions (same logic as upload)
    if isinstance(current_user, Student):
        if str(current_user.student_id) != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Can only view your own documents"
            )
    elif isinstance(current_user, InstitutionalAdmin):
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student or student.institution_name != current_user.institution_name:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Student not found in your institution"
            )
    
    documents = file_service.get_student_documents(student_id)
    
    return {
        "student_id": student_id,
        "documents": documents,
        "total_documents": len(documents)
    }

@router.delete("/documents/{file_path:path}", response_model=APIResponse)
async def delete_document(
    file_path: str,
    current_user = Depends(get_institutional_admin),  # Only admins can delete
    db: Session = Depends(get_db)
):
    """Delete a document file"""
    
    success = file_service.delete_file(file_path)
    
    if success:
        return APIResponse(
            success=True,
            message="Document deleted successfully"
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found or could not be deleted"
        )
