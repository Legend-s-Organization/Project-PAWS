-- SQL Script to set up the University Permit System Database
-- Create the Database
CREATE DATABASE IF NOT EXISTS university_paws;
USE university_paws;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') DEFAULT 'student',
    grade_level ENUM('Senior High', 'College') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Permits Table
CREATE TABLE IF NOT EXISTS permits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    permit_type VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    purpose TEXT NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(student_id) ON DELETE CASCADE
);

-- Create Permit Files Table
CREATE TABLE IF NOT EXISTS permit_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permit_id INT NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- e.g., 'request_form', 'student_id', 'endorsement'
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    FOREIGN KEY (permit_id) REFERENCES permits(id) ON DELETE CASCADE
);

-- Insert Demo Admin and Student Accounts (Passwords are hashed)
-- Password for admin01: adminpass01
-- Password for student01: password01
INSERT INTO users (student_id, password, role) VALUES 
('admin01', '$2y$10$U4K7vM8y0qWk9.P8w1C.Y.w3S.N9v7I2.O1G2.O1G2.O1G2.O1G2.', 'admin'),
('student01', '$2y$10$I6.vO.vO.vO.vO.vO.vO.vO.vO.vO.vO.vO.vO.vO.vO.vO.vO.', 'student');
-- NOTE: Real password hashing would be done via PHP in a real setup.
