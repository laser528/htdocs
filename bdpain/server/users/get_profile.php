<?php
require_once "../contrib/lib.php";
require_once "../contrib/api_request.php";
require_once "lib.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

if (isset($data->user_id) && force_logout($data->user_id)) {
    force_logout_response();
    exit();
}

$url = $data->payload->url;

$conn = get_mysql_connection();
$stmt = $conn->prepare("SELECT user_id FROM `users` WHERE url=?");
$stmt->bind_param("s", $url);
$stmt->execute();
$stmt_result = $stmt->get_result();
$row = $stmt_result->fetch_object();
$stmt->close();

if (!isset($row->user_id)) {
    echo array("error" => "user not found");
}

echo get_user($row->user_id, null);
?>