<?php
require_once '../config.php';

if (!isset($_GET['roll_number'])) {
    sendErrorResponse('roll_number parameter is required');
}

$roll_number = $_GET['roll_number'];
$conn = getDBConnection();

$sql = "SELECT * FROM students WHERE roll_number = ?";
$stmt = $conn->prepare($sql);

if ($stmt === FALSE) {
    sendErrorResponse('Prepare failed: ' . $conn->error);
}

$stmt->bind_param('s', $roll_number);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendErrorResponse('Student not found', 404);
}

$student = $result->fetch_assoc();

$stmt->close();
$conn->close();

sendSuccessResponse('Student fetched successfully', $student);
?>
