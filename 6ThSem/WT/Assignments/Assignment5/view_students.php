<?php
/**
 * View Students Page
 * Display, edit, and delete student records
 */

require_once 'config.php';

header('Content-Type: text/html; charset=UTF-8');

$message = '';
$message_type = '';

// Handle delete action
if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    
    // Prepare and execute delete statement
    $stmt = $conn->prepare("DELETE FROM students WHERE id = ?");
    
    if ($stmt) {
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                $message = "✓ Student record deleted successfully!";
                $message_type = 'success';
            } else {
                $message = "✗ Student record not found.";
                $message_type = 'error';
            }
        } else {
            $message = "✗ Error deleting record: " . htmlspecialchars($stmt->error);
            $message_type = 'error';
        }
        
        $stmt->close();
    }
}

// Fetch all students
$students = [];
$total_students = 0;

$result = $conn->query("SELECT id, name, email, created_at, updated_at FROM students ORDER BY id DESC");

if ($result) {
    $total_students = $result->num_rows;
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Students</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>👀 View All Students</h1>
            <p>Manage student records</p>
        </header>

        <nav class="nav-menu">
            <a href="index.html" class="nav-link">Dashboard</a>
            <a href="view_students.php" class="nav-link active">View All Students</a>
            <a href="add_student.php" class="nav-link">Add New Student</a>
            <a href="db_setup.php" class="nav-link">Database Setup</a>
            <a href="documentation.html" class="nav-link">Documentation</a>
        </nav>

        <main class="main-content">
            <!-- Status Message -->
            <?php if (!empty($message)): ?>
                <div class="alert alert-<?php echo $message_type; ?>">
                    <p><?php echo htmlspecialchars($message); ?></p>
                </div>
            <?php endif; ?>

            <!-- Summary -->
            <section class="summary-section">
                <div class="summary-box">
                    <h3>Total Students: <span class="count"><?php echo $total_students; ?></span></h3>
                    <a href="add_student.php" class="btn btn-success">Add New Student</a>
                </div>
            </section>

            <!-- Students Table -->
            <section class="table-section">
                <?php if ($total_students > 0): ?>
                    <h2>Student Records</h2>
                    <div class="table-responsive">
                        <table class="students-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Created Date</th>
                                    <th>Updated Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($students as $student): ?>
                                    <tr>
                                        <td class="id-cell"><?php echo $student['id']; ?></td>
                                        <td class="name-cell"><?php echo htmlspecialchars($student['name']); ?></td>
                                        <td class="email-cell"><?php echo htmlspecialchars($student['email']); ?></td>
                                        <td class="date-cell"><?php echo htmlspecialchars($student['created_at']); ?></td>
                                        <td class="date-cell"><?php echo htmlspecialchars($student['updated_at']); ?></td>
                                        <td class="actions-cell">
                                            <a href="edit_student.php?id=<?php echo $student['id']; ?>" class="btn btn-edit">Edit</a>
                                            <a href="view_students.php?action=delete&id=<?php echo $student['id']; ?>" class="btn btn-delete" onclick="return confirm('Are you sure you want to delete this record?');">Delete</a>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php else: ?>
                    <div class="no-records">
                        <p>No student records found.</p>
                        <p>
                            <a href="db_setup.php" class="btn btn-primary">Setup Database</a>
                            <a href="add_student.php" class="btn btn-success">Add First Student</a>
                        </p>
                    </div>
                <?php endif; ?>
            </section>

            <!-- Database Operations -->
            <section class="info-section">
                <h2>Database Operations Demonstrated</h2>
                
                <div class="operation-box">
                    <h3>1. READ Operation (SELECT)</h3>
                    <p>Retrieve all student records from the database:</p>
                    <div class="code-block">
                        <pre>
$result = $conn->query("SELECT id, name, email, created_at FROM students ORDER BY id DESC");
while ($row = $result->fetch_assoc()) {
    // Display each student record
}
                        </pre>
                    </div>
                </div>

                <div class="operation-box">
                    <h3>2. DELETE Operation</h3>
                    <p>Remove student record from database using prepared statement:</p>
                    <div class="code-block">
                        <pre>
$stmt = $conn->prepare("DELETE FROM students WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
                        </pre>
                    </div>
                </div>

                <div class="operation-box">
                    <h3>3. UPDATE Operation</h3>
                    <p>Modify existing student information:</p>
                    <div class="code-block">
                        <pre>
$stmt = $conn->prepare("UPDATE students SET name = ?, email = ? WHERE id = ?");
$stmt->bind_param("ssi", $name, $email, $id);
$stmt->execute();
                        </pre>
                    </div>
                </div>
            </section>

            <!-- Query Examples -->
            <section class="info-section">
                <h2>SQL Queries Used</h2>
                <div class="query-box">
                    <h3>SELECT Query:</h3>
                    <code>SELECT id, name, email, created_at, updated_at FROM students ORDER BY id DESC;</code>
                </div>
                <div class="query-box">
                    <h3>DELETE Query:</h3>
                    <code>DELETE FROM students WHERE id = ?;</code>
                </div>
                <div class="query-box">
                    <h3>COUNT Query:</h3>
                    <code>SELECT COUNT(*) as total FROM students;</code>
                </div>
            </section>
        </main>
    </div>

    <footer class="footer">
        <p>&copy; 2024 Student Management System | Database Operations Assignment</p>
    </footer>
</body>
</html>
