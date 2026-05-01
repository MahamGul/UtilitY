"""
Utility functions for the backend.
Contains helper functions for password hashing, ObjectId serialization, etc.
"""
from passlib.context import CryptContext
from bson import ObjectId
from datetime import datetime

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def get_object_id(id_str: str) -> ObjectId:
    """Convert a string to ObjectId, returns None if invalid."""
    try:
        return ObjectId(id_str)
    except Exception:
        return None


def serialize_doc(doc: dict) -> dict:
    """Convert a MongoDB document to JSON-serializable format."""
    if doc is None:
        return None
    
    result = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        elif isinstance(value, dict):
            result[key] = serialize_doc(value)
        elif isinstance(value, list):
            result[key] = [
                serialize_doc(item) if isinstance(item, dict) else
                str(item) if isinstance(item, ObjectId) else item
                for item in value
            ]
        else:
            result[key] = value
    
    return result


def get_current_timestamp() -> str:
    """Get current timestamp in ISO format."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def create_response(status: str = "success", message: str = "", data: dict = None) -> dict:
    """Create a standardized API response."""
    response = {
        "status": status,
        "message": message
    }
    if data is not None:
        response.update(data)
    return response
