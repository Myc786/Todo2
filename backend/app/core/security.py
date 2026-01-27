from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from app.core.config import settings
import hashlib
import secrets

# Secret key and algorithm for JWT
SECRET_KEY = settings.BETTER_AUTH_SECRET
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a hashed password."""
    # hashed_password format: algorithm$salt$hash
    if '$' not in hashed_password:
        return False

    parts = hashed_password.split('$')
    if len(parts) != 3:
        return False

    algorithm, salt, stored_hash = parts

    if algorithm != 'pbkdf2':
        return False

    # Hash the plain password with the same salt
    pwd_bytes = plain_password.encode('utf-8')
    salt_bytes = salt.encode('utf-8')

    # Use pbkdf2_hmac for hashing
    from hashlib import pbkdf2_hmac
    derived = pbkdf2_hmac('sha256', pwd_bytes, salt_bytes, 100000)
    computed_hash = derived.hex()

    # Compare hashes securely
    import hmac
    return hmac.compare_digest(computed_hash, stored_hash)

def get_password_hash(password: str) -> str:
    """Hash a plaintext password using PBKDF2."""
    # Generate a random salt
    salt = secrets.token_hex(32)

    # Hash the password
    pwd_bytes = password.encode('utf-8')
    salt_bytes = salt.encode('utf-8')

    from hashlib import pbkdf2_hmac
    derived = pbkdf2_hmac('sha256', pwd_bytes, salt_bytes, 100000)
    hash_hex = derived.hex()

    # Format: algorithm$salt$hash
    return f"pbkdf2${salt}${hash_hex}"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """Verify a JWT token and return the payload if valid."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None