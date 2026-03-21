<?php
/**********************************************************
 * SECURE DELETE PERMIT API - UNIVERSITY PERMIT SYSTEM
 **********************************************************/
header('Content-Type: application/json');
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Missing permit ID']);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Get file paths before deleting records
    $stmt = $pdo->prepare("SELECT file_path FROM permit_files WHERE permit_id = ?");
    $stmt->execute([$id]);
    $files = $stmt->fetchAll();

    // 2. Delete permit files from disk
    $upload_dir = '../../uploads/';
    foreach ($files as $file) {
        $path = $upload_dir . $file['file_path'];
        if (file_exists($path)) {
            unlink($path);
        }
    }

    // 3. Delete record from database (ON DELETE CASCADE will handle permit_files)
    $stmt = $pdo->prepare("DELETE FROM permits WHERE id = ?");
    $stmt->execute([$id]);

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Permit and associated files deleted successfully!']);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
