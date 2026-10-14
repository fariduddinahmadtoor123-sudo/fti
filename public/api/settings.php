<?php
declare(strict_types=1);

require __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate');

try {
    $pdo = fti_pdo();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->prepare('SELECT setting_value FROM settings WHERE setting_key = ? LIMIT 1');
        $stmt->execute(['landing_open']);
        $row = $stmt->fetch();
        $open = $row ? $row['setting_value'] === '1' : true;
        echo json_encode(['ok' => true, 'landingOpen' => $open]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = fti_json_input();
        $admin = fti_require_admin($pdo, $data);
        if (!array_key_exists('landingOpen', $data)) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'landingOpen required']);
            exit;
        }

        $open = !empty($data['landingOpen']) ? '1' : '0';
        $stmt = $pdo->prepare(
            'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
        );
        $stmt->execute(['landing_open', $open]);

        echo json_encode([
            'ok' => true,
            'landingOpen' => $open === '1',
            'updatedBy' => $admin['email'],
        ]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Settings service unavailable.']);
}
