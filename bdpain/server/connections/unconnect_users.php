<?php
require_once "../contrib/lib.php";
require_once "../contrib/api_request.php";
/** Connects to users locally and send update to API. */

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

if (isset($data->user_id) && force_logout($data->user_id)) {
    force_logout_response();
    exit();
}

// Update API.
$result = fetch("users/{$data->user_id}/connections/{$data->connection_id}", "DELETE");
$response = json_decode($result);

if(isset($response->error)) {
    // TODO: Check response error. If user not found, remove user from local DB.
    echo json_encode($response);
    exit();
}

// Update Local DB.
$conn = get_mysql_connection();
$stmt = $conn->prepare("DELETE FROM `connections` where user_id=? AND connection_id=?");
$stmt->bind_param("ss", $data->user_id, $data->connection_id);
if(!$stmt->execute()) echo json_encode(array("error" => $stmt->error));

$conn = get_mysql_connection();
$stmt = $conn->prepare("DELETE FROM `connections` where user_id=? AND connection_id=?");
$stmt->bind_param("ss", $data->connection_id, $data->user_id, );
if(!$stmt->execute()) echo json_encode(array("error" => $stmt->error));
echo json_encode(array("success" => true));

$stmt->close();
?>