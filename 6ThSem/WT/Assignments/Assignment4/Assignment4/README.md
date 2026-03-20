# Form Processing & Session Management Assignment

## Project Overview
Complete web application demonstrating form processing, email validation, cookies, and session-based authentication.

---

## Features Implemented

### 1. ✓ HTML Form with Name, Email, Password
- **File**: `index.html`
- Multiple form fields with validation attributes
- Responsive design with CSS styling
- Client-side input constraints

### 2. ✓ Process Form Using GET and POST Methods
- **Files**: `process_form.php`, `method_demo.html`
- Both methods handled simultaneously
- Visual comparison of GET vs POST
- Data displayed based on submission method

### 3. ✓ Email Format Validation
- **File**: `process_form.php`
- Server-side validation using `filter_var()` with FILTER_VALIDATE_EMAIL
- Client-side HTML5 email input type
- Error messages for invalid formats

### 4. ✓ Cookie Storage for Username
- **File**: `process_form.php`
- Cookies created after successful registration
- 7-day expiration for user persistence
- Cookie display in session check page

### 5. ✓ Session-Based Login Example
- **Files**: `login.php`, `login_process.php`, `check_session.php`
- Server-side session management
- Protected pages requiring authentication
- Remember Me functionality (30-day cookie)
- Session timeout protection

---

## File Structure

```
Assignment4/
├── index.html              # Registration form page
├── login.php               # Login form page
├── method_demo.html        # GET vs POST demonstration
├── process_form.php        # Form processing & validation
├── login_process.php       # Session creation & authentication
├── check_session.php       # Protected session display page
├── logout.php              # Session destruction & logout
├── styles.css              # Complete styling
├── form_submissions.log    # Log file (auto-created)
└── login_activity.log      # Log file (auto-created)
```

---

## How to Use

### 1. Registration & Form Processing
1. Navigate to `index.html`
2. Fill in the Registration Form with:
   - Name (letters and spaces only)
   - Email (valid format required)
   - Password (min 6 chars, must include upper, lower, number)
3. Submit via POST method
4. System validates input and creates cookies

**Validation Rules:**
- Name: 3+ characters, letters and spaces only
- Email: Valid email format (RFC 5322 compliant)
- Password: 6+ characters with uppercase, lowercase, and numbers

### 2. GET vs POST Demonstration
1. Go to `method_demo.html`
2. Try submitting same data via both methods
3. Observe differences:
   - GET: Data visible in URL (query string)
   - POST: Data hidden in request body
   - Compare method advantages/disadvantages

### 3. Session-Based Login
1. Navigate to `login.php`
2. Use demo credentials:
   - Email: `john@example.com`
   - Password: `Password123`
3. Optional: Check "Remember Me" for 30-day cookie
4. Successful login creates session
5. Redirects to `check_session.php`

### 4. Session Information
1. Go to `check_session.php` (when logged in)
2. View:
   - User information
   - Session variables
   - Cookie data
   - Session duration
   - Server information

### 5. Logout
1. Click "Logout" button
2. Session is destroyed
3. Cookies are cleared
4. Redirect to login page

---

## Technical Details

### Form Validation (process_form.php)
```php
// Email validation
filter_var($email, FILTER_VALIDATE_EMAIL)

// Name validation
preg_match("/^[a-zA-Z\s]+$/", $name)

// Password strength
preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/", $password)
```

### Cookie Management
```php
// Create cookie (7 days)
setcookie("username", $name, time() + (7 * 24 * 60 * 60), "/");

// Clear cookie
setcookie("username", "", time() - 3600, "/");
```

### Session Management
```php
session_start();
$_SESSION['user_logged_in'] = true;
$_SESSION['user_email'] = $email;
$_SESSION['login_time'] = time();

// Destroy session
session_destroy();
```

---

## Test Cases

### Valid Registrations
| Name | Email | Password | Expected Result |
|------|-------|----------|-----------------|
| John Doe | john@example.com | Password123 | ✓ Success |
| Jane Smith | jane@example.com | SecurePass456 | ✓ Success |

### Invalid Formats
| Input | Issue | Expected Result |
|-------|-------|-----------------|
| John123 | Numbers in name | ✗ Rejected |
| john@invalid | No domain | ✗ Invalid email |
| Pass12 | Only 6 chars | ✓ Valid (minimum) |
| password | No uppercase/numbers | ✗ Weak password |

### Login Test
Use demo credentials:
- Email: `john@example.com`
- Password: `Password123`

---

## Key Concepts Demonstrated

### 1. Form Methods
- **GET**: Query string parameters, bookmarkable, limited data
- **POST**: Request body, private, suitable for sensitive data

### 2. Email Validation
- Pattern matching and format checking
- PHP `filter_var()` function
- HTML5 email input type

### 3. Cookies
- Creation with expiration
- Persistent storage on client side
- Clearing/deletion
- Remember Me functionality

### 4. Sessions
- Server-side storage
- Session variables
- Session ID management
- Auto-logout on browser close
- Optional: Persistent login

### 5. Security Features
- Input sanitization (trim, htmlspecialchars)
- Email format validation
- Password strength requirements
- Secure password handling (not stored in plain)
- XSS prevention through escaping

---

## HTTP Methods Comparison

| Feature | GET | POST |
|---------|-----|------|
| Data Location | URL Query String | Request Body |
| Visibility | Visible in URL | Hidden |
| Browser History | Saved | Not Saved |
| Bookmarkable | Yes | No |
| Data Size Limit | ~2KB | Unlimited |
| Security | Low | Moderate |
| Caching | Yes | No |
| Idempotent | Yes | No |
| Use Case | Search, Filter | Forms, Login |

---

## Log Files Generated

### form_submissions.log
```
2024-03-20 10:15:30 - Method: POST | Name: John Doe | Email: john@example.com | Message: N/A
2024-03-20 10:16:45 - Method: GET | Name: Jane Smith | Email: jane@example.com | Message: Test
```

### login_activity.log
```
2024-03-20 11:20:15 - User logged in: john@example.com | Session: abc123xyz789
2024-03-20 11:25:42 - User logged out: john@example.com | Session: abc123xyz789
```

---

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers supported

---

## Future Enhancements
- [ ] Database integration for permanent user storage
- [ ] Password hashing (bcrypt/Argon2)
- [ ] CSRF protection tokens
- [ ] Email verification for registration
- [ ] Two-factor authentication
- [ ] User profile management
- [ ] Remember Me database storage
- [ ] Session timeout configuration
- [ ] User activity logging
- [ ] Rate limiting for login attempts

---

## Author
Full Stack Web Development Assignment - Semester 6
Created: March 2024

---

## Notes
- All PHP files configured for development environment
- Suitable for learning purposes
- Implement additional security for production use
- Session path: Default PHP session directory
- Cookies: HTTP only for security (can be configured)
