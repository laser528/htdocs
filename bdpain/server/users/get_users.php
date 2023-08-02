<?php
require_once "../contrib/lib.php";
require_once "../contrib/api_request.php";
require_once "lib.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

echo get_users(null, $data->payload->after);
?>