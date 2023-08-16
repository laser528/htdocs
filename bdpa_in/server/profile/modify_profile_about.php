<?php
/**
 * Alters a users about section
 * {
 *      user_id: <user_id>
 *      about: <about>
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

$status = modify_profile_about($payload->user_id, $payload->about);
if ($status != "success") {
    echo json_encode(array("error" => $status));
    exit();
}

echo json_encode(array("success" => true));
?>