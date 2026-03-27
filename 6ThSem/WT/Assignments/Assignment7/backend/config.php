<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', ''); // Leave empty for XAMPP default
define('DB_NAME', 'vit_result_portal');

// Set timezone
date_default_timezone_set('Asia/Kolkata');

// Enable error reporting during development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Header for API responses
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Create database connection
function getDBConnection() {
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
        
        if ($conn->connect_error) {
            throw new Exception('Database connection failed: ' . $conn->connect_error);
        }
        
        $conn->set_charset("utf8");
        return $conn;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
        exit();
    }
}

// Response helper functions
function sendResponse($success, $message, $data = null) {
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response);
    exit();
}

function sendErrorResponse($message, $statusCode = 400) {
    http_response_code($statusCode);
    sendResponse(false, $message);
}

function sendSuccessResponse($message, $data = null) {
    http_response_code(200);
    sendResponse(true, $message, $data);
}
?>
