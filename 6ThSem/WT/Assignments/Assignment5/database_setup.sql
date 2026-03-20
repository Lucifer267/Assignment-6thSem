-- Student Database Creation Script
-- Database Operations Assignment
-- Execute this in MySQL/phpMyAdmin if automated setup fails

-- Drop existing database (backup first!)
-- DROP DATABASE IF EXISTS student_db;

-- Create Database
CREATE DATABASE IF NOT EXISTS student_db;
USE student_db;

-- Create Students Table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert Sample Data (Optional)
INSERT INTO students (name, email) VALUES
('John Doe', 'john@example.com'),
('Jane Smith', 'jane@example.com'),
('Robert Johnson', 'robert@example.com'),
('Maria Garcia', 'maria@example.com'),
('James Wilson', 'james@example.com');

-- View the table structure
DESCRIBE students;

-- View all records
SELECT * FROM students;

-- Additional Useful Queries

-- Count total records
-- SELECT COUNT(*) as total FROM students;

-- Get records sorted by ID
-- SELECT id, name, email FROM students ORDER BY id DESC;

-- Search by email
-- SELECT * FROM students WHERE email = 'john@example.com';

-- Update a record
-- UPDATE students SET name = 'Johnny Doe' WHERE id = 1;

-- Delete a record
-- DELETE FROM students WHERE id = 5;

-- Get table size
-- SELECT TABLE_NAME, 
--        ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
-- FROM information_schema.TABLE_SCHEMA = 'student_db' AND TABLE_NAME = 'students';
