<?php
/**
 * Database Setup Page
 * Create database and tables
 */

header('Content-Type: text/html; charset=UTF-8');

$message = '';
$message_type = '';
$db_created = false;
$table_created = false;

// Connect to MySQL without database (to create database)
$conn = new mysqli('localhost', 'root', '');

// Check connection
if ($conn->connect_error) {
    $message = "Connection failed: " . htmlspecialchars($conn->connect_error);
    $message_type = 'error';
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    
    if ($_POST['action'] === 'create_all') {
        // Create Database
        $sql_db = "CREATE DATABASE IF NOT EXISTS student_db";
        
        if ($conn->query($sql_db) === TRUE) {
            $db_created = true;
            $message .= "✓ Database 'student_db' created successfully!\n";
        } else {
            if (strpos($conn->error, 'already exists') !== false) {
                $db_created = true;
                $message .= "✓ Database 'student_db' already exists!\n";
            } else {
                $message = "Error creating database: " . htmlspecialchars($conn->error);
                $message_type = 'error';
            }
        }
        
        if ($db_created) {
            // Select the database
            $conn->select_db('student_db');
            
            // Create Students Table
            $sql_table = "CREATE TABLE IF NOT EXISTS students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
            
            if ($conn->query($sql_table) === TRUE) {
                $table_created = true;
                $message .= "✓ Table 'students' created successfully!\n";
                $message_type = 'success';
            } else {
                if (strpos($conn->error, 'already exists') !== false) {
                    $table_created = true;
                    $message .= "✓ Table 'students' already exists!\n";
                    $message_type = 'success';
                } else {
                    $message = "Error creating table: " . htmlspecialchars($conn->error);
                    $message_type = 'error';
                }
            }
        }
    }
    
    if ($_POST['action'] === 'insert_sample') {
        // Connect to database
        $conn->select_db('student_db');
        
        // Sample data
        $sample_data = [
            ['John Doe', 'john@example.com'],
            ['Jane Smith', 'jane@example.com'],
            ['Robert Johnson', 'robert@example.com'],
            ['Maria Garcia', 'maria@example.com'],
            ['James Wilson', 'james@example.com']
        ];
        
        $inserted_count = 0;
        $skipped_count = 0;
        
        foreach ($sample_data as $data) {
            $name = $conn->real_escape_string($data[0]);
            $email = $conn->real_escape_string($data[1]);
            
            $sql = "INSERT INTO students (name, email) VALUES ('$name', '$email')";
            
            if ($conn->query($sql) === TRUE) {
                $inserted_count++;
            } else {
                if (strpos($conn->error, 'Duplicate entry') !== false) {
                    $skipped_count++;
                } else {
                    $message .= "Error: " . htmlspecialchars($conn->error) . "\n";
                }
            }
        }
        
        $message = "✓ Inserted $inserted_count records. Skipped $skipped_count duplicates.";
        $message_type = 'success';
    }
    
    if ($_POST['action'] === 'drop_all') {
        // Drop table
        $conn->select_db('student_db');
        $sql_drop_table = "DROP TABLE IF EXISTS students";
        $conn->query($sql_drop_table);
        
        // Drop database
        $sql_drop_db = "DROP DATABASE IF EXISTS student_db";
        if ($conn->query($sql_drop_db) === TRUE) {
            $message = "✓ Database and table deleted successfully!";
            $message_type = 'warning';
        } else {
            $message = "Error: " . htmlspecialchars($conn->error);
            $message_type = 'error';
        }
    }
}

// Check if database exists
$databases = $conn->query("SHOW DATABASES LIKE 'student_db'");
$db_exists = $databases->num_rows > 0;

// Check if table exists
$tables = null;
if ($db_exists) {
    $conn->select_db('student_db');
    $tables = $conn->query("SHOW TABLES LIKE 'students'");
}
$table_exists = $tables && $tables->num_rows > 0;

// Get record count
$record_count = 0;
if ($table_exists) {
    $result = $conn->query("SELECT COUNT(*) as count FROM students");
    if ($result) {
        $row = $result->fetch_assoc();
        $record_count = $row['count'];
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Setup</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>🔧 Database Setup</h1>
            <p>Create and manage the student database</p>
        </header>

        <nav class="nav-menu">
            <a href="index.html" class="nav-link">Dashboard</a>
            <a href="view_students.php" class="nav-link">View All Students</a>
            <a href="add_student.php" class="nav-link">Add New Student</a>
            <a href="db_setup.php" class="nav-link active">Database Setup</a>
            <a href="documentation.html" class="nav-link">Documentation</a>
        </nav>

        <main class="main-content">
            <!-- Status Message -->
            <?php if (!empty($message)): ?>
                <div class="alert alert-<?php echo $message_type; ?>">
                    <p><?php echo nl2br(htmlspecialchars($message)); ?></p>
                </div>
            <?php endif; ?>

            <!-- Database Status -->
            <section class="status-section">
                <h2>Database Status</h2>
                <div class="status-grid">
                    <div class="status-card <?php echo $db_exists ? 'success' : 'error'; ?>">
                        <h3>Database</h3>
                        <p class="status-value"><?php echo $db_exists ? '✓ EXISTS' : '✗ NOT FOUND'; ?></p>
                        <p class="status-name">student_db</p>
                    </div>

                    <div class="status-card <?php echo $table_exists ? 'success' : 'error'; ?>">
                        <h3>Table</h3>
                        <p class="status-value"><?php echo $table_exists ? '✓ EXISTS' : '✗ NOT FOUND'; ?></p>
                        <p class="status-name">students</p>
                    </div>

                    <div class="status-card <?php echo $record_count > 0 ? 'success' : 'warning'; ?>">
                        <h3>Records</h3>
                        <p class="status-value"><?php echo $record_count; ?></p>
                        <p class="status-name">Total Students</p>
                    </div>
                </div>
            </section>

            <!-- Setup Steps -->
            <section class="setup-section">
                <h2>Setup Steps</h2>
                
                <!-- Step 1 -->
                <div class="setup-step <?php echo $db_exists && $table_exists ? 'completed' : ''; ?>">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>Create Database & Table</h3>
                        <p>Creates 'student_db' database with 'students' table (id, name, email)</p>
                        <form method="POST" style="margin-top: 15px;">
                            <input type="hidden" name="action" value="create_all">
                            <button type="submit" class="btn btn-success">Create Database & Table</button>
                        </form>
                    </div>
                </div>

                <!-- Step 2 -->
                <div class="setup-step <?php echo $record_count > 0 ? 'completed' : ''; ?>">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>Insert Sample Data</h3>
                        <p>Adds 5 sample student records for testing</p>
                        <form method="POST" style="margin-top: 15px;">
                            <input type="hidden" name="action" value="insert_sample">
                            <button type="submit" class="btn btn-primary" <?php echo !$table_exists ? 'disabled' : ''; ?>>Insert Sample Data</button>
                        </form>
                    </div>
                </div>

                <!-- Step 3 -->
                <div class="setup-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h3>Manage Student Records</h3>
                        <p>Go to View/Add/Edit/Delete student records</p>
                        <div style="margin-top: 15px;">
                            <a href="view_students.php" class="btn btn-primary">View Students</a>
                            <a href="add_student.php" class="btn btn-primary">Add Student</a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Database Structure -->
            <?php if ($table_exists): ?>
            <section class="info-section">
                <h2>Database Structure</h2>
                <div class="table-schema">
                    <h3>students Table</h3>
                    <table class="schema-table">
                        <tr>
                            <th>Column Name</th>
                            <th>Data Type</th>
                            <th>Constraints</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>id</td>
                            <td>INT</td>
                            <td>PRIMARY KEY, AUTO_INCREMENT</td>
                            <td>Unique student identifier</td>
                        </tr>
                        <tr>
                            <td>name</td>
                            <td>VARCHAR(100)</td>
                            <td>NOT NULL</td>
                            <td>Student's full name</td>
                        </tr>
                        <tr>
                            <td>email</td>
                            <td>VARCHAR(100)</td>
                            <td>UNIQUE, NOT NULL</td>
                            <td>Student's email (unique)</td>
                        </tr>
                        <tr>
                            <td>created_at</td>
                            <td>TIMESTAMP</td>
                            <td>DEFAULT CURRENT_TIMESTAMP</td>
                            <td>Record creation time</td>
                        </tr>
                        <tr>
                            <td>updated_at</td>
                            <td>TIMESTAMP</td>
                            <td>AUTO UPDATE</td>
                            <td>Record last update time</td>
                        </tr>
                    </table>
                </div>
            </section>
            <?php endif; ?>

            <!-- Danger Zone -->
            <section class="danger-section">
                <h2>⚠️ Danger Zone</h2>
                <div class="danger-box">
                    <h3>Delete Everything</h3>
                    <p>This will permanently delete the database and all records.</p>
                    <form method="POST" onsubmit="return confirm('Are you sure you want to delete the database? This cannot be undone!');" style="margin-top: 15px;">
                        <input type="hidden" name="action" value="drop_all">
                        <button type="submit" class="btn btn-danger">Delete Database & Table</button>
                    </form>
                </div>
            </section>
        </main>
    </div>

    <footer class="footer">
        <p>&copy; 2024 Student Management System | Database Operations Assignment</p>
    </footer>
</body>
</html>
