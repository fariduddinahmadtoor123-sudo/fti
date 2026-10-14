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

function fti_bearer_token(): string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(\S+)/i', $header, $m)) {
        return trim($m[1]);
    }
    $alt = $_SERVER['HTTP_X_FTI_TOKEN'] ?? '';
    return trim((string)$alt);
}

function fti_require_admin(PDO $pdo): array
{
    $token = fti_bearer_token();
    if ($token === '') {
        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'Missing auth token']);
        exit;
    }

    $stmt = $pdo->prepare(
        'SELECT email, name, role FROM users WHERE session_token = ? AND role = ? LIMIT 1'
    );
    $stmt->execute([$token, 'admin']);
    $row = $stmt->fetch();
    if (!$row) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'Admin access required']);
        exit;
    }

    return $row;
}
