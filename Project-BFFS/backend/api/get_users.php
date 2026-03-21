<?php
/**********************************************************
 * GET USERS API - UNIVERSITY PERMIT SYSTEM
 **********************************************************/
header('Content-Type: application/json');
require_once '../config/db.php';

try {
    $stmt = $pdo->query("SELECT id, student_id, role, grade_level, created_at FROM users ORDER BY role DESC, student_id ASC");
    $users = $stmt->fetchAll();

    echo json_encode(['success' => true, 'users' => $users]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
