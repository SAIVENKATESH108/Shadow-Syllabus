"""Production settings with strict security enforcement."""
from .base import *  # noqa: F403

DEBUG = False

# Enforce secure cookies and HTTPS redirection
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Reject default insecure SECRET_KEY in production
if SECRET_KEY.startswith("insecure-"):  # noqa: F405
    raise ValueError("CRITICAL SECURITY ERROR: Default insecure SECRET_KEY detected in production environment!")
