<?php
/**
 * Alters a profiles header
 * {
 *      url: <user_id>
 *      cover_photo: <image file>
 * }
 */
require_once "../contrib/lib.php";
require_once "lib.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$payload = $data->payload;

$status = modify_profile_url($payload->user_id, $payload->url);
if ($status != "success") {
    echo json_encode(array("error" => $status));
    exit();
}

// Add code for cover photo modification.

echo json_encode(array("success" => true));
?>