<?php
require_once '../config.php';

// Get JSON data
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['roll_number'])) {
    sendErrorResponse('roll_number is required');
}

$roll_number = trim($input['roll_number']);

if (empty($roll_number)) {
    sendErrorResponse('Roll number cannot be empty');
}

$conn = getDBConnection();

// Check if student exists
$sql = "SELECT id FROM students WHERE roll_number = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $roll_number);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $stmt->close();
    $conn->close();
    sendErrorResponse('Student not found');
}

$stmt->close();

// Delete student
$sql = "DELETE FROM students WHERE roll_number = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $roll_number);

if ($stmt->execute()) {
    $stmt->close();
    $conn->close();
    sendSuccessResponse('Student deleted successfully');
} else {
    sendErrorResponse('Error deleting student: ' . $conn->error);
}
?>
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $roll_number);

if ($stmt->execute() === FALSE) {
    sendErrorResponse('Error deleting student: ' . $stmt->error);
}

$stmt->close();
$conn->close();

sendSuccessResponse('Student deleted successfully');
?>
