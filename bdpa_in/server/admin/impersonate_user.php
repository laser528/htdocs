<?php
/**
 * Will Validate if the user can be impersonated. If so send
 * The users information.
 * {
 *      name_or_id: username|user_id.
 * }
 */
require_once "../contrib/lib.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$payload = $data->payload;

// Validity will be if user exist, and is not an admin.
$conn = get_mysql_connection();
$stmt = $conn->prepare("SELECT * FROM `users` where username=? OR user_id=?");
if (!$stmt) {
    echo json_encode(array("error" => $conn->error));
    exit();
}

$stmt->bind_param("ss", $payload->name_or_id, $payload->name_or_id);
if(!$stmt->execute()) {
    echo json_encode(array("error" => $stmt->error));
    exit();
}

$stmt_result = $stmt->get_result();
$row = $stmt_result->fetch_object();
$stmt->close();

$type = $row->type ?: null;
$user_id = $row->user_id ?: null;

if(!isset($type) || !isset($user_id) || $type == "administrator") {
    echo json_encode(array("error" => "Not a valid user"));
    exit();
}

echo json_encode(array(
    "success" => true,
    "user" => $row
));
?>