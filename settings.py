"""
Django settings for Freelance Marketplace Platform.
"""
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent

SECRET_KEY = 'django-insecure-freelance-marketplace-exam-secret-key-2024'

DEBUG = True

ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1']

INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.staticfiles',
    'Backend',
]

MIDDLEWARE = [
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'Frontend'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [],
        },
    },
]

WSGI_APPLICATION = 'wsgi.application'

# Database handled by PyMongo in Backend/db.py (MongoDB Atlas or localhost).
# Django ORM is not used; set DATABASES to empty to suppress Django warnings.
DATABASES = {}

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = False

STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'Frontend']

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
