<?php
require_once "../contrib/lib.php";
/** On a successful logout, removes the user from the table. */
/** Login a user. */
set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$conn = get_mysql_connection();
$stmt = $conn->prepare("DELETE from `force_logout` where user_id=?");
$stmt->bind_param("s", $data->payload->user_id);
if(!$stmt->execute()) echo json_encode(array("error" => $stmt->error));
echo json_encode(array("success" => true));

$stmt->close();
?>