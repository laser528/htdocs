<?php
/**
 * Will get an opportunity or all opportunities from the DB
 * Payload will look like
 * {
 *      opportunity_id: <opportunity_id>
 * }
 */
require_once "../contrib/lib.php";
require_once "../contrib/users.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$payload = $data->payload;

if(force_logout($data->user_id)) {
    force_logout_response();
    exit();
}

$conn = get_mysql_connection();
if(isset($payload->opportunity_id)) {
    $stmt = $conn->prepare("SELECT * FROM `opportunities` WHERE opportunity_id=?");
    if (!$stmt) {
        echo json_encode(array("error" => $conn->error));
        exit();
    }

    $stmt->bind_param("s", $payload->opportunity_id);
    if(!$stmt->execute()) {
        echo json_encode(array("error" => $stmt->error));
        exit();
    }

    $stmt_result = $stmt->get_result();
    $row = $stmt_result->fetch_object();
    echo json_encode(array("success" => true, "opportunity" => $row));
} else {
    $stmt = $conn->prepare("SELECT * FROM `opportunities` ORDER BY updatedAt DESC");
    if (!$stmt) {
        echo json_encode(array("error" => $conn->error));
        exit();
    }

    if(!$stmt->execute()) {
        echo json_encode(array("error" => $stmt->error));
        exit();
    }

    $stmt_result = $stmt->get_result();
    $opportunities = array();
    while($row = $stmt_result->fetch_object()) $opportunities[] = $row;
    echo json_encode(array("success" => true, "opportunities" => $opportunities));
}

$stmt->close();
?>