<?php
/* Updates an Opportunity. */
require_once "../contrib/lib.php";
require_once "../contrib/api_request.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);
unset($data->payload->key);

if (isset($data->user_id) && force_logout($data->user_id)) {
    force_logout_response();
    exit();
}

$id = $data->payload->opportunity_id;
$creator = $data->payload->creator_id;
unset($data->payload->opportunity_id);
unset($data->payload->creator_id);
$result = fetch("opportunities/{$id}", "PATCH", $data->payload);
$response = json_decode($result);

if (isset($response->error)) {
    echo $result;
} else {
    echo fetch("opportunities/{$id}");
}
?>