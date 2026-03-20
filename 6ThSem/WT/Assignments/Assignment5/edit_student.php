<?php
/**
 * Edit Student Page
 * Update existing student records
 */

require_once 'config.php';

header('Content-Type: text/html; charset=UTF-8');

$message = '';
$message_type = '';
$student = null;
$student_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Fetch student data
if ($student_id > 0) {
    $stmt = $conn->prepare("SELECT id, name, email FROM students WHERE id = ?");
    
    if ($stmt) {
        $stmt->bind_param("i", $student_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $student = $result->fetch_assoc();
        } else {
            $message = "✗ Student record not found.";
            $message_type = 'error';
        }
        
        $stmt->close();
    }
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_student') {
    $id = intval($_POST['id']);
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    
    // Validation
    $errors = [];
    
    if (empty($name)) {
        $errors[] = "Name field is required.";
    } elseif (strlen($name) < 3) {
        $errors[] = "Name must be at least 3 characters long.";
    } elseif (!preg_match("/^[a-zA-Z\s]+$/", $name)) {
        $errors[] = "Name can only contain letters and spaces.";
    }
    
    if (empty($email)) {
        $errors[] = "Email field is required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format.";
    }
    
    // If no errors, update database
    if (empty($errors)) {
        $stmt = $conn->prepare("UPDATE students SET name = ?, email = ? WHERE id = ?");
        
        if ($stmt) {
            $stmt->bind_param("ssi", $name, $email, $id);
            
            if ($stmt->execute()) {
                $message = "✓ Student record updated successfully!";
                $message_type = 'success';
                // Update student data
                $student = ['id' => $id, 'name' => $name, 'email' => $email];
            } else {
                if (strpos($stmt->error, 'Duplicate entry') !== false) {
                    $message = "✗ Error: Email already exists in the database.";
                } else {
                    $message = "✗ Error: " . htmlspecialchars($stmt->error);
                }
                $message_type = 'error';
            }
            
            $stmt->close();
        } else {
            $message = "✗ Database error: " . htmlspecialchars($conn->error);
            $message_type = 'error';
        }
    } else {
        $message = "✗ Validation Errors:\n" . implode("\n", $errors);
        $message_type = 'error';
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Student</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>✏️ Edit Student</h1>
            <p>Update student information</p>
        </header>

        <nav class="nav-menu">
            <a href="index.html" class="nav-link">Dashboard</a>
            <a href="view_students.php" class="nav-link">View All Students</a>
            <a href="add_student.php" class="nav-link">Add New Student</a>
            <a href="db_setup.php" class="nav-link">Database Setup</a>
            <a href="documentation.html" class="nav-link">Documentation</a>
        </nav>

        <main class="main-content">
            <!-- Status Message -->
            <?php if (!empty($message)): ?>
                <div class="alert alert-<?php echo $message_type; ?>">
                    <p><?php echo nl2br(htmlspecialchars($message)); ?></p>
                </div>
            <?php endif; ?>

            <?php if ($student): ?>
                <!-- Edit Student Form -->
                <section class="form-section">
                    <h2>Student Information</h2>
                    
                    <form method="POST" class="student-form">
                        <input type="hidden" name="action" value="update_student">
                        <input type="hidden" name="id" value="<?php echo $student['id']; ?>">
                        
                        <div class="form-group">
                            <label for="id">Student ID:</label>
                            <input 
                                type="text" 
                                id="id" 
                                value="<?php echo $student['id']; ?>"
                                disabled
                            >
                            <small>Auto-generated, cannot be changed</small>
                        </div>

                        <div class="form-group">
                            <label for="name">Full Name: <span class="required">*</span></label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value="<?php echo htmlspecialchars($student['name']); ?>"
                                placeholder="Enter student's full name"
                                required
                                minlength="3"
                                pattern="[a-zA-Z\s]+"
                                title="Name can only contain letters and spaces"
                            >
                            <small>3-100 characters, letters and spaces only</small>
                        </div>

                        <div class="form-group">
                            <label for="email">Email Address: <span class="required">*</span></label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value="<?php echo htmlspecialchars($student['email']); ?>"
                                placeholder="Enter student's email"
                                required
                            >
                            <small>Must be a valid email</small>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn btn-success">Update Student</button>
                            <a href="view_students.php" class="btn btn-secondary">Cancel</a>
                            <a href="view_students.php?action=delete&id=<?php echo $student['id']; ?>" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this record?');">Delete Record</a>
                        </div>
                    </form>
                </section>

                <!-- Database Operations -->
                <section class="info-section">
                    <h2>UPDATE Operation</h2>
                    <p>This page demonstrates the UPDATE database operation:</p>
                    
                    <div class="operation-box">
                        <h3>SQL Query:</h3>
                        <div class="code-block">
                            <pre>
UPDATE students 
SET name = ?, email = ? 
WHERE id = ?;
                            </pre>
                        </div>
                    </div>

                    <div class="operation-box">
                        <h3>PHP MySQLi Implementation:</h3>
                        <div class="code-block">
                            <pre>
$stmt = $conn->prepare("UPDATE students SET name = ?, email = ? WHERE id = ?");
$stmt->bind_param("ssi", $name, $email, $id);
$stmt->execute();

// Check if update was successful
if ($stmt->affected_rows > 0) {
    echo "Record updated successfully";
}
                            </pre>
                        </div>
                    </div>

                    <div class="operation-box">
                        <h3>Key Features:</h3>
                        <ul>
                            <li>✓ Prepared statement prevents SQL injection</li>
                            <li>✓ Parameter binding (ssi = string, string, integer)</li>
                            <li>✓ Validation before updating</li>
                            <li>✓ Affected rows check</li>
                            <li>✓ Error handling</li>
                        </ul>
                    </div>
                </section>

            <?php else: ?>
                <div class="no-records">
                    <p>Student record not found or no ID provided.</p>
                    <a href="view_students.php" class="btn btn-primary">Back to Students</a>
                </div>
            <?php endif; ?>
        </main>
    </div>

    <footer class="footer">
        <p>&copy; 2024 Student Management System | Database Operations Assignment</p>
    </footer>
</body>
</html>
