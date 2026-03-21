<?php
/**********************************************************
 * GET STUDENT ACTIVITY API - UNIVERSITY PERMIT SYSTEM
 **********************************************************/
header('Content-Type: application/json');
require_once '../config/db.php';

// In a real setup, we'd check the session for the student_id
$student_id = $_GET['student_id'] ?? null;

if (!$student_id) {
    echo json_encode(['success' => false, 'message' => 'Missing Student ID']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT p.*, GROUP_CONCAT(pf.file_name, ':', pf.file_path) as files 
                        FROM permits p 
                        LEFT JOIN permit_files pf ON p.id = pf.permit_id 
                        WHERE p.student_id = ?
                        GROUP BY p.id 
                        ORDER BY p.submitted_at DESC");
    $stmt->execute([$student_id]);
    $permits = $stmt->fetchAll();

    // Transform files string to associative array
    foreach ($permits as &$permit) {
        $file_array = [];
        if ($permit['files']) {
            $pairs = explode(',', $permit['files']);
            foreach ($pairs as $pair) {
                list($name, $path) = explode(':', $pair);
                $file_array[] = ['name' => $name, 'path' => $path];
            }
        }
        $permit['files'] = $file_array;
    }

    echo json_encode(['success' => true, 'permits' => $permits]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
