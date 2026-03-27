<?php
require_once 'config.php';

function createDatabase() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD);
    
    if ($conn->connect_error) {
        return false;
    }
    
    // Create database if not exists
    $sql = "CREATE DATABASE IF NOT EXISTS " . DB_NAME;
    if ($conn->query($sql) === FALSE) {
        return false;
    }
    
    $conn->close();
    return true;
}

function createTables() {
    $conn = getDBConnection();
    
    // Create students table
    $sql = "CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        roll_number VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        course VARCHAR(50) NOT NULL,
        email VARCHAR(100),
        mse1 DECIMAL(5, 2) DEFAULT 0,
        ese1 DECIMAL(5, 2) DEFAULT 0,
        mse2 DECIMAL(5, 2) DEFAULT 0,
        ese2 DECIMAL(5, 2) DEFAULT 0,
        mse3 DECIMAL(5, 2) DEFAULT 0,
        ese3 DECIMAL(5, 2) DEFAULT 0,
        mse4 DECIMAL(5, 2) DEFAULT 0,
        ese4 DECIMAL(5, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    
    if ($conn->query($sql) === FALSE) {
        echo "Error creating table: " . $conn->error;
        return false;
    }
    
    return true;
}

function insertSampleData() {
    $conn = getDBConnection();
    
    // Check if data already exists
    $result = $conn->query("SELECT COUNT(*) as count FROM students");
    $row = $result->fetch_assoc();
    
    if ($row['count'] > 0) {
        return true; // Data already exists
    }
    
    // Sample data
    $sampleStudents = [
        ['REG001', 'Aman Kumar', 'B.Tech CSE', 'aman@vit.ac.in', 28, 65, 30, 68, 25, 62, 29, 70],
        ['REG002', 'Priya Singh', 'B.Tech CSE', 'priya@vit.ac.in', 26, 70, 28, 72, 27, 68, 30, 75],
        ['REG003', 'Rohit Patel', 'B.Tech IT', 'rohit@vit.ac.in', 20, 45, 18, 40, 15, 35, 19, 42],
        ['REG004', 'Divya Sharma', 'B.Tech CSE', 'divya@vit.ac.in', 29, 72, 30, 75, 28, 70, 30, 78],
        ['REG005', 'Arjun Verma', 'B.Tech IT', 'arjun@vit.ac.in', 25, 60, 26, 62, 24, 58, 27, 65],
    ];
    
    $sql = "INSERT INTO students 
            (roll_number, name, course, email, mse1, ese1, mse2, ese2, mse3, ese3, mse4, ese4) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    
    foreach ($sampleStudents as $student) {
        $stmt->bind_param('ssssdddddddd', 
            $student[0], $student[1], $student[2], $student[3],
            $student[4], $student[5], $student[6], $student[7],
            $student[8], $student[9], $student[10], $student[11]
        );
        
        if ($stmt->execute() === FALSE) {
            echo "Error inserting data: " . $conn->error;
            return false;
        }
    }
    
    $stmt->close();
    $conn->close();
    
    return true;
}

// Create database and tables
if (createDatabase()) {
    if (createTables()) {
        if (insertSampleData()) {
            echo "Database initialized successfully!";
        } else {
            echo "Error inserting sample data";
        }
    } else {
        echo "Error creating tables";
    }
} else {
    echo "Error creating database";
}
?>
