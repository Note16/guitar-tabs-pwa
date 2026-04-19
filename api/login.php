<?php
require __DIR__ . '/../../../private/auth.php';
header('Content-Type: application/json; charset=utf-8');

if (isset($_GET['logout'])) {
    logout();
}

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
    if (isLoggedIn()) {
        http_response_code(200);
        echo json_encode(["status" => "true", "user" => getLoggedInUser()]);
    } else {
        http_response_code(200);
        echo json_encode(["status" => "false"]);
    }
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (login($username, $password)) {
        http_response_code(200);
        echo json_encode(["status" => "true", "user" => getLoggedInUser()]);
    } else {
        http_response_code(401);
        echo json_encode(["status" => "false"]);
        echo json_encode(["error" => "Invalid username or password"]);
    }
}
