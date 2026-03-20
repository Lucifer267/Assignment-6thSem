<?php
/**
 * Database Configuration File - PDO Method (Alternative)
 * Configure MySQL connection using PDO (PHP Data Objects)
 * Uncomment this file to use PDO instead of MySQLi
 */

/*
// PDO Connection
$db_server = 'localhost';
$db_user = 'root';
$db_password = '';
$db_name = 'student_db';

try {
    $conn = new PDO('mysql:host=' . $db_server . ';dbname=' . $db_name, 
                    $db_user, 
                    $db_password);
    
    // Set the PHP Data Objects error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Set charset
    $conn->exec("SET CHARACTER SET utf8");
    
} catch(PDOException $e) {
    echo "Connection Error: " . $e->getMessage();
    die();
}
*/

?>
