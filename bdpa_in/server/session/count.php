<?php
/**
 * Get active viewer session counts for opportunities or profiles.
 * The payload should be of form.
 * {
 *      type: user|opportunity
 *      id: user/opportunity_id
 * } 
 */
require_once "../contrib/lib.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$payload = $data->payload;
$endpoint = "sessions/count-for/{$payload->type}/{$payload->id}";

echo bdpa_fetch($endpoint);
?>