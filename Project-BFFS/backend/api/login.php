<?php
/**********************************************************
 * SECURE LOGIN API - UNIVERSITY PERMIT SYSTEM
 **********************************************************/
// Temporarily enable error reporting to debug the 500 error
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once '../config/db.php';

// Get JSON data from POST request
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Missing username or password']);
    exit;
}

$username = $data['username'];
$password = $data['password'];

try {
    // Check if user exists in database
    $stmt = $pdo->prepare("SELECT * FROM users WHERE student_id = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Login successful
        // In production, we'd start a session or issue a JWT token here
        echo json_encode([
            'success' => true,
            'user' => [
                'username' => $user['student_id'],
                'role' => $user['role'],
                'isAdmin' => ($user['role'] === 'admin')
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid Student ID or Password']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
