from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import cache_page
from django.views.decorators.http import require_http_methods
from django.views.decorators.vary import vary_on_cookie
from django.contrib import messages
from django.utils import timezone
from datetime import timedelta
import logging

from .forms import RegisterForm, LoginForm
from .models import UserActivity

logger = logging.getLogger(__name__)


def get_theme_from_cookie(request):
    """Helper to get user's theme preference from cookie"""
    return request.COOKIES.get('theme', 'light')


def set_theme_cookie(response, theme):
    """Helper to set theme preference cookie (7 days expiry)"""
    response.set_cookie('theme', theme, max_age=7*24*60*60, samesite='Lax')
    return response


@cache_page(60)  # Cache for 60 seconds
@vary_on_cookie
def home(request):
    """Homepage - cached for performance"""
    theme = get_theme_from_cookie(request)
    context = {
        'theme': theme,
        'cached': True,  # Indicate page is cached
    }
    response = render(request, 'home.html', context)
    return response


@require_http_methods(["GET"])
def toggle_theme(request):
    """Toggle between light and dark theme.

    Using GET here avoids caching a stale CSRF token in the shared navbar.
    """
    current_theme = get_theme_from_cookie(request)
    new_theme = 'dark' if current_theme == 'light' else 'light'
    
    referer = request.META.get('HTTP_REFERER', '/')
    response = redirect(referer)
    response = set_theme_cookie(response, new_theme)
    
    logger.info(f"Theme changed to {new_theme}")
    return response


@require_http_methods(["GET", "POST"])
def register(request):
    """User registration"""
    theme = get_theme_from_cookie(request)
    
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            logger.info(f"New user registered: {user.username}")
            messages.success(request, 'Account created! You can now login.')
            return redirect('login')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
    else:
        form = RegisterForm()
    
    context = {
        'form': form,
        'theme': theme,
    }
    response = render(request, 'register.html', context)
    return response


@require_http_methods(["GET", "POST"])
def user_login(request):
    """User login with session tracking"""
    theme = get_theme_from_cookie(request)
    
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                # Store login time in session
                request.session['login_time'] = timezone.now().isoformat()
                
                # Log activity
                UserActivity.objects.create(user=user, activity_type='login')
                logger.info(f"User logged in: {username}")
                
                messages.success(request, f"Welcome back, {username}!")
                return redirect('dashboard')
            else:
                logger.warning(f"Failed login attempt for username: {username}")
                messages.error(request, 'Invalid username or password')
    else:
        form = LoginForm()
    
    context = {
        'form': form,
        'theme': theme,
    }
    response = render(request, 'login.html', context)
    return response


@login_required
def user_logout(request):
    """User logout"""
    username = request.user.username
    UserActivity.objects.create(user=request.user, activity_type='logout')
    logout(request)
    logger.info(f"User logged out: {username}")
    messages.success(request, 'You have been logged out.')
    return redirect('home')


@login_required
@cache_page(60)  # Cache dashboard for 60 seconds
@vary_on_cookie
def dashboard(request):
    """User dashboard - cached for performance"""
    theme = get_theme_from_cookie(request)
    user = request.user
    
    # Get login time from session
    login_time_str = request.session.get('login_time')
    login_time = None
    if login_time_str:
        from django.utils.dateparse import parse_datetime
        login_time = parse_datetime(login_time_str)
    
    # Get recent activities
    recent_activities = UserActivity.objects.filter(user=user)[:10]
    
    # Get last login from activities
    last_login = None
    if user.last_login:
        last_login = user.last_login
    
    context = {
        'theme': theme,
        'login_time': login_time,
        'last_login': last_login,
        'recent_activities': recent_activities,
        'cached': True,  # Indicate dashboard is cached
    }
    response = render(request, 'dashboard.html', context)
    return response
