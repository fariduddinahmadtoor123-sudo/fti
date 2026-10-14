<?php
declare(strict_types=1);

require __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$data = fti_json_input();
$email = strtolower(trim((string)($data['email'] ?? '')));
$password = (string)($data['password'] ?? '');

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Email and password required']);
    exit;
}

try {
    $pdo = fti_pdo();
    $stmt = $pdo->prepare(
        'SELECT email, password_hash, name, role FROM users WHERE email = ? LIMIT 1'
    );
    $stmt->execute([$email]);
    $row = $stmt->fetch();

    if (!$row || !password_verify($password, $row['password_hash'])) {
        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'Invalid email or password.']);
        exit;
    }

    $token = bin2hex(random_bytes(32));
    $upd = $pdo->prepare('UPDATE users SET session_token = ? WHERE email = ?');
    $upd->execute([$token, $email]);

    echo json_encode([
        'ok' => true,
        'token' => $token,
        'user' => [
            'email' => $row['email'],
            'name' => $row['name'],
            'role' => $row['role'],
        ],
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Login service unavailable.']);
}
