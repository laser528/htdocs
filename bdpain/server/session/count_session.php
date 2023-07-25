<?php
/* Get the total active sessions for a profile or opportunity. */
require_once "../contrib/lib.php";
require_once "../contrib/api_request.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

if (isset($data->user_id) && force_logout($data->user_id)) {
    force_logout_response();
    exit();
}

if (isset($data->payload->user_id)) {
    $result = fetch("sessions/count-for/user/{$data->payload->user_id}", "GET");
    echo $result;
    exit();
}

if (isset($data->payload->opportunity_id)) {
    $result = fetch("sessions/count-for/opportunity/{$data->payload->opportunity_id}", "GET");
    echo $result;
    exit();
}

echo json_encode(array("error" => "Please supply a user or opportunity id"));
?>