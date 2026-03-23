<?php
/**********************************************************
 * SECURE PERMIT SUBMISSION API - UNIVERSITY PERMIT SYSTEM
 **********************************************************/
header('Content-Type: application/json');
require_once '../config/db.php';

// In a real setup, we'd check for a session token here
$student_id = $_POST['student_id'] ?? null;
$permit_type = $_POST['permit_type'] ?? null;
$event_date = $_POST['event_date'] ?? null;
$purpose = $_POST['purpose'] ?? null;

if (!$student_id || !$permit_type || !$event_date || !$purpose) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Insert the permit record
    $stmt = $pdo->prepare("INSERT INTO permits (student_id, permit_type, event_date, purpose) VALUES (?, ?, ?, ?)");
    $stmt->execute([$student_id, $permit_type, $event_date, $purpose]);
    $permit_id = $pdo->lastInsertId();

    // 2. Handle file uploads
    $upload_dir = '../../uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    $files_to_upload = [
        'request_form' => $_FILES['request_form'] ?? null,
        'student_id'   => $_FILES['student_id_file'] ?? null,
        'endorsement'  => $_FILES['endorsement'] ?? null
    ];

    $allowed_extensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];

    foreach ($files_to_upload as $type => $file) {
        if ($file && $file['error'] === UPLOAD_ERR_OK) {
            $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            if (!in_array($ext, $allowed_extensions)) {
                throw new Exception("Invalid file type: " . $file['name']);
            }

            // Create a unique name for the file to prevent overwriting
            $unique_name = $permit_id . "_" . $type . "_" . time() . "." . $ext;
            $target_path = $upload_dir . $unique_name;

            if (move_uploaded_file($file['tmp_name'], $target_path)) {
                $stmt = $pdo->prepare("INSERT INTO permit_files (permit_id, file_type, file_name, file_path) VALUES (?, ?, ?, ?)");
                $stmt->execute([$permit_id, $type, $file['name'], $unique_name]);
            } else {
                throw new Exception("Failed to upload " . $file['name']);
            }
        } else {
            throw new Exception("File " . $type . " is missing or has error.");
        }
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Permit submitted successfully!']);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
