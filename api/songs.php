<?php
require __DIR__ . '/../../../private/db_tabs.php';
require __DIR__ . '/../../../private/auth.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT id, title, artist, content FROM songs");
        $data = $stmt->fetchAll();
        echo json_encode($data, JSON_PRETTY_PRINT);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error querying db"]);
    }
    exit;
}

if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

if ($method === 'POST') {
    if (empty($input['title']) || empty($input['artist']) || empty($input['content'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    try {
        $sql = "INSERT INTO songs (title, artist, content) VALUES (:title, :artist, :content)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':title'   => $input['title'],
            ':artist'  => $input['artist'],
            ':content' => $input['content']
        ]);
        http_response_code(201);
        echo json_encode(["message" => "Song added", "id" => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

if ($method === 'PUT') {
    if (empty($input['id']) || empty($input['title']) || empty($input['artist']) || empty($input['content'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing id, title, artist, or content"]);
        exit;
    }

    try {
        $sql = "UPDATE songs SET title = :title, artist = :artist, content = :content WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id'      => $input['id'],
            ':title'   => $input['title'],
            ':artist'  => $input['artist'],
            ':content' => $input['content']
        ]);

        echo json_encode(["message" => "Song updated successfully"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

if ($method === 'DELETE') {
    if (empty($input['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "ID required for deletion"]);
        exit;
    }

    try {
        $sql = "DELETE FROM songs WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $input['id']]);

        echo json_encode(["message" => "Song deleted successfully"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// If no methods match
http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
