<?php
require_once "../contrib/lib.php";
require_once "../contrib/api_request.php";
/* Create Opportunity or Opportunities. */

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

if (isset($data->user_id) && force_logout($data->user_id)) {
    force_logout_response();
    exit();
}

$result = fetch("opportunities", "POST", $data->payload);
echo $result;
?>