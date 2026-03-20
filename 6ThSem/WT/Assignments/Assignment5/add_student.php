<?php
/**
 * Add Student Page
 * Create/Insert new student records
 */

require_once 'config.php';

header('Content-Type: text/html; charset=UTF-8');

$message = '';
$message_type = '';
$success = false;

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_student') {
    
    // Get form data
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
    
    // If no errors, insert into database
    if (empty($errors)) {
        // Prepare statement to prevent SQL injection
        $stmt = $conn->prepare("INSERT INTO students (name, email) VALUES (?, ?)");
        
        if ($stmt) {
            // Bind parameters
            $stmt->bind_param("ss", $name, $email);
            
            // Execute statement
            if ($stmt->execute()) {
                $message = "✓ Student '$name' added successfully! (ID: " . $stmt->insert_id . ")";
                $message_type = 'success';
                $success = true;
                // Clear form data
                $name = '';
                $email = '';
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
    <title>Add Student</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>➕ Add New Student</h1>
            <p>Insert a new student record into the database</p>
        </header>

        <nav class="nav-menu">
            <a href="index.html" class="nav-link">Dashboard</a>
            <a href="view_students.php" class="nav-link">View All Students</a>
            <a href="add_student.php" class="nav-link active">Add New Student</a>
            <a href="db_setup.php" class="nav-link">Database Setup</a>
            <a href="documentation.html" class="nav-link">Documentation</a>
        </nav>

        <main class="main-content">
            <!-- Status Message -->
            <?php if (!empty($message)): ?>
                <div class="alert alert-<?php echo $message_type; ?>">
                    <p><?php echo nl2br(htmlspecialchars($message)); ?></p>
                    <?php if ($success): ?>
                        <a href="view_students.php" class="btn btn-small">View All Students</a>
                    <?php endif; ?>
                </div>
            <?php endif; ?>

            <!-- Add Student Form -->
            <section class="form-section">
                <h2>Student Information</h2>
                
                <form method="POST" class="student-form">
                    <input type="hidden" name="action" value="add_student">
                    
                    <div class="form-group">
                        <label for="name">Full Name: <span class="required">*</span></label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value="<?php echo htmlspecialchars($name ?? ''); ?>"
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
                            value="<?php echo htmlspecialchars($email ?? ''); ?>"
                            placeholder="Enter student's email (must be unique)"
                            required
                        >
                        <small>Must be a valid and unique email</small>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-success">Add Student</button>
                        <a href="view_students.php" class="btn btn-secondary">Cancel</a>
                    </div>
                </form>
            </section>

            <!-- Instructions -->
            <section class="info-section">
                <h2>Instructions</h2>
                <div class="info-box">
                    <h3>Form Requirements:</h3>
                    <ul>
                        <li><strong>Name:</strong> 3-100 characters, letters and spaces only</li>
                        <li><strong>Email:</strong> Valid email format (example@domain.com)</li>
                        <li><strong>Email Must Be Unique:</strong> Each student must have a different email</li>
                        <li><strong>Database:</strong> Record is automatically assigned an ID</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h3>What Happens Next:</h3>
                    <ol>
                        <li>Click "Add Student" button to submit the form</li>
                        <li>Data is validated on the server</li>
                        <li>Record is inserted into 'students' table via MySQLi</li>
                        <li>Success message shows with the new student ID</li>
                        <li>New record appears in "View All Students" page</li>
                    </ol>
                </div>
            </section>

            <!-- Recent Operations -->
            <section class="info-section">
                <h2>Database Operations Used</h2>
                <div class="code-block">
                    <h3>INSERT Operation (MySQLi Prepared Statement):</h3>
                    <pre>
$stmt = $conn->prepare("INSERT INTO students (name, email) VALUES (?, ?)");
$stmt->bind_param("ss", $name, $email);
$stmt->execute();
new_id = $stmt->insert_id;
                    </pre>
                </div>
            </section>
        </main>
    </div>

    <footer class="footer">
        <p>&copy; 2024 Student Management System | Database Operations Assignment</p>
    </footer>
</body>
</html>
