"""
Root URL configuration for Freelance Marketplace Platform.
- API routes are in Backend/urls.py
- Frontend HTML pages are served directly by Django at /pages/<filename>
  so the browser never uses file:// (which blocks Fetch API calls).
"""
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ── API routes ───────────────────────────────────────────────────────────
    path('', include('Backend.urls')),

    # ── Frontend pages (served by Django so Fetch API works without CORS) ────
    path('app/',            TemplateView.as_view(template_name='index.html'),     name='home'),
    path('app/login/',      TemplateView.as_view(template_name='login.html'),     name='login'),
    path('app/register/',   TemplateView.as_view(template_name='register.html'),  name='register'),
    path('app/projects/',   TemplateView.as_view(template_name='projects.html'),  name='projects'),
    path('app/bids/',       TemplateView.as_view(template_name='bids.html'),      name='bids'),
    path('app/contracts/',  TemplateView.as_view(template_name='contracts.html'), name='contracts'),
    path('app/dashboard/',  TemplateView.as_view(template_name='dashboard.html'), name='dashboard'),
] + static('/static/', document_root=settings.BASE_DIR / 'Frontend')
