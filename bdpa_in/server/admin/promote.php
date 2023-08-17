<?php
/**
 * Will Promote a User in the DB and API
 * Payload will look like
 * {
 *      name_or_id: <username>|<user_id>
 *      type: "staff"|"administrator"
 * }
 */
require_once "../contrib/lib.php";
require_once "../contrib/users.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$payload = $data->payload;

// When nothing is sent, output the feed of users.
if(!isset($payload->name_or_id)) {
    echo json_encode(array("success" => true, "users" => get_users_feed()));
    exit();
}

$user = get_user($payload->name_or_id);
$result = bdpa_fetch("users/{$user->user_id}", "PATCH", array(
        "type" => $payload->type
    ));
$response = json_decode($result);
if(isset($response->error)) {
    echo $result;
    exit();
}

$conn = get_mysql_connection();
$stmt = $conn->prepare("UPDATE `users` SET type=? WHERE user_id=?");
if (!$stmt) {
    echo json_encode(array("error" => $conn->error));
    exit();
}

$stmt->bind_param("ss", $payload->type, $user->user_id);
if(!$stmt->execute()) {
    echo json_encode(array("error" => $stmt->error));
    exit();
}

$stmt->close();
echo json_encode(array("success" => true));
?>