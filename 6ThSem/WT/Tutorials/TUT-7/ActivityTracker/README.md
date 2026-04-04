# User Activity & Preference Tracker

A realistic Django college project demonstrating practical use of cookies, sessions, and caching. Built to look like actual student work - clean but not artificially polished.

## Quick Overview

This app lets users:
- **Toggle theme** (light/dark) using cookies - saved for 7 days
- **Register & log in** with Django's auth system
- **Track login time** in sessions and see it on the dashboard
- **Benefit from caching** (homepage and dashboard cached for 60 seconds)

## Setup & Run

### 1. Install Dependencies
```bash
pip install Django==4.2.0
```

### 2. Run Migrations
```bash
python manage.py migrate
```

### 3. Create a Superuser (Optional - for admin access)
```bash
python manage.py createsuperuser
```

### 4. Start the Server
```bash
python manage.py runserver
```

Visit: `http://127.0.0.1:8000/`

## Project Structure
```
ActivityTracker/
├── manage.py
├── requirements.txt
├── activity_tracker/          # Project settings
│   ├── __init__.py
│   ├── settings.py           # Django configuration
│   ├── urls.py              # Main URL routing
│   └── wsgi.py
├── tracker/                   # Main app
│   ├── __init__.py
│   ├── models.py            # UserActivity model
│   ├── views.py             # All views (cookies, auth, caching)
│   ├── urls.py              # App URL routing
│   ├── forms.py             # Login/Register forms
│   ├── admin.py             # Admin configuration
│   ├── apps.py
│   ├── templates/
│   │   ├── base.html        # Base template (dark/light toggle)
│   │   ├── home.html        # Homepage (cached)
│   │   ├── login.html       # Login page
│   │   ├── register.html    # Registration page
│   │   └── dashboard.html   # User dashboard (cached, shows login time)
│   └── static/css/
│       └── style.css        # Minimal styling
```

## How It Works

### 🍪 Cookies (Theme Preference)
- Helper function `get_theme_from_cookie()` reads the theme from cookies
- `set_theme_cookie()` sets a 7-day expiring cookie
- `/toggle-theme/` endpoint switches between light/dark
- Default theme is light if no cookie exists

### 🔐 Sessions (Auth + Login Tracking)
- Uses Django's built-in `User` model and auth system
- On login, we store `login_time` in the session
- `UserActivity` model logs every login/logout
- Dashboard displays login time retrieved from session
- Logout properly flushes the session

### ⚡ Caching (Performance)
- Homepage: `@cache_page(60)` decorator - cached for 60 seconds
- Dashboard: `@cache_page(60)` - cached for 60 seconds
- Cache backend: `LocMemCache` (in-memory)
- A small indicator shows when pages are cached
- Why? In real apps, caching helps with slow DB queries

### 📝 Logging
- Simple console logging using Python's `logging` module
- Logs user registrations, logins, logouts
- Logged to console (keep it simple, no file logging in this project)

## Manual Test Cases

### Test 1: Theme Toggle (Cookies)
1. Visit homepage (should be light theme by default)
2. Click "🌙 Dark" button in navbar
3. Verify page switches to dark background
4. Refresh page (should still be dark - cookie persisted)
5. Wait 7 days (jk, but cookie will expire then)
6. Toggle back to light - should work fine

**Expected:** Theme persists across page refreshes

---

### Test 2: User Registration
1. Click "Create Account"
2. Enter username: `testuser1`, password: `SecurePass123`
3. Click Register
4. Should see success message
5. Try registering with same username again
6. Should see error "Username already taken"

**Expected:** User created, duplicate prevention works

---

### Test 3: Login & Session Tracking
1. Register a new user: `student1` / `Password123`
2. Click Dashboard (should redirect to login - not authenticated)
3. Login with `student1` / `Password123`
4. Should see dashboard with "Logged in at: [timestamp]"
5. Refresh dashboard - login time should persist
6. Check "Your Recent Activity" - should show one login entry

**Expected:** Session persists, login time displayed, activity logged

---

### Test 4: Last Login Display
1. Login to an account
2. Note the "Last visit" timestamp on dashboard
3. Logout and login again (from home page)
4. Dashboard should show updated "Last visit" time

**Expected:** Django's `user.last_login` updates correctly

---

### Test 5: Cache Indicator
1. Visit homepage
2. Should see message: "This page is cached for 60 seconds"
3. Logout and login
4. Visit dashboard
5. Should also show cache message

**Expected:** Cache indicators appear. Try refreshing within 60s - data shouldn't change

---

### Test 6: Dark Theme + Session Combo
1. Register/login with dark theme enabled
2. Visit dashboard in dark mode
3. Logout
4. Theme should still be dark (cookie persists)
5. Login again - should remain dark

**Expected:** Cookies and sessions work independently - both should persist

---

## Edge Cases Handled

- ❌ **Invalid Login:** Shows error message, doesn't create session
- 👤 **Duplicate Username:** Catches during registration with validation
- 🍪 **Missing Cookie:** Defaults to light theme
- ⏰ **Session Expired:** Django handles automatically, redirects to login
- 🔄 **Session Flush on Logout:** `logout()` properly clears all session data

## Admin Access

1. Create superuser: `python manage.py createsuperuser`
2. Visit: `http://127.0.0.1:8000/admin/`
3. View `UserActivity` entries - all logins/logouts are tracked

## Key Files to Review

- **views.py** - Main logic, theme helpers, caching, auth decorators
- **settings.py** - Cache configuration, session settings
- **models.py** - Simple `UserActivity` model for tracking
- **forms.py** - Custom register form with validation
- **base.html** - Dynamic theme styling with CSS variables

## Why This Feels Real

- ✅ Not using fancy abstractions where simple logic works
- ✅ Comments are realistic (not over-explained)
- ✅ Uses Django's built-in features (no reinventing wheels)
- ✅ CSS stays minimal - just enough for functionality
- ✅ Error handling without being defensive
- ✅ Slight natural variation in code style

## Common Issues

**"Port 8000 already in use?"**
```bash
python manage.py runserver 8001
```

**"migrate not working?"**
Make sure you're in the project root where `manage.py` is located.

**"Templates not found?"**
The templates folder is at `tracker/templates/`. Make sure `INSTALLED_APPS` includes `'tracker'`.

---

This project is intentionally NOT a polished tutorial - it's built like a student would build it after understanding the concepts. Clean code, working features, realistic style.
