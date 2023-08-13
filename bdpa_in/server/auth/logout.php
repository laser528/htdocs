<?php
/** 
 * Handles clean up tasks when a user logouts. 
 * Payload will look like
 * {
 *      user_id: <user_id>.
 * }
 */
require_once "../contrib/lib.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$payload = $data->payload;
$conn = get_mysql_connection();
$stmt = $conn->prepare("DELETE FROM `force_logout` WHERE user_id=?");
if (!$stmt) {
    echo json_encode(array("error" => $conn->error));
    exit();
}

$stmt->bind_param("s", $payload->user_id);
if(!$stmt->execute()) {
    echo json_encode(array("error" => $stmt->error));
    exit();
}

echo json_encode(array("success" => true));
$stmt->close();
?>