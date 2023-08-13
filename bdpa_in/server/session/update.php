<?php
/**
 * Update a session for a view.
 * The payload should be of form.
 * {
 *      session_id: ID that was made upon creation.
 * }
 */
require_once "../contrib/lib.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$payload = $data->payload;

echo bdpa_fetch("sessions/{$payload->session_id}", "PATCH");
?>