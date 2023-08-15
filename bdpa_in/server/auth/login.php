<?php
/**
 * Will authenticate a user.
 * Payload will look like
 * {
 *      username: <username>
 *      password: <password>
 * }
 */
require_once "../contrib/lib.php";
require_once "../contrib/users.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$payload = $data->payload;
$user = get_user($payload->username);

if(!isset($user)) {
    echo json_encode(array("error" => "User not found"));
    exit();
}

$credentials = generate_salt_and_key($payload->password, $user->salt);
$result = bdpa_fetch("users/{$user->user_id}/auth", "POST", array(
    "key" => $credentials->key
));

$response = json_decode($result);
if(isset($response->error)) {
    echo $result;
    exit();
}

echo json_encode(array("success" => true, "user" => $user));
?>