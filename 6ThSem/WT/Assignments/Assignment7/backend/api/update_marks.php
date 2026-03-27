<?php
require_once '../config.php';

// Get JSON data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['roll_number']) || !isset($data['marks'])) {
    sendErrorResponse('Invalid request data');
}

$roll_number = trim($data['roll_number']);
$marks = $data['marks'];

// Validate marks - cast to float
foreach ($marks as $key => $value) {
    $marks[$key] = floatval($value);
}

// Validate marks keys
$required_marks = ['mse1', 'ese1', 'mse2', 'ese2', 'mse3', 'ese3', 'mse4', 'ese4'];
foreach ($required_marks as $mark) {
    if (!isset($marks[$mark])) {
        sendErrorResponse('Missing marks: ' . $mark);
    }
}

$conn = getDBConnection();

// First, check if student exists
$check_sql = "SELECT id FROM students WHERE roll_number = ?";
$stmt = $conn->prepare($check_sql);
$stmt->bind_param('s', $roll_number);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendErrorResponse('Student with roll number ' . $roll_number . ' not found in database');
}
$stmt->close();

// Update marks
$sql = "UPDATE students SET 
        mse1 = ?, ese1 = ?, 
        mse2 = ?, ese2 = ?, 
        mse3 = ?, ese3 = ?, 
        mse4 = ?, ese4 = ?
        WHERE roll_number = ?";

$stmt = $conn->prepare($sql);

if ($stmt === FALSE) {
    sendErrorResponse('Prepare failed: ' . $conn->error);
}

$stmt->bind_param('dddddddds',
    $marks['mse1'], $marks['ese1'],
    $marks['mse2'], $marks['ese2'],
    $marks['mse3'], $marks['ese3'],
    $marks['mse4'], $marks['ese4'],
    $roll_number
);

if ($stmt->execute() === FALSE) {
    sendErrorResponse('Error updating marks: ' . $stmt->error);
}

$stmt->close();

// Fetch updated student data
$sql = "SELECT * FROM students WHERE roll_number = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $roll_number);
$stmt->execute();
$result = $stmt->get_result();
$student = $result->fetch_assoc();
$stmt->close();
$conn->close();

sendSuccessResponse('Marks updated successfully', $student);
?>
$result = $stmt->get_result();
$student = $result->fetch_assoc();

$stmt->close();
$conn->close();

sendSuccessResponse('Marks updated successfully', $student);
?>
