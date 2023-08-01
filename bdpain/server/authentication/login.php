<?php
require_once "../contrib/lib.php";
require_once "../contrib/api_request.php";
require_once "../users/lib.php";
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
    if (strpos($response->error, $username) != false) {
        remove_user_locally(null, $username);
    }
    echo $result;
    exit();
}

$security = generate_salt_and_key($password, $response->user->salt);

$result = fetch("users/{$response->user->user_id}/auth", "POST", array("key" => $security->key));
if(isset(json_decode($result)->error)) {
    echo $result;
    exit();
}

$conn = get_mysql_connection();
$stmt = $conn->prepare("DELETE from `force_logout` where user_id=?");
$stmt->bind_param("s", $response->user->user_id);
if(!$stmt->execute()) echo json_encode(array("error" => $stmt->error));
$stmt->close();

$conn = get_mysql_connection();
$stmt = $conn->prepare("SELECT url FROM `users` where user_id=?");
$stmt->bind_param("s", $response->user->user_id);
$stmt->execute();
$stmt_result = $stmt->get_result();
$row = $stmt_result->fetch_object();
$stmt->close();


echo json_encode(array("success" => true, "user" => array(
    "user_id" => $response->user->user_id,
    "username" => $username,
    "type" => $response->user->type,
    "email" => $response->user->email,
    "url" => $row->url ?: $response->user->user_id,
)));
?>