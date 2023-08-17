<?php
/**
 * Will add a user to the forgot password table.
 * Payload will look like
 * {
 *      email: <email>
 * }
 */
require_once "../contrib/lib.php";
require_once "../contrib/users.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$payload = $data->payload;
$user = get_user($payload->email);

if(!isset($user)) {
    echo json_encode(array("error" => "User not found"));
    exit();
}

$token = bin2hex(openssl_random_pseudo_bytes(16));
$conn = get_mysql_connection();
$stmt = $conn->prepare("INSERT into `forgot_password` (
    user_id, 
    token
    ) VALUES(?, ?) 
        ON DUPLICATE KEY UPDATE
            user_id=VALUES(user_id),
            token=VALUES(token)
        ");
if (!$stmt) {
    echo json_encode(array("error" => $conn->error));
    exit();
}

$stmt->bind_param("ss", $user->user_id, $token);
if(!$stmt->execute()) {
    echo json_encode(array("error" => $stmt->error));
    exit();
}
$stmt->close();

echo json_encode(array("success" => true, "security" => $token));
?>