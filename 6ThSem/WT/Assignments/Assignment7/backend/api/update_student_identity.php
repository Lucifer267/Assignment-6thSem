<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendErrorResponse('Only POST requests are allowed');
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['roll_number']) || !isset($data['name']) || !array_key_exists('email', $data)) {
    sendErrorResponse('Missing required fields: roll_number, name, email');
}

$roll_number = trim($data['roll_number']);
$name = trim($data['name']);
$email = trim((string) $data['email']);

if ($roll_number === '' || $name === '') {
    sendErrorResponse('Roll number and name cannot be empty');
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendErrorResponse('Invalid email format');
}

$conn = getDBConnection();

$check_sql = 'SELECT id FROM students WHERE roll_number = ?';
$stmt = $conn->prepare($check_sql);
if ($stmt === false) {
    sendErrorResponse('Prepare failed: ' . $conn->error);
}
$stmt->bind_param('s', $roll_number);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $stmt->close();
    $conn->close();
    sendErrorResponse('Student with roll number ' . $roll_number . ' not found', 404);
}
$stmt->close();

$update_sql = 'UPDATE students SET name = ?, email = ? WHERE roll_number = ?';
$stmt = $conn->prepare($update_sql);
if ($stmt === false) {
    sendErrorResponse('Prepare failed: ' . $conn->error);
}
$stmt->bind_param('sss', $name, $email, $roll_number);

if ($stmt->execute() === false) {
    $stmt->close();
    $conn->close();
    sendErrorResponse('Error updating student identity: ' . $stmt->error);
}
$stmt->close();

$fetch_sql = 'SELECT * FROM students WHERE roll_number = ?';
$stmt = $conn->prepare($fetch_sql);
if ($stmt === false) {
    sendErrorResponse('Prepare failed: ' . $conn->error);
}
$stmt->bind_param('s', $roll_number);
$stmt->execute();
$result = $stmt->get_result();
$student = $result->fetch_assoc();

$stmt->close();
$conn->close();

sendSuccessResponse('Student identity updated successfully', $student);
?>