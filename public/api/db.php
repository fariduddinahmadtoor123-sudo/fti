<?php
declare(strict_types=1);

function fti_pdo(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $pdo = new PDO(
        'mysql:host=localhost;dbname=u262659235_fti;charset=utf8mb4',
        'u262659235_fti_user',
        '0987@Asdfm',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    return $pdo;
}

function fti_json_input(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '', true);
    return is_array($data) ? $data : [];
}

function fti_request_token(?array $body = null): string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(\S+)/i', $header, $m)) {
        return trim($m[1]);
    }
    $alt = trim((string)($_SERVER['HTTP_X_FTI_TOKEN'] ?? ''));
    if ($alt !== '') {
        return $alt;
    }
    if (is_array($body) && isset($body['token'])) {
        return trim((string)$body['token']);
    }
    return '';
}

function fti_require_admin(PDO $pdo, ?array $body = null): array
{
    $token = fti_request_token($body);
    if ($token === '' || str_starts_with($token, 'local-')) {
        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'Please log out and log in again, then retry.']);
        exit;
    }

    $stmt = $pdo->prepare(
        'SELECT email, name, role FROM users WHERE session_token = ? AND role = ? LIMIT 1'
    );
    $stmt->execute([$token, 'admin']);
    $row = $stmt->fetch();
    if (!$row) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'Admin session expired. Log in again.']);
        exit;
    }

    return $row;
}
