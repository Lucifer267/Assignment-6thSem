# Troubleshooting Guide

## Table of Contents
1. [Database Issues](#database-issues)
2. [Backend Issues](#backend-issues)
3. [Frontend Issues](#frontend-issues)
4. [Network Issues](#network-issues)
5. [Performance Issues](#performance-issues)

---

## Database Issues

### Error: "Can't connect to MySQL server"

**Symptoms**:
- App shows "Error: Failed to fetch students"
- Error in browser console about database connection

**Causes**:
- MySQL not running
- Wrong credentials in config.php
- Database doesn't exist

**Solutions**:
```bash
# 1. Check MySQL is running (XAMPP)
# Open XAMPP Control Panel → Verify MySQL shows "Running"

# 2. Check credentials in backend/config.php
# Edit the file and verify:
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');  # Leave empty for XAMPP
define('DB_NAME', 'vit_result_portal');

# 3. Test connection manually
mysql -h localhost -u root -p
# Just press Enter if no password

# 4. Verify database exists
# In phpMyAdmin: Look for "vit_result_portal" database
```

### Error: "Students table not found"

**Symptoms**:
- "Error in fetching students" appears
- SQL error in browser console

**Solution**:
```bash
# Reinitialize database
cd backend
php init_db.php

# Or manually in phpMyAdmin
# 1. Select vit_result_portal database
# 2. Go to Import tab
# 3. Select database/schema.sql
# 4. Click Go
```

### Error: "Duplicate entry for roll_number"

**Symptoms**:
- Cannot add new student with certain roll number
- Error when updating marks

**Solution**:
```bash
# Check for duplicate in database
mysql -u root
use vit_result_portal;
SELECT * FROM students WHERE roll_number='REG001';

# If duplicate exists, delete old one
DELETE FROM students WHERE roll_number='REG001' LIMIT 1;
```

### Sample data not showing

**Symptoms**:
- Application loads but no students displayed
- Database connected successfully but empty

**Solution**:
```bash
# Insert sample data
cd backend
php -r "
\$conn = new mysqli('localhost', 'root', '');
\$conn->query('USE vit_result_portal');
\$sql = \"INSERT INTO students (roll_number, name, course, email, mse1, ese1, mse2, ese2, mse3, ese3, mse4, ese4) 
VALUES ('REG001', 'Test Student', 'B.Tech CSE', 'test@vit.ac.in', 25, 60, 28, 68, 26, 65, 29, 70)\";
if (\$conn->query(\$sql)) echo 'Data inserted successfully';
\$conn->close();
"
```

---

## Backend Issues

### Error: "Cannot POST /api/update_marks.php"

**Symptoms**:
- Clicking "Save Marks" doesn't work
- Console shows 404 error

**Causes**:
- Backend server not running
- Wrong API URL
- CORS issue

**Solutions**:
```bash
# 1. Check backend server is running
# Terminal should show: Development Server running at http://localhost:8000

# 2. Try accessing API directly
# Open browser: http://localhost:8000/api/get_students.php
# Should show JSON with students

# 3. Check frontend config
# In frontend/vite.config.js, verify:
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  }
}

# 4. Restart backend
# Stop: Ctrl+C in backend terminal
# Start: php -S localhost:8000
```

### Error: "API returns 500 Internal Server Error"

**Symptoms**:
- Operations fail silently
- Error in browser console

**Solution**:
```bash
# Check PHP error logs
# For XAMPP: C:\xampp\apache\logs\error.log
# Or enable display_errors in config.php (already enabled)

# Common causes:
# 1. Syntax error in PHP file
# 2. Missing required fields in request
# 3. Database connection lost

# Test specific endpoint:
curl http://localhost:8000/api/get_students.php
```

### Error: "mysqli extension not loaded"

**Symptoms**:
- Database connection fails
- Error: "Call to undefined function mysqli_connect()"

**Solutions**:
```bash
# For XAMPP - already included, just verify:
# 1. In XAMPP Control Panel, MySQL should say "Running"
# 2. Check C:\xampp\php\php.ini
#    Find: ;extension=mysqli
#    Remove the semicolon: extension=mysqli
#    Restart XAMPP

# Or reinstall XAMPP with MySQL selected
```

### Changes not saving to database

**Symptoms**:
- Marks update in UI but revert on page reload
- No database update

**Solution**:
```bash
# 1. Check CORS is enabled in config.php (already enabled)
# 2. Verify POST request is being sent:
#    - Open browser DevTools (F12)
#    - Go to Network tab
#    - Edit marks and save
#    - Look for update_marks.php request
#    - Check Response tab for error

# 3. Check request body is correct JSON
# Example correct format:
{
  "roll_number": "REG001",
  "marks": {
    "mse1": 28, "ese1": 65,
    "mse2": 30, "ese2": 68,
    "mse3": 25, "ese3": 62,
    "mse4": 29, "ese4": 70
  }
}
```

---

## Frontend Issues

### Error: "Cannot find module 'react'"

**Symptoms**:
- Dev server won't start
- Error: "Cannot find module react"

**Solution**:
```bash
cd frontend
rm -r node_modules
rm package-lock.json
npm install
npm run dev
```

### Error: "Port 5173 already in use"

**Symptoms**:
- Dev server won't start
- Error: "Port 5173 already in use"

**Windows Solutions**:
```bash
# Method 1: Use different port
# Edit vite.config.js
server: {
  port: 5174  # Change this
}

# Method 2: Kill process using port
# In PowerShell (Admin):
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

### App shows blank page

**Symptoms**:
- Page loads but shows nothing
- No errors in console

**Solutions**:
```javascript
// 1. Check main.jsx is correct
// Verify React is importing properly

// 2. Check App.jsx is loaded
// Add console log at top of App.jsx:
console.log('App component loaded')

// 3. Clear cache
// Ctrl+Shift+R in browser
// Or delete frontend/dist folder

// 4. Check for JS errors
// Open DevTools (F12)
// Go to Console tab
// Look for red errors
```

### Styles not applying

**Symptoms**:
- Page loads but looks broken
- No colors or layout

**Solutions**:
```bash
# 1. Restart dev server
# Ctrl+C in frontend terminal
npm run dev

# 2. Clear browser cache
# DevTools (F12) → Settings → Network → Disable cache
# Refresh page

# 3. Verify CSS files exist
# frontend/src/App.css
# frontend/src/components/Student.css
# frontend/src/components/Result.css
# frontend/src/styles.css

# 4. Check CSS for syntax errors
# Open CSS file and look for mismatched brackets { }
```

### No students showing on page

**Symptoms**:
- Page loads, header visible, but no student cards

**Solutions**:
```javascript
// 1. Check if backend API call succeeds
// Open browser DevTools (F12)
// Go to Network tab
// Look for get_students.php request
// Check if Status is 200 (success)

// 2. Check API response
// Click request → Response tab
// Should show JSON array of students

// 3. If no request, backend not configured
// Verify vite.config.js proxy settings
// Restart both servers

// 4. Test API directly
// Open: http://localhost:8000/api/get_students.php
// Should show student JSON data
```

### Edit Marks button doesn't work

**Symptoms**:
- Click "Edit Marks" nothing happens
- Or save button doesn't save

**Solutions**:
```javascript
// 1. Check for JavaScript errors
// DevTools → Console tab
// Look for red error messages

// 2. Verify onClick handlers are correct
// In Student.jsx:
// onClick={() => setIsEditing(true)}

// 3. Check input values are being captured
// Add console log:
const handleMarkChange = (e) => {
  console.log('Mark changed:', e.target.name, e.target.value)
  // ... rest of code
}

// 4. Verify backend connection
// Check Network tab when saving
// Should see POST to update_marks.php
```

---

## Network Issues

### Error: "Failed to fetch"

**Symptoms**:
- CORS error in console
- "Access to XMLHttpRequest blocked by CORS policy"

**Solutions**:
```bash
# Verify CORS headers in backend/config.php
# Should have:
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

# Check backend server running on correct port
# Should be: http://localhost:8000

# Verify frontend proxy config in vite.config.js
# Should redirect /api to http://localhost:8000
```

### Error: "Connection refused"

**Symptoms**:
- "ERR_CONNECTION_REFUSED" in console
- Cannot reach backend

**Solutions**:
```bash
# Check backend server is actually running
# Terminal should show:
Development Server running at http://localhost:8000

# If not running:
cd backend
php -S localhost:8000

# Test connection:
# Open browser: http://localhost:8000/api/get_students.php
# Should show JSON or error message (not "Connection refused")
```

---

## Performance Issues

### App is slow

**Symptoms**:
- Slow to load
- Slow to respond to clicks
- Slow to update marks

**Solutions**:
```javascript
// 1. Check network tab for slow requests
// DevTools (F12) → Network tab
// Reload page
// Look for requests taking >1 second
// Fix slow API endpoints

// 2. Check for unnecessary re-renders
// Add performance monitoring
console.time('Student component render')
// ... component code
console.timeEnd('Student component render')

// 3. Optimize bundle size
npm run build
# Check builddist/ folder size

// 4. Check database performance
// Verify indexes are set up:
mysql> SHOW INDEXES FROM students;
# Should have index on roll_number and course
```

### Browser uses lots of memory

**Symptoms**:
- "Out of memory" errors
- Browser becomes sluggish

**Solutions**:
```bash
# Clear browser cache
# DevTools → Settings → Network → Disable cache
# F5 to refresh

# Clear node_modules and reinstall
cd frontend
rm -r node_modules
npm install

# Restart dev server
npm run dev
```

---

## How to Report Bugs

When seeking help, provide:

1. **Error message** (exact text)
2. **What you were doing** (step by step)
3. **Screenshots** (if visual issue)
4. **Browser console errors** (F12 → Console)
5. **Network tab errors** (F12 → Network)
6. **PHP error logs** if backend issue
7. **Your environment**:
   - Windows/Mac/Linux
   - PHP version: `php --version`
   - Node version: `node --version`
   - MySQL version: `mysql --version`

---

## Debug Mode

Enable detailed logging:

**Backend (config.php)**:
```php
// Already enabled:
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

**Frontend (App.jsx)**:
```javascript
// Add this in useEffect
useEffect(() => {
  console.log('Fetching students...')
  fetchStudents()
}, [])

// Enable detailed logging in fetch
.then(res => {
  console.log('Response:', res)
  return res.json()
})
```

---

## Quick Checklist

- [ ] MySQL running in XAMPP
- [ ] Database `vit_result_portal` exists
- [ ] Backend running: `php -S localhost:8000`
- [ ] Frontend running: `npm run dev` at 5173
- [ ] Can access: `http://localhost:8000/api/get_students.php`
- [ ] Can access: `http://localhost:5173`
- [ ] At least 1 student showing
- [ ] Can click "Edit Marks"
- [ ] Can save marks without error
- [ ] Results update correctly

If all pass ✓, application is working!

---

For more help, check:
- README.md - Overview
- QUICKSTART.md - Get started fast
- COMPONENT_ARCHITECTURE.md - Code structure
- API_DOCUMENTATION.md - API details
- WINDOWS_INSTALLATION.md - Windows setup
