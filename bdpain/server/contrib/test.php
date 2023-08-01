<?php
require_once "../contrib/lib.php";

$data = (object) array("user_id" => "64c7087e9b804e5c6e0af658");

if (isset($data->user_id) && force_logout($data->user_id)) {
    echo "Hi";
    force_logout_response();
    exit();
}

?>