<?php
/**
 * Create a session for a view.
 * The payload should be of form.
 * {
 *      view: BDPA API View
 *      viewed_id: user/opportunity_id or null
 * }
 */
require_once "../contrib/lib.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

if(force_logout($data->user_id)) {
    force_logout_response();
    exit();
}

$payload = $data->payload;

echo bdpa_fetch("sessions", "POST", $payload);
?>