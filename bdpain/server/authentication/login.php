<?php
require_once "../contrib/lib.php";
require_once "../contrib/api_request.php";
/** Login a user. */
set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$username = $data->payload->username;
$password = $data->payload->password;

// Check if user exists?
$result = fetch("users/{$username}", "GET");
$response = json_decode($result);

if(isset($response->error)) {
    // TODO: Check response error. If user not found, remove user from local DB.
    echo json_encode($response);
    exit();
}

$security = get_salt_and_key($password, $response->user->salt);

$result = fetch("users/{$response->user->user_id}/auth", "POST", array("key" => $security->key));
echo $result;
?>