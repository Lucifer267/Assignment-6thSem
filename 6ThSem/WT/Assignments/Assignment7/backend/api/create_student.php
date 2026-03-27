<?php
require_once '../config.php';

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendErrorResponse('Only POST requests are allowed');
}

// Get JSON data
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($input['roll_number']) || !isset($input['name']) || !isset($input['course'])) {
    sendErrorResponse('Missing required fields: roll_number, name, course');
}

$roll_number = trim($input['roll_number']);
$name = trim($input['name']);
$course = trim($input['course']);
$email = isset($input['email']) ? trim($input['email']) : '';

if (empty($roll_number) || empty($name) || empty($course)) {
    sendErrorResponse('Roll number, name, and course cannot be empty');
}

$conn = getDBConnection();

// Check if student already exists
$check_sql = "SELECT id FROM students WHERE roll_number = ?";
$stmt = $conn->prepare($check_sql);
$stmt->bind_param("s", $roll_number);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    sendErrorResponse('Student with this roll number already exists');
}
$stmt->close();

// Insert new student
$insert_sql = "INSERT INTO students (roll_number, name, course, email) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($insert_sql);
$stmt->bind_param("ssss", $roll_number, $name, $course, $email);

if ($stmt->execute()) {
    $new_id = $conn->insert_id;
    $stmt->close();
    
    // Fetch the newly created student
    $fetch_sql = "SELECT * FROM students WHERE id = ?";
    $stmt = $conn->prepare($fetch_sql);
    $stmt->bind_param("i", $new_id);
    $stmt->execute();
    $student = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    $conn->close();
    
    sendSuccessResponse('Student created successfully', $student);
} else {
    sendErrorResponse('Error creating student: ' . $conn->error);
}
?>
