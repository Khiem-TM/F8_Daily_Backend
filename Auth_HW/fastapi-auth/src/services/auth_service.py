from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import redis as redis_lib

from src.models.user import User
from src.models.refresh_token import RefreshToken
from src.services import jwt_service
from src.config import settings

# quan ly thuan toan hash - use bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Tao 1 redis client dung chung
redis_client = redis_lib.from_url(settings.REDIS_URL, decode_responses=True)

def register(email: str, password: str, db: Session) -> User:
    if db.query(User).filter(User.email == email).first():
        raise Exception("Email already exists")

    #Hash password
    hashed_password = pwd_context.hash(password)
    user = User(email = email, password = hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def login(email: str, password: str, db: Session) -> dict:
    user = db.query(User).filter(User.email == email).first()
    if not user or not pwd_context.verify(password, user.password):
        raise Exception("Invalid email or password")

    access_token = jwt_service.create_access_token(user.id)
    refresh_token = jwt_service.create_refresh_token(user.id)

    #save token into DB
    expires_at = datetime.now(timezone.utc) + jwt_service._parse_duration(settings.JWT_REFRESH_EXPIRED)
    db.add(RefreshToken(
        token = refresh_token,
        expires_at = expires_at,
        user_id = user.id
    ))
    db.commit()

    return {"accessToken": access_token, "refreshToken": refresh_token}

def refresh_token(token: str, db: Session) -> dict:
    #verify signature
    decoded_token = jwt_service.verify_refresh_token(token)
    if not decoded_token:
        raise Exception("Invalid refresh token")

    #Check token invalid (DB)
    stored = db.query(RefreshToken).filter(RefreshToken.token == token).first()
    if not stored:
        raise Exception("Invalid refresh token")

    # double check expiry with DB
    if stored.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise Exception("Refresh token expired")

    # Lay id user tu token ma hoa
    user_id = decoded_token["userId"]

    #Rotation --> delete old token
    db.delete(stored)
    db.commit()

    # Create and save new couple token
    new_access_token = jwt_service.create_access_token(user_id)
    new_refresh_token = jwt_service.create_refresh_token(user_id)
    expires_at = datetime.now(timezone.utc) + jwt_service._parse_duration(settings.JWT_REFRESH_EXPIRED)

    db.add(RefreshToken(token = new_refresh_token, expires_at = expires_at, user_id = user_id))
    db.commit()

    return {"accessToken": new_access_token, "refreshToken": new_refresh_token}

def logout(token: str, user_id: int, db: Session) -> bool:
    payload = jwt_service.decode_token_unverified(token)
    exp = payload.get("exp")

    seconds_remaining = int(exp - datetime.now(timezone.utc).timestamp())
    seconds_remaining = max(1, seconds_remaining)

    redis_client.setex(f"blacklist:{token}", seconds_remaining, "1")

    db.query(RefreshToken).filter(RefreshToken.token == token).delete()
    db.commit()

    return True
