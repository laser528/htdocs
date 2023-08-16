<?php
/**
 * Unconnects two users. user_id <-> connection_id.
 * {
 *      user_id: <user_id>
 *      connection_id: <user_id>
 * }
 */
require_once "../contrib/lib.php";
require_once "lib.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$payload = $data->payload;

if(force_logout($data->user_id)) {
    force_logout_response();
    exit();
}

$result = bdpa_fetch("users/{$payload->user_id}/connections/{$payload->connection_id}", "DELETE");
$response = json_decode($result);
if(isset($response->error)) {
    echo $result;
    exit();
}

$result = bdpa_fetch("users/{$payload->connection_id}/connections/{$payload->user_id}", "DELETE");
$response = json_decode($result);
if(isset($response->error)) {
    echo $result;
    exit();
}

$conn = get_mysql_connection();
$stmt = $conn->prepare("DELETE from `connections` where user_id=? AND connection_id=?");

if (!$stmt) {
    echo json_encode(array("error" => $conn->error));
    exit();
}

$stmt->bind_param("ss", $payload->user_id, $payload->connection_id);

if(!$stmt->execute()) {
    echo json_encode(array("error" => $stmt->error));
    exit();
}

$stmt->close();

$stmt = $conn->prepare("DELETE from `connections` where user_id=? AND connection_id=?");

if (!$stmt) {
    echo json_encode(array("error" => $conn->error));
    exit();
}

$stmt->bind_param("ss", $payload->connection_id, $payload->user_id);

if(!$stmt->execute()) {
    echo json_encode(array("error" => $stmt->error));
    exit();
}

$stmt->close();

echo json_encode(array("success" => true));
?>