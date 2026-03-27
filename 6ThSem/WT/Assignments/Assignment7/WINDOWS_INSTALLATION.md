# Installation Guide for Windows

## Prerequisites Installation

### 1. Install Node.js & npm

1. Go to: https://nodejs.org
2. Download LTS version (recommended)
3. Run installer and follow steps
4. Accept all defaults
5. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### 2. Install PHP

#### Option A: XAMPP (Easiest for Beginners)
1. Download from: https://www.apachefriends.org/
2. Choose Windows version
3. Run installer
4. Install in default location: `C:\xampp`
5. When asked, enable Apache and MySQL for startup
6. Complete installation

#### Option B: PHP Standalone
1. Download PHP x64 ZTS from: https://windows.php.net/download/
2. Extract to: `C:\php`
3. Add to PATH environment variable
4. Copy `php.ini-development` to `php.ini`
5. Enable MySQLi extension:
   - Open `php.ini`
   - Find `;extension=mysqli`
   - Remove the `;` at start
   - Save

### 3. Install MySQL

If using XAMPP, skip this step (MySQL is included).

Otherwise:
1. Download from: https://dev.mysql.com/downloads/installer/
2. Run installer
3. Choose "Server only"
4. Use defaults
5. Complete setup

### 4. Add PHP to PATH

#### For XAMPP Users:
1. Right-click "This PC" or "My Computer" → Properties
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", click "New"
5. Variable name: `PHP_HOME`
6. Variable value: `C:\xampp\php`
7. Click OK

#### For Standalone PHP:
1. Same as above but use `C:\php` as value

---

## Project Setup

### Step 1: Extract Project
```
Extract Assignment7 folder to desired location
Example: C:\Users\YourName\Desktop\Assignment7
```

### Step 2: Open Terminal/PowerShell

1. Right-click on Assignment7 folder
2. Select "Open PowerShell window here"

Or use:
```bash
cd C:\Users\YourName\Desktop\Assignment7
```

### Step 3: Setup Database

#### If Using XAMPP:
1. Open XAMPP Control Panel
2. Click "Start" next to Apache
3. Click "Start" next to MySQL
4. You should see "MySQL: Running" with green status

#### Import Database:
1. Open browser: `http://localhost/phpmyadmin`
2. On left side, click "New"
3. Name: `vit_result_portal`
4. Collation: utf8mb4_unicode_ci
5. Click "Create"
6. Go to "Import" tab
7. Browse to `Assignment7\database\schema.sql`
8. Click "Go"
9. You should see success message

#### Check Database:
```
In phpMyAdmin, click vit_result_portal database
You should see "students" table with 5 sample records
```

### Step 4: Start Backend

Open PowerShell in Assignment7 folder:

```powershell
cd backend
php -S localhost:8000
```

You should see:
```
Development Server running at http://localhost:8000
Press Ctrl-C to quit
```

**Keep this terminal open!**

### Step 5: Start Frontend

Open a **new** PowerShell window in Assignment7 folder:

```powershell
cd frontend
npm install
npm run dev
```

You should see:
```
Local: http://localhost:5173/

press h to show help
```

### Step 6: Open Application

1. Click the link: `http://localhost:5173`
2. Or type it in browser address bar
3. You should see VIT Student Result Portal page

---

## Verification Checklist

- [ ] XAMPP Control Panel shows Apache: Running
- [ ] XAMPP Control Panel shows MySQL: Running
- [ ] phpMyAdmin loads at `http://localhost/phpmyadmin`
- [ ] Database `vit_result_portal` exists
- [ ] Students table has 5 records
- [ ] Backend server running: `http://localhost:8000`
- [ ] Frontend dev server running: `http://localhost:5173`
- [ ] Application shows 5 student cards
- [ ] Can edit marks and save successfully

---

## Windows-Specific Commands

### Stopping Services

```powershell
# Stop backend server
# Press Ctrl+C in backend PowerShell window

# Stop XAMPP
# Click "Stop" buttons in XAMPP Control Panel

# Stop frontend dev server
# Press Ctrl+C in frontend terminal
```

### Running Services at Startup (XAMPP)

1. Open XAMPP Control Panel
2. Check boxes for "Apache" and "MySQL"
3. Click "Save"
4. Next time you start XAMPP, they'll auto-start

### PowerShell Issues

If you get "cannot be loaded because running scripts is disabled":

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Common Windows Issues & Solutions

### Issue: "php is not recognized"

**Solution**:
1. Make sure PHP is installed at `C:\xampp\php`
2. Add to PATH:
   - Search "Environment Variables" in Start Menu
   - Edit "Path" system variable
   - Add new: `C:\xampp\php`
   - Restart PowerShell

### Issue: "Port 8000 already in use"

**Solution 1**: Use different port
```powershell
cd backend
php -S localhost:8001
```
Then update frontend config.

**Solution 2**: Kill process using port
```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Issue: "Port 5173 already in use"

**Solution**: Kill the process
```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Issue: "Cannot connect to database"

**Solutions**:
1. Check MySQL is running in XAMPP
2. Database `vit_result_portal` exists in phpMyAdmin
3. Check config.php has correct credentials:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASSWORD', '');
   define('DB_NAME', 'vit_result_portal');
   ```

### Issue: "npm: command not found"

**Solution**:
1. Install Node.js from https://nodejs.org
2. Restart PowerShell after installation
3. Verify: `npm --version`

### Issue: "npm packages missing errors"

**Solution**:
```powershell
cd frontend
del node_modules
del package-lock.json
npm install
npm run dev
```

### Issue: "Access denied" errors

**Solution**: Run PowerShell as Administrator
1. Right-click PowerShell
2. Select "Run as Administrator"
3. Click "Yes"

---

## Development Workflow

### Normal Usage (Daily)

1. Open XAMPP Control Panel
2. Click "Start" next to Apache and MySQL
3. Open two PowerShell windows:

**Window 1 - Backend**:
```powershell
cd C:\path\to\Assignment7\backend
php -S localhost:8000
```

**Window 2 - Frontend**:
```powershell
cd C:\path\to\Assignment7\frontend
npm run dev
```

4. Open browser to `http://localhost:5173`

### When Done

1. Close both PowerShell windows (Ctrl+C)
2. Click "Stop" buttons in XAMPP Control Panel

---

## Testing the Application

### Test 1: View Students
- Page loads with 5 student cards
- Student names visible
- Marks displayed

### Test 2: Edit Marks
- Click "Edit Marks" button
- Change some values
- Click "Save Marks"
- Marks update without page reload

### Test 3: Pass/Fail Calculation
- Check Result Summary section
- Verify Pass/Fail status based on marks
- Green badge = Pass, Red badge = Fail

### Test 4: Responsive Design
- Resize browser window
- Layout should adapt
- Test on mobile view (F12 → Device toggle)

---

## Code Editing

### Recommended Editor: Visual Studio Code

1. Download: https://code.visualstudio.com
2. Open Assignment7 folder in VS Code
3. Install extensions:
   - "ES7+ React/Redux/React-Native snippets"
   - "PHP Intelephense"
   - "MySQL"

### Make Changes

Edit files and they auto-reload:
- Backend: Refresh browser (F5)
- Frontend: Auto-reloads on save

---

## Building for Production

When ready to deploy:

```powershell
# Backend - no build needed, just upload to server

# Frontend - build production files
cd frontend
npm run build
```

Files will be in `frontend/dist` folder for deployment.

---

## Need Help?

1. Check QUICKSTART.md for quick overview
2. Check API_DOCUMENTATION.md for API details
3. Check COMPONENT_ARCHITECTURE.md for code structure
4. Check README.md for complete documentation
5. Run individual PHP files in browser to test:
   - `http://localhost:8000/api/get_students.php`
   - Check browser console (F12) for errors

Enjoy! 🎉
