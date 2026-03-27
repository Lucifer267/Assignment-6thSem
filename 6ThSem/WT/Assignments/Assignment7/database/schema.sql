-- VIT Result Portal Database Schema
-- Create and initialize the database for the student result management system

-- Create Database
CREATE DATABASE IF NOT EXISTS vit_result_portal;
USE vit_result_portal;

-- Create Students Table
CREATE TABLE IF NOT EXISTS students (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_roll_number (roll_number),
    INDEX idx_course (course)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Data
INSERT INTO students 
(roll_number, name, course, email, mse1, ese1, mse2, ese2, mse3, ese3, mse4, ese4) 
VALUES 
('REG001', 'Aman Kumar', 'B.Tech CSE', 'aman@vit.ac.in', 28, 65, 30, 68, 25, 62, 29, 70),
('REG002', 'Priya Singh', 'B.Tech CSE', 'priya@vit.ac.in', 26, 70, 28, 72, 27, 68, 30, 75),
('REG003', 'Rohit Patel', 'B.Tech IT', 'rohit@vit.ac.in', 20, 45, 18, 40, 15, 35, 19, 42),
('REG004', 'Divya Sharma', 'B.Tech CSE', 'divya@vit.ac.in', 29, 72, 30, 75, 28, 70, 30, 78),
('REG005', 'Arjun Verma', 'B.Tech IT', 'arjun@vit.ac.in', 25, 60, 26, 62, 24, 58, 27, 65);
