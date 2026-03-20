# Assignment 5: Student Management System - Database Operations using PHP and MySQL

A complete web application demonstrating **CRUD operations** (Create, Read, Update, Delete) using PHP and MySQL with proper validation, security measures, and comprehensive documentation.

---

## 📋 Project Overview

This project implements:
- ✅ Create Database 'student_db'
- ✅ Create Table 'students(id, name, email, created_at, updated_at)'
- ✅ Connect PHP with MySQL using MySQLi (Object-Oriented)
- ✅ Insert Records into Table
- ✅ Display, Update, and Delete Records

---

## 🗂️ File Structure

```
Assignment5/
├── index.html              # Dashboard/Home page
├── add_student.php         # CREATE operation
├── view_students.php       # READ operation + DELETE
├── edit_student.php        # UPDATE operation
├── db_setup.php            # Database & table creation
├── database_setup.sql      # SQL script for database creation
├── documentation.html      # Complete documentation
├── config.php              # MySQLi connection (Main)
├── config_pdo.php          # PDO connection (Alternative)
├── styles.css              # All styling
└── README.md               # This file
```

---

## ⚙️ Prerequisites

Before you begin, ensure you have:
- **XAMPP** installed (includes Apache, PHP 7.0+, MySQL 5.7+)
- **Web browser** (Chrome, Firefox, Edge, etc.)
- **Text editor** (VS Code recommended)

---

## 🚀 Setup Instructions - Method 1: Using phpMyAdmin (Recommended)

### Step 1: Start XAMPP Services

1. Open **XAMPP Control Panel**
2. Click **"Start"** next to **Apache** → Wait for "Running" status
3. Click **"Start"** next to **MySQL** → Wait for "Running" status

### Step 2: Create Database Using phpMyAdmin

1. **Open phpMyAdmin:**
   - Go to your web browser
   - Navigate to: `http://localhost/phpmyadmin`
   - You should see the phpMyAdmin dashboard

2. **Create New Database:**
   - Click **"New"** button in the left sidebar
   - Enter database name: `student_db`
   - Click the **"Create"** button

3. **Import Database Schema:**
   - Click on `student_db` database in the left sidebar to select it
   - Click the **"Import"** tab at the top of the page
   - Click the **"Choose File"** button
   - Select `database_setup.sql` from your Assignment5 folder
   - Click the **"Import"** button at the bottom
   - Wait for success message

4. **Verify Database Creation:**
   - Click on `student_db` in the left sidebar
   - You should see the `students` table listed
   - Click on `students` to view the table structure and sample data

---

## ▶️ How to Run the Application

### Method A: Using PHP Built-in Server (Recommended for Development)

1. **Open PowerShell or Command Prompt**

2. **Navigate to Assignment5 directory:**
   ```powershell
   cd D:\6ThSem\6ThSem\WT\Assignments\Assignment5
   ```

3. **Start the PHP Development Server:**
   ```powershell
   C:\xampp\php\php.exe -S localhost:8000
   ```

4. **Access the Application:**
   - Open your web browser
   - Go to: `http://localhost:8000`
   - You should see the Student Management System homepage

5. **Stop the Server:**
   - Press `Ctrl + C` in the terminal

### Method B: Using XAMPP Apache Server

1. **Copy project to XAMPP:**
   - Place the Assignment5 folder in `C:\xampp\htdocs`
   - Or rename it to a memorable name like `StudentApp`

2. **Start Apache in XAMPP Control Panel:**
   - Click "Start" next to Apache

3. **Access the Application:**
   - Go to: `http://localhost/Assignment5` (or your folder name)

---

## 💾 Database Configuration

The application uses these default settings from `config.php`:

```php
define('DB_SERVER', 'localhost');  // MySQL server
define('DB_USER', 'root');         // Default XAMPP user
define('DB_PASSWORD', '');         // No password (default XAMPP)
define('DB_NAME', 'student_db');   // Database name
```

**If you have custom MySQL credentials, update them in `config.php`**

---

## ✨ Application Features

### 1. Add Student (CREATE)
- **File:** `add_student.php`
- Form with validation for name and email
- Auto-generated Student ID
- Success confirmation with new ID

### 2. View Students (READ)
- **File:** `view_students.php`
- Display all students in a table
- Shows: ID, Name, Email, Created Date, Last Updated
- Shows total number of records

### 3. Edit Student (UPDATE)
- **File:** `edit_student.php`
- Pre-populated form with current student data
- Modify name and/or email
- Validation before updating
- Success confirmation

### 4. Delete Student (DELETE)
- Delete with confirmation dialog
- Remove student record from database
- Error handling for non-existent records

---

## �️ Database Schema

### Table: students

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| **id** | INT | PRIMARY KEY, AUTO_INCREMENT | Unique student ID |
| **name** | VARCHAR(100) | NOT NULL | Student's full name |
| **email** | VARCHAR(100) | UNIQUE, NOT NULL | Student's email address |
| **created_at** | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |
| **updated_at** | TIMESTAMP | AUTO UPDATE | Last modified date |

### SQL Create Statement:
```sql
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 📊 Sample Data

The database includes 5 pre-inserted test records:

| ID | Name | Email | Purpose |
|----|------|-------|---------|
| 1 | John Doe | john@example.com | Sample data |
| 2 | Jane Smith | jane@example.com | Sample data |
| 3 | Robert Johnson | robert@example.com | Sample data |
| 4 | Maria Garcia | maria@example.com | Sample data |
| 5 | James Wilson | james@example.com | Sample data |

---

## 🔐 Security Features

### 1. Prepared Statements
Prevents SQL injection by separating SQL from data:
```php
// SAFE - Using prepared statements
$stmt = $conn->prepare("INSERT INTO students (name, email) VALUES (?, ?)");
$stmt->bind_param("ss", $name, $email);
$stmt->execute();

// UNSAFE - Direct query (vulnerable)
$sql = "INSERT INTO students VALUES ('$name', '$email')";
```

### 2. Input Validation
- **Name:** Length check, alphanumeric validation
- **Email:** `filter_var()` with FILTER_VALIDATE_EMAIL
- **ID:** Integer type conversion

### 3. Output Escaping
Prevents XSS (Cross-Site Scripting) attacks:
```php
<?php echo htmlspecialchars($student['name'], ENT_QUOTES, 'UTF-8'); ?>
```

### 4. Confirmation Dialogs
Prevents accidental deletion:
```html
<a href="..." onclick="return confirm('Are you sure you want to delete this student?');">Delete</a>
```

### 5. Error Handling
- Try-catch blocks for exceptions
- User-friendly error messages
- Error logging for debugging

---

## 🛠️ Troubleshooting

### ❌ Error: "Unknown database 'student_db'"
**Cause:** Database hasn't been created yet

**Solution:**
1. Follow Step 2 in Setup Instructions to create the database via phpMyAdmin
2. Ensure you imported the `database_setup.sql` file

### ❌ Error: "Connection refused" or "Access denied"
**Cause:** MySQL is not running or wrong credentials

**Solution:**
1. Check if MySQL is running in XAMPP Control Panel (should show "Running")
2. Verify database credentials in `config.php`
3. Restart MySQL if needed

### ❌ Error: "PHP command not found"
**Cause:** PHP is not in system PATH

**Solution:**
- Use full path to PHP: `C:\xampp\php\php.exe -S localhost:8000`
- Or add XAMPP PHP to system PATH

### ❌ Error: "Port 8000 already in use"
**Cause:** Another application is using port 8000

**Solution:**
- Use a different port: `C:\xampp\php\php.exe -S localhost:9000`
- Then access at: `http://localhost:9000`

### ❌ Error: "Unable to delete student" or operations fail
**Cause:** Database connection not established

**Solution:**
1. Ensure MySQL is running
2. Check `config.php` has correct credentials
3. Verify database and table exist in phpMyAdmin

### ❌ Page shows "Error connecting to database"
**Cause:** config.php connection error

**Solution:**
1. Open phpMyAdmin at `http://localhost/phpmyadmin`
2. Check if MySQL is running (should see "Database server" info at bottom)
3. Verify database `student_db` exists
4. Verify table `students` exists and has correct structure

---

## 📝 Code Examples

### Example 1: INSERT (Add Student) - MySQLi
**File:** `add_student.php`

```php
<?php
require_once('config.php');

$name = $_POST['name'];
$email = $_POST['email'];

// Validate input
if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Invalid input");
}

// Prepare and execute
$stmt = $conn->prepare("INSERT INTO students (name, email) VALUES (?, ?)");
$stmt->bind_param("ss", $name, $email);

if ($stmt->execute()) {
    $new_id = $stmt->insert_id;
    echo "Student added successfully! ID: " . $new_id;
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
?>
```

### Example 2: SELECT (View Students) - MySQLi
**File:** `view_students.php`

```php
<?php
require_once('config.php');

$result = $conn->query("SELECT id, name, email, created_at FROM students ORDER BY id DESC");

if ($result->num_rows > 0) {
    echo "<table>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row["id"] . "</td>";
        echo "<td>" . htmlspecialchars($row["name"]) . "</td>";
        echo "<td>" . $row["email"] . "</td>";
        echo "<td>" . $row["created_at"] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "No students found";
}
?>
```

### Example 3: UPDATE (Edit Student) - MySQLi
**File:** `edit_student.php`

```php
<?php
require_once('config.php');

$id = $_POST['id'];
$name = $_POST['name'];
$email = $_POST['email'];

// Validate
if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Invalid input");
}

$stmt = $conn->prepare("UPDATE students SET name = ?, email = ? WHERE id = ?");
$stmt->bind_param("ssi", $name, $email, $id);

if ($stmt->execute()) {
    echo "Student updated successfully";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
?>
```

### Example 4: DELETE (Remove Student) - MySQLi
**File:** `view_students.php`

```php
<?php
require_once('config.php');

if (isset($_GET['action']) && $_GET['action'] == 'delete') {
    $id = intval($_GET['id']);
    
    $stmt = $conn->prepare("DELETE FROM students WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo "Student deleted successfully";
    } else {
        echo "Error: " . $stmt->error;
    }
    
    $stmt->close();
}
?>
```

---

## 🔄 MySQLi vs PDO vs Procedural

### Method 1: MySQLi (Object-Oriented) - **USED IN THIS PROJECT**

```php
$conn = new mysqli('localhost', 'root', '', 'student_db');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("SELECT * FROM students");
$row = $result->fetch_assoc();
$conn->close();
```

**Advantages:**
- ✅ Object-oriented approach
- ✅ Supports prepared statements
- ✅ Better security
- ✅ More control over operations

---

### Method 2: MySQLi (Procedural)

```php
$conn = mysqli_connect('localhost', 'root', '', 'student_db');
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$result = mysqli_query($conn, "SELECT * FROM students");
mysqli_close($conn);
```

---

### Method 3: PDO (Alternative)

```php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=student_db', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("SELECT * FROM students WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
} catch(PDOException $e) {
    die("Connection Error: " . $e->getMessage());
}
```

**Advantages:**
- Works with multiple database systems
- Similar syntax across databases
- Exception-based error handling

---

## 📚 Working with the Application

### Adding a Student:
1. Go to home page
2. Click **"Add New Student"**
3. Fill in Name and Email
4. Click **"Add Student"**
5. You'll see confirmation with new Student ID

### Viewing Students:
1. From home page, click **"View Students"**
2. See all students in table format
3. Each row shows: ID, Name, Email, Created Date, Last Updated

### Editing a Student:
1. From "View Students" page, click **"Edit"** button for a student
2. Modify the Name and/or Email
3. Click **"Update"** button
4. Confirm the update

### Deleting a Student:
1. From "View Students" page, click **"Delete"** button
2. Confirm deletion in the popup
3. Student record will be removed from database

---

## 📞 Need Help?

- Check the **Troubleshooting** section above
- Ensure MySQL is running in XAMPP
- Verify database `student_db` exists in phpMyAdmin
- Check `config.php` has correct database credentials
- Review `documentation.html` for additional details

---

## �📚 Features & Operations

### 1. CREATE (Insert)
**File:** `add_student.php`

```php
$stmt = $conn->prepare("INSERT INTO students (name, email) VALUES (?, ?)");
$stmt->bind_param("ss", $name, $email);
$stmt->execute();
$new_id = $stmt->insert_id;
```

**Features:**
- Form validation (name, email)
- Prepared statement (prevents SQL injection)
- Auto-generated ID
- Success confirmation with new ID

---

### 2. READ (Select)
**File:** `view_students.php`

```php
$result = $conn->query("SELECT id, name, email, created_at, updated_at FROM students ORDER BY id DESC");
while ($row = $result->fetch_assoc()) {
    // Display record
}
```

**Features:**
- Display all records in table format
- Show creation/update timestamps
- Record count
- Action buttons for Edit/Delete

---

### 3. UPDATE (Modify)
**File:** `edit_student.php`

```php
$stmt = $conn->prepare("UPDATE students SET name = ?, email = ? WHERE id = ?");
$stmt->bind_param("ssi", $name, $email, $id);
$stmt->execute();
```

**Features:**
- Pre-populate form with current data
- Validate input before updating
- Prepared statement for security
- Success confirmation

---

### 4. DELETE (Remove)
**File:** `view_students.php`

```php
$stmt = $conn->prepare("DELETE FROM students WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
```

**Features:**
- Delete with confirmation dialog
- Check affected rows
- Error handling for non-existent records

---

## 🗄️ Database Schema

### Table: students

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| **id** | INT | PRIMARY KEY, AUTO_INCREMENT | Unique student ID |
| **name** | VARCHAR(100) | NOT NULL | Student's full name |
| **email** | VARCHAR(100) | UNIQUE, NOT NULL | Student's email |
| **created_at** | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| **updated_at** | TIMESTAMP | AUTO UPDATE | Last modified date |

### SQL Create Statement:
```sql
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🔐 Security Features

### 1. Prepared Statements
Prevents SQL injection by separating SQL from data:
```php
// SAFE
$stmt = $conn->prepare("INSERT INTO students (name, email) VALUES (?, ?)");

// UNSAFE (vulnerable)
$sql = "INSERT INTO students VALUES ('$name', '$email')";
```

### 2. Input Validation
- **Name:** Length check, allow only letters/spaces
- **Email:** `filter_var()` with FILTER_VALIDATE_EMAIL
- **ID:** Integer conversion

### 3. Output Escaping
Prevents XSS attacks:
```php
<?php echo htmlspecialchars($student['name']); ?>
```

### 4. Confirmation Dialogs
Prevent accidental deletion:
```html
<a href="..." onclick="return confirm('Are you sure?');">Delete</a>
```

---

## 📊 Sample Data

Default test records:

| ID | Name | Email | Purpose |
|----|------|-------|---------|
| 1 | John Doe | john@example.com | Testing |
| 2 | Jane Smith | jane@example.com | Testing |
| 3 | Robert Johnson | robert@example.com | Testing |
| 4 | Maria Garcia | maria@example.com | Testing |
| 5 | James Wilson | james@example.com | Testing |

---

## 🔄 Connection Methods

### Method 1: MySQLi (Object-Oriented) - **USED IN THIS PROJECT**

```php
$conn = new mysqli('localhost', 'root', '', 'student_db');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Use connection
$result = $conn->query("SELECT * FROM students");
$row = $result->fetch_assoc();

$conn->close();
```

**Advantages:**
- Object-oriented approach
- Supports prepared statements
- Better security
- More control over operations

---

### Method 2: MySQLi (Procedural)

```php
$conn = mysqli_connect('localhost', 'root', '', 'student_db');
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$result = mysqli_query($conn, "SELECT * FROM students");
mysqli_close($conn);
```

---

### Method 3: PDO (Alternative)

```php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=student_db', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection Error: " . $e->getMessage());
}

$stmt = $pdo->prepare("SELECT * FROM students WHERE id = ?");
$stmt->execute([$id]);
$row = $stmt->fetch();
```

**Advantages:**
- Works with multiple database systems
- Similar syntax across databases
- Exception-based error handling

---

## 🧪 Test Cases

### Add Student
```
Name: John Doe
Email: john123@example.com
Expected: Record created with ID
```

### View All
```
Expected: All records displayed in table with Edit/Delete buttons
```

### Edit Student
```
Original: Name: John, Email: john@example.com
New: Name: Jonathan, Email: jonathan@example.com
Expected: Record updated, timestamp changed
```

### Delete Student
```
Action: Click Delete
Expected: Confirmation dialog, record removed
```

---

## 📝 Validation Rules

### Name Field
- ✓ 3-100 characters
- ✓ Letters and spaces only
- ✗ Numbers not allowed
- ✗ Less than 3 characters

### Email Field
- ✓ Valid email format (RFC 5322)
- ✓ Must be unique (no duplicates)
- ✗ Invalid format
- ✗ Duplicate email

### ID Field
- ✓ Auto-generated (user cannot set)
- ✓ Primary key, auto-increment
- ✓ Integer values only

---

## 🛠️ Troubleshooting

**Error: Connection failed**
- Check MySQL is running
- Verify credentials in config.php
- Ensure database exists

**Error: Table not found**
- Run Database Setup page
- Click "Create Database & Table"
- Wait for success message

**Error: Duplicate entry**
- Email already exists
- Use different email address
- Check existing records in View Students

**Error: No records found**
- Insert sample data from Database Setup
- Or manually add records

---

## 📖 Documentation

For complete documentation, visit:
- **In-app:** `documentation.html` page
- **Covers:**
  - Installation steps
  - Database structure
  - CRUD operations with SQL
  - Connection methods
  - Security features
  - File structure
  - FAQ

---

## 🔄 CRUD Operation Flow

```
┌─────────────────────────────────────────┐
│      Student Management System          │
├─────────────────────────────────────────┤
│                                         │
│  CREATE (add_student.php)               │
│    Form → Validate → Insert → ID       │
│                                         │
│  READ (view_students.php)               │
│    List All → Table Display             │
│                                         │
│  UPDATE (edit_student.php)              │
│    Fetch → Form → Validate → Update    │
│                                         │
│  DELETE (view_students.php?)            │
│    Confirm → Delete → Verify           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 💾 Database Backup

### Export Database:
```bash
mysqldump -u root student_db > student_db_backup.sql
```

### Import Database:
```bash
mysql -u root < student_db_backup.sql
```

---

## 🎯 Learning Outcomes

This project demonstrates:
- ✓ Database creation and management
- ✓ PHP-MySQL connectivity
- ✓ CRUD operations (Create, Read, Update, Delete)
- ✓ Prepared statements for security
- ✓ Input validation and error handling
- ✓ HTML form processing
- ✓ Response handling and user feedback
- ✓ Responsive web design
- ✓ Database schema design
- ✓ Best practices in web development

---

## 🔗 Related Topics

- SQL: INSERT, SELECT, UPDATE, DELETE
- PHP: MySQLi, PDO, Form handling
- Database Design: Normalization, Keys
- Web Security: SQL Injection, XSS prevention
- HTTP: GET, POST, Form submission
- HTML/CSS: Responsive forms and tables

---

## 📝 Notes

- All passwords stored as plain text for demo (use hashing in production)
- Database auto-creates if it doesn't exist
- Sample data includes 5 test records
- Timestamps auto-update on modification
- Email field enforces uniqueness

---

## © License

**Educational Assignment - Semester 6**
Student Management System | Database Operations
Created: March 2024

---

## 👨‍💻 Author

**Full Stack Web Development Student**
Assignment 5: Database Operations using PHP and MySQL

---

## ❓ FAQ

**Q: Can I add more fields to the students table?**
A: Yes, use ALTER TABLE command or recreate the table.

**Q: How do I change the database name?**
A: Edit DB_NAME in config.php and re-run database setup.

**Q: Can I use PostgreSQL instead?**
A: Yes, switch to PDO method and update connection string.

**Q: Is the password security sufficient?**
A: No, this is for learning. Use bcrypt/Argon2 in production.

**Q: How is the email uniqueness enforced?**
A: Via UNIQUE constraint on email column in database.

---

**Last Updated:** March 2024
**Version:** 1.0
**Status:** Complete ✓
