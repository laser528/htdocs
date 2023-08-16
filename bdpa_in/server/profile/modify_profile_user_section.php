<?php
/**
 * Alters a profiles user section
 * {
 *      user_id: <user_id>
 *      type: <experience|education|volunteering>
 *      section: <section>
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

$status = modify_profile_user_section($payload->user_id, $payload->type, $payload->section);
if ($status != "success") {
    echo json_encode(array("error" => $status));
    exit();
}

echo json_encode(array("success" => true));
?>