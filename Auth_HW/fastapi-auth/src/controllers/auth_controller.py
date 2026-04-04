from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from src.database import get_db
from src.services import auth_service
from src.models.user import User
from src.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])
_bearer = HTTPBearer()

class RegisterBody(BaseModel):
    email: EmailStr
    password: str

class LoginBody(BaseModel):
    email: EmailStr
    password: str

class RefreshTokenBody(BaseModel):
    refreshToken: str

#endpoint
@router.post("/register", status_code=201)
def register(body: RegisterBody, db: Session = Depends(get_db)):
    try:
        user = auth_service.register(body.email, body.password, db)
        return {
            "success": True,
            "message": "User created successfully",
            "data": user
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", status_code=200)
def login(body: LoginBody, db: Session = Depends(get_db)):
    try:
        tokens = auth_service.login(body.email, body.password, db)
        return {
            "success": True,
            "data": tokens
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/refresh-token", status_code=200)
def refresh_token(body: RefreshTokenBody, db: Session = Depends(get_db)):
    try:
        token = auth_service.refresh_token(body.refreshToken, db)
        return {
            "success": True,
            "data": token
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/profile", status_code=200)
def profile(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.id == user_id).first()
        return {
            "success": True,
            "data": user
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/logout", status_code=200)
def logout(
        credentials: HTTPAuthorizationCredentials = Depends(_bearer),
        user_id: int = Depends(get_current_user),
        db: Session = Depends(get_db)
):
        auth_service.logout(credentials.credentials, user_id, db)
        return {
            "success": True,
            "message": "User logged out"
        }

