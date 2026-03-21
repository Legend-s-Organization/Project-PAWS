<?php
/**********************************************************
 * SECURE SIGNUP API - UNIVERSITY PERMIT SYSTEM
 **********************************************************/
header('Content-Type: application/json');
require_once '../config/db.php';

// Get JSON data from POST request
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || !isset($data['password']) || !isset($data['grade_level'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$username = trim($data['username']);
$password = $data['password'];
$grade_level = $data['grade_level'];

try {
    // Check if student ID already exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE student_id = ?");
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Student ID already exists']);
        exit;
    }

    // Securely hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user into database
    $stmt = $pdo->prepare("INSERT INTO users (student_id, password, role, grade_level) VALUES (?, ?, 'student', ?)");
    $stmt->execute([$username, $hashedPassword, $grade_level]);

    echo json_encode(['success' => true, 'message' => 'Account created successfully!']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
