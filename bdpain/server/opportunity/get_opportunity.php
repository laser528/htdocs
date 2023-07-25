<?php
/* Gets an Opportunity or Opportunities. */
require_once "../contrib/lib.php";
require_once "../contrib/api_request.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

if (isset($data->user_id) && force_logout($data->user_id)) {
    force_logout_response();
    exit();
}

if (isset($data->opportunity_id)) {
    $result = fetch("opportunities/{$data->opportunity_id}", "GET");
    echo $result;
    exit();
}

$endpoint = "opportunities";

if (isset($data->after)) $endpoint.="?after={$data->after}";

$result = fetch($endpoint, "GET");
echo $result;
?>