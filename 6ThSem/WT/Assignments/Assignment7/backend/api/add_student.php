<?php
require_once '../config.php';

// Get JSON data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['roll_number']) || !isset($data['name']) || !isset($data['course'])) {
    sendErrorResponse('Invalid request data: roll_number, name, and course are required');
}

$roll_number = $data['roll_number'];
$name = $data['name'];
$course = $data['course'];
$email = isset($data['email']) ? $data['email'] : '';

// Validate input
if (empty($roll_number) || empty($name) || empty($course)) {
    sendErrorResponse('All fields are required');
}

$conn = getDBConnection();

// Check if student already exists
$sql = "SELECT id FROM students WHERE roll_number = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $roll_number);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    sendErrorResponse('Student with this roll number already exists');
}

$stmt->close();

// Insert new student
$sql = "INSERT INTO students (roll_number, name, course, email) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if ($stmt === FALSE) {
    sendErrorResponse('Prepare failed: ' . $conn->error);
}

$stmt->bind_param('ssss', $roll_number, $name, $course, $email);

if ($stmt->execute() === FALSE) {
    sendErrorResponse('Error adding student: ' . $stmt->error);
}

$stmt->close();

// Fetch the newly created student
$sql = "SELECT * FROM students WHERE roll_number = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $roll_number);
$stmt->execute();
$result = $stmt->get_result();
$student = $result->fetch_assoc();

$stmt->close();
$conn->close();

sendSuccessResponse('Student added successfully', $student);
?>
