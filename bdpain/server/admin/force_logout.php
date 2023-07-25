<?php
/* Forcibly log a user out of the system. */
require_once "../contrib/lib.php";
require_once "../contrib/api_request.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

// Get user status.
$result = fetch("users/{$data->payload->user_id}", "GET");
$response = json_decode($result);

if(isset($response->error)) {
    // TODO: Check response error. If user not found, remove user from local DB.
    echo json_encode($response);
    exit();
}

if ($response->user->type == "administrator") {
    echo json_encode(array("error" => "Can't force logout a fellow admin!"));
    exit();
}

$conn = get_mysql_connection();
$stmt = $conn->prepare("INSERT into `force_logout` (user_id) VALUES(?) ON DUPLICATE KEY UPDATE user_id=VALUES(user_id)");
$stmt->bind_param("s", $data->payload->user_id);
if(!$stmt->execute()) echo json_encode(array("error" => $stmt->error));
echo json_encode(array("success" => true));
?>