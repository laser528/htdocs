<?php
require_once "../contrib/lib.php";
require_once "../contrib/api_request.php";
require_once "../users/lib.php";
/** Determines if user is able to be impersonated. */
set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

// Get user status.
$result = fetch("users/{$data->payload->user_id}", "GET");
$response = json_decode($result);

if(isset($response->error)) {
    if (strpos($response->error, $data->payload->user_id) != false) {
        remove_user_locally($data->payload->user_id, null);
    }
    echo $result;
    exit();
}

if ($response->user->type == "administrator") {
    echo json_encode(array("error" => "Can't impersonate a fellow admin!"));
    exit();
}

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