<?php
/**
 * Change a users password.
 * Payload will look like
 * {
 *      token: <token>
 *      password: <password>
 * }
 */
require_once "../contrib/lib.php";
require_once "../contrib/users.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$payload = $data->payload;

$conn = get_mysql_connection();
$stmt = $conn->prepare("SELECT `user_id` FROM `forgot_password` WHERE token=?");
if (!$stmt) {
    echo json_encode(array("error" => $conn->error));
    exit();
}

$stmt->bind_param("s", $payload->token);
if(!$stmt->execute()) {
    echo json_encode(array("error" => $stmt->error));
    exit();
}

$stmt_result = $stmt->get_result();
$row = $stmt_result->fetch_object();
$stmt->close();

if(!isset($row->user_id)) {
    echo json_encode(array("error" => "Invalid token"));
    exit();
}

$credentials = generate_salt_and_key($payload->password);

$result = bdpa_fetch("users/{$row->user_id}", "PATCH", array(
        "salt" => $credentials->salt,
        "key" => $credentials->key,
    ));
$response = json_decode($result);
if(isset($response->error)) {
    echo $result;
    exit();
}

$conn = get_mysql_connection();
$stmt = $conn->prepare("UPDATE `users` SET salt=? WHERE user_id=?");
if (!$stmt) {
    echo json_encode(array("error" => $conn->error));
    exit();
}

$stmt->bind_param("ss", $credentials->salt, $row->user_id);
if(!$stmt->execute()) {
    echo json_encode(array("error" => $stmt->error));
    exit();
}

$stmt->close();

$stmt = $conn->prepare("DELETE from `forgot_password` WHERE token=?");
if (!$stmt) {
    echo json_encode(array("error" => $conn->error));
    exit();
}

$stmt->bind_param("s", $payload->token);
if(!$stmt->execute()) {
    echo json_encode(array("error" => $stmt->error));
    exit();
}

$stmt->close();
echo json_encode(array("success" => true));
?>