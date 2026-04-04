import redis as redis_lib
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.services import jwt_service
from src.config import settings

redis_client = redis_lib.from_url(settings.REDIS_URL, decode_responses = True)

_bearer = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(_bearer)) -> int:
    token = credentials.credentials

    if redis_client.exists(f"blacklist:{token}"):
        raise HTTPException(status_code=403, detail="Token blacklisted")

    decoded_token = jwt_service.verify_access_token(token)
    if not decoded_token:
        raise HTTPException(status_code=403, detail="Invalid token")

    return decoded_token["userId"]