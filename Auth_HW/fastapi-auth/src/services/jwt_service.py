from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from src.config import settings

ALGORITHM = "HS256"

def _parse_duration(duration_str: str) -> timedelta:
    unit = duration_str[-1] #Lấy ra đơn vị ngày, giờ
    value = int(duration_str[:-1]) #con lai
    if unit == "m":
        return timedelta(minutes=value)
    elif unit == "h":
        return timedelta(hours=value)
    elif unit == "d":
        return timedelta(days=value)
    raise ValueError(f"Unrecognized duration format: {duration_str}")

def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + _parse_duration(settings.JWT_EXPIRED)
    payload = {"userId": user_id, "exp": expire}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=ALGORITHM) # Mã hoá

def create_refresh_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + _parse_duration(settings.JWT_REFRESH_EXPIRED)
    payload = {"userId": user_id, "exp": expire}
    return jwt.encode(payload, settings.JWT_REFRESH_SECRET, algorithm=ALGORITHM)

def verify_access_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
    except JWTError:
        return None

def verify_refresh_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.JWT_REFRESH_SECRET, algorithms=[ALGORITHM])
    except JWTError:
        return None

def decode_token_unverified(token: str) -> dict | None:
    return jwt.decode(
        token,
        settings.JWT_SECRET,
        algorithms=[ALGORITHM],
        options={"verify_signature": False},
    )