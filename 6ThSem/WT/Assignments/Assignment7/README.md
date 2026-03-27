# VIT Student Result Portal - Complete Setup Guide

## Project Overview
A responsive web application built with React, PHP, and MySQL for managing VIT student semester results. The system displays marks for 4 subjects with MSE (30%) and ESE (70%) weightages, and dynamically calculates pass/fail status.

## Architecture

### Frontend (React)
- **App Component (Parent)**: Main container managing student data
- **Student Component (Child)**: Displays individual student information and allows editing marks
- **Result Component (Child)**: Calculates and displays results with Pass/Fail status

### Backend (PHP)
- RESTful API endpoints for CRUD operations
- MySQL database integration
- CORS enabled for cross-origin requests

### Database (MySQL)
- Students table with 4 subjects (8 mark fields for MSE and ESE)
- Timestamps for tracking changes

## Prerequisites

1. **Node.js** and **npm** installed
2. **PHP 7.4+** with MySQLi extension
3. **MySQL Server** running
4. **XAMPP** or similar local server (optional, for easy setup)

## Installation Steps

### Step 1: Setup Database

#### Option A: Using MySQL Command Line
```bash
mysql -u root -p < database/schema.sql
```

#### Option B: Using phpMyAdmin
1. Open phpMyAdmin (usually at http://localhost/phpmyadmin)
2. Click "New" to create a new database
3. Name it `vit_result_portal`
4. Go to "Import" tab
5. Select `database/schema.sql` and click "Go"

#### Option C: Using PHP Script
```bash
cd backend
php init_db.php
```

### Step 2: Start PHP Backend

#### Using Built-in PHP Server
```bash
cd backend
php -S localhost:8000
```

#### Using XAMPP
1. Place the `backend` folder in `htdocs/vit_result_portal`
2. Start Apache and MySQL from XAMPP Control Panel
3. Access API at: `http://localhost/vit_result_portal/backend/api/`

### Step 3: Start React Frontend

```bash
cd frontend
npm install
npm run dev
```

The application will be available at: `http://localhost:5173`

## Project Structure

```
Assignment7/
├── frontend/                 # React Application
│   ├── src/
│   │   ├── main.jsx         # Entry point
│   │   ├── App.jsx          # Parent component
│   │   ├── App.css
│   │   ├── components/
│   │   │   ├── Student.jsx  # Child component
│   │   │   ├── Student.css
│   │   │   ├── Result.jsx   # Child component
│   │   │   └── Result.css
│   │   └── styles.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                  # PHP API Server
│   ├── config.php           # Database configuration
│   ├── init_db.php          # Database initialization
│   └── api/
│       ├── get_students.php    # Fetch all students
│       ├── get_student.php     # Fetch single student
│       ├── add_student.php     # Add new student
│       ├── update_marks.php    # Update student marks
│       └── delete_student.php  # Delete student
│
└── database/
    ├── schema.sql           # Database schema
    └── README.md
```

## Task Completion

### ✅ Task 1: Create Multiple Components
- **App Component (Parent)**: Manages student data and passes via props
- **Student Component (Child)**: Displays student info and marks
- **Result Component (Child)**: Shows calculated results and pass/fail status

### ✅ Task 2: Props Data Flow
- App → Student: `studentData` (roll_number, name, course, mse1, ese1, etc.)
- Student → Result: `marks` and `subjects` arrays
- Props: roll_number, name, course, MSE and ESE marks for 4 subjects

### ✅ Task 3: State Management with useState()
- Student component uses `useState()` for managing marks
- Marks can be edited through the edit interface
- Real-time updates to the UI

### ✅ Task 4: Dynamic UI Updates
- Pass/Fail status calculated dynamically based on total marks
- Calculation: Total = (MSE × 0.30) + (ESE × 0.70)
- Pass: Total ≥ 40, Fail: Total < 40
- Visual indicators with color coding (Green for Pass, Red for Fail)

## Subjects

1. **Data Structures** - MSE: 0-30, ESE: 0-70
2. **Web Technologies** - MSE: 0-30, ESE: 0-70
3. **Database Management** - MSE: 0-30, ESE: 0-70
4. **Algorithms** - MSE: 0-30, ESE: 0-70

## Features

- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Student data management
- ✅ Mark entry and editing
- ✅ Dynamic Pass/Fail calculation
- ✅ Beautiful UI with gradient backgrounds
- ✅ Error handling
- ✅ CORS enabled API
- ✅ Modern React hooks (useState)
- ✅ RESTful PHP API
- ✅ MySQL database integration

## API Endpoints

### GET /api/get_students.php
- Fetches all students with their marks
- Response: Array of student objects

### GET /api/get_student.php?roll_number=REG001
- Fetches a single student by roll number
- Response: Single student object

### POST /api/add_student.php
- Adds a new student
- Body: `{roll_number, name, course, email}`

### POST /api/update_marks.php
- Updates student marks
- Body: `{roll_number, marks: {mse1, ese1, mse2, ese2, mse3, ese3, mse4, ese4}}`

### POST /api/delete_student.php
- Deletes a student
- Body: `{roll_number}`

## Configuration

### Database Configuration
Edit `backend/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');  // Your MySQL password
define('DB_NAME', 'vit_result_portal');
```

### React API Configuration
Edit `frontend/vite.config.js` to change the backend API URL if needed.

## Responsive Design

- **Desktop**: Multi-column grid layout
- **Tablet**: 2-column grid
- **Mobile**: Single column layout
- All components optimize for smaller screens

## Styling

- Modern gradient backgrounds
- Smooth animations and transitions
- Color-coded status indicators
- Accessible color schemes
- Mobile-first responsive design

## Sample Data

The database comes pre-populated with 5 sample students:
- Aman Kumar (REG001)
- Priya Singh (REG002)
- Rohit Patel (REG003)
- Divya Sharma (REG004)
- Arjun Verma (REG005)

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check DB_HOST, DB_USER, DB_PASSWORD in config.php
- Ensure `vit_result_portal` database exists

### CORS Error
- Verify PHP server is running on localhost:8000
- Check CORS headers are enabled in config.php

### React App Not Loading
- Ensure Node.js and npm are installed
- Run `npm install` in frontend folder
- Check port 5173 is available

### No Students Displaying
- Run `php backend/init_db.php` to initialize database
- Verify database has data: `SELECT * FROM students;` in phpMyAdmin

## Development Tips

1. Use React Developer Tools extension for debugging
2. Check browser console for API errors
3. Use browser DevTools Network tab to monitor API calls
4. Check PHP error logs if API returns 500 errors

## Future Enhancements

- Authentication (Login/Signup)
- Export results as PDF
- Statistics and analytics dashboard
- Subject-wise performance graphs
- Email notifications
- File upload for bulk student data

---

**Assignment By**: VIT Web Technologies Course
**Created**: 2024
