<?php
/**
 * Will Add a user to the API and DB.
 * Payload will look like
 * {
 *      username: <username>
 *      email: <email>
 *      password: <password>
 *      type: "inner"|"staff"|"administrator"
 * }
 */
require_once "../contrib/lib.php";
require_once "../contrib/users.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$payload = $data->payload;

$status = create_user($payload);
if ($status != "success") {
    echo json_encode(array("error" => $status));
    exit();
}

echo json_encode(array("success" => true));
?>