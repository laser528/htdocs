<?php
/**
 * Alters a profiles url
 * {
 *      url: <user_id>
 * }
 */
require_once "../contrib/lib.php";
require_once "lib.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$payload = $data->payload;

if(force_logout($data->user_id)) {
    force_logout_response();
    exit();
}

$status = modify_profile_url($payload->user_id, $payload->url);
if ($status != "success") {
    echo json_encode(array("error" => $status));
    exit();
}

echo json_encode(array("success" => true));
?>