# Quick Start Guide

## 🚀 Start in 5 Minutes

### Prerequisites Check
```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check PHP
php --version

# Check MySQL is running (should see version info)
mysql --version
```

## Step 1: Setup Database (2 minutes)

### Using phpMyAdmin (Easiest)
1. Open `http://localhost/phpmyadmin`
2. Click "New" database
3. Name: `vit_result_portal`
4. Click "Create"
5. Go to "Import" tab
6. Select `database/schema.sql`
7. Click "Go"

### Or Use Command Line
```bash
mysql -u root -p < database/schema.sql
```
(Leave password blank if using XAMPP default)

## Step 2: Start Backend (1 minute)

```bash
cd backend
php -S localhost:8000
```

You should see:
```
Development Server running on http://localhost:8000
```

## Step 3: Start Frontend (1 minute)

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

You should see:
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:5173/
```

## Step 4: Open Browser (1 minute)

Click: `http://localhost:5173`

You should see the VIT Student Result Portal with 5 sample students!

---

## Testing the Features

### 1. View All Students
- Students are displayed in cards automatically

### 2. Edit Marks
- Click "Edit Marks" button on any student card
- Change the mark values
- Click "Save Marks"
- Changes update instantly

### 3. See Results
- Each student shows their result summary
- Check the Pass/Fail status for each subject
- View average marks and overall status

---

## Common Issues

### "Cannot connect to database"
```
✓ Make sure MySQL is running
✓ Check config.php has correct credentials
✓ Try: mysql -u root
```

### "API not responding"
```
✓ Make sure PHP server is running: php -S localhost:8000
✓ Check http://localhost:8000 in browser
✓ Look for port conflicts
```

### "npm packages missing"
```
cd frontend
npm install
npm run dev
```

### "Port 5173 already in use"
```
# Kill process using port 5173
# Or change port in vite.config.js
```

---

## Screenshots Explained

1. **App Header**: Shows title and description
2. **Student Cards**: Display student info and marks
3. **Edit Mode**: Change marks for subjects
4. **Result Summary**: Shows calculated totals and pass/fail status
5. **Color Coding**: Green = Pass, Red = Fail

---

## Next Steps

1. ✅ Run the application
2. ✅ Try editing student marks
3. ✅ Check the result calculations
4. ✅ Test on mobile view
5. ✅ Read full README.md for more details

Happy learning! 🎓
