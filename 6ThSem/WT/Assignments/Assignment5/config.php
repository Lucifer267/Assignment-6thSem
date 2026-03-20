<?php
/**
 * Database Configuration File
 * Configure MySQL connection using MySQLi (Object-Oriented)
 */

// Database credentials
define('DB_SERVER', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');  // Leave empty if no password
define('DB_NAME', 'student_db');

// Create connection using MySQLi Object-Oriented approach
$conn = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8
$conn->set_charset("utf8");

// Optional: Set error reporting
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

?>
