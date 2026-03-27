<?php
require_once '../config.php';

// Get all students
$conn = getDBConnection();

$sql = "SELECT * FROM students ORDER BY name";
$result = $conn->query($sql);

if ($result === FALSE) {
    sendErrorResponse('Error fetching students: ' . $conn->error);
}

$students = [];
while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

$conn->close();

sendSuccessResponse('Students fetched successfully', $students);
?>
