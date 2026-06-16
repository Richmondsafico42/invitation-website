<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-Admin-PIN");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$dataFile = __DIR__ . '/data/rsvp.json';
$dataDir = dirname($dataFile);

// Create data directory if not exists
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Initialize json file if not exists or empty
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}

// Read existing data
$dataJson = @file_get_contents($dataFile);
$data = json_decode($dataJson, true);
if (!is_array($data)) {
    $data = [];
}

// Input helper
$input = json_decode(file_get_contents('php://input'), true) ?? [];
$action = $_GET['action'] ?? $input['action'] ?? '';
$pin = $_SERVER['HTTP_X_ADMIN_PIN'] ?? $_GET['pin'] ?? $input['pin'] ?? '';

$correctPin = '2026';

function checkPin($pin, $correctPin) {
    if (strval($pin) !== strval($correctPin)) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized. Invalid PIN."]);
        exit;
    }
}

if ($action === 'list') {
    checkPin($pin, $correctPin);
    echo json_encode($data);
    exit;
}

if ($action === 'add') {
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $attending = trim($input['attending'] ?? 'yes');
    $guests = intval($input['guests'] ?? 1);
    $message = trim($input['message'] ?? '');

    if (empty($name) || empty($email)) {
        http_response_code(400);
        echo json_encode(["error" => "Name and email are required."]);
        exit;
    }

    // Check if email already exists
    $existingIndex = -1;
    foreach ($data as $index => $rsvp) {
        if (strcasecmp($rsvp['email'], $email) === 0) {
            $existingIndex = $index;
            break;
        }
    }

    if ($existingIndex !== -1) {
        // Update existing RSVP
        $data[$existingIndex]['name'] = $name;
        $data[$existingIndex]['attending'] = $attending;
        $data[$existingIndex]['guests'] = $attending === 'no' ? 0 : $guests;
        $data[$existingIndex]['message'] = $message;
        $data[$existingIndex]['last_updated'] = date('Y-m-d H:i:s');
        $newRsvp = $data[$existingIndex];
    } else {
        // Add new RSVP
        $id = uniqid('rsvp_', true);
        $newRsvp = [
            'id' => $id,
            'name' => $name,
            'email' => $email,
            'attending' => $attending,
            'guests' => $attending === 'no' ? 0 : $guests,
            'message' => $message,
            'timestamp' => date('Y-m-d H:i:s')
        ];
        $data[] = $newRsvp;
    }

    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode(["success" => true, "data" => $newRsvp]);
    exit;
}

if ($action === 'update') {
    checkPin($pin, $correctPin);
    $id = $input['id'] ?? '';
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(["error" => "ID is required for update."]);
        exit;
    }

    $updated = false;
    foreach ($data as &$rsvp) {
        if ($rsvp['id'] === $id) {
            $rsvp['name'] = trim($input['name'] ?? $rsvp['name']);
            $rsvp['email'] = trim($input['email'] ?? $rsvp['email']);
            $rsvp['attending'] = trim($input['attending'] ?? $rsvp['attending']);
            $rsvp['guests'] = $rsvp['attending'] === 'no' ? 0 : intval($input['guests'] ?? $rsvp['guests']);
            $rsvp['message'] = trim($input['message'] ?? $rsvp['message']);
            $rsvp['last_updated'] = date('Y-m-d H:i:s');
            $updated = true;
            break;
        }
    }

    if (!$updated) {
        http_response_code(404);
        echo json_encode(["error" => "RSVP not found."]);
        exit;
    }

    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode(["success" => true]);
    exit;
}

if ($action === 'delete') {
    checkPin($pin, $correctPin);
    $id = $input['id'] ?? $_GET['id'] ?? '';
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(["error" => "ID is required for delete."]);
        exit;
    }

    $filteredData = [];
    $deleted = false;
    foreach ($data as $rsvp) {
        if ($rsvp['id'] === $id) {
            $deleted = true;
            continue;
        }
        $filteredData[] = $rsvp;
    }

    if (!$deleted) {
        http_response_code(404);
        echo json_encode(["error" => "RSVP not found."]);
        exit;
    }

    file_put_contents($dataFile, json_encode($filteredData, JSON_PRETTY_PRINT));
    echo json_encode(["success" => true]);
    exit;
}

if ($action === 'verify_pin') {
    if (strval($pin) === strval($correctPin)) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid PIN."]);
    }
    exit;
}

http_response_code(400);
echo json_encode(["error" => "Invalid action."]);
