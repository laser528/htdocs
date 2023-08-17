<?php
/**
 * Will add an opportunity to the API and DB
 * Payload will look like
 * {
 *      creator_id: <user_id>
 *      title: <title>
 *      contents: <contents>
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

$result = bdpa_fetch("opportunities", "POST", $payload);
$response = json_decode($result);
if(isset($response->error)) {
    echo $result;
    exit();
}

$opportunity = $response->opportunity;

$conn = get_mysql_connection();
$stmt = $conn->prepare("INSERT into `opportunities` (
    opportunity_id,
    creator_id,
    title,
    contents,
    views,
    createdAt,
    updatedAt
    ) VALUES(?, ?, ?, ?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE
            opportunity_id=VALUES(opportunity_id),
            creator_id=VALUES(creator_id),
            title=VALUES(title),
            contents=VALUES(contents),
            views=VALUES(views),
            createdAt=VALUES(createdAt),
            updatedAt=VALUES(updatedAt)
        ");
if (!$stmt) {
    echo json_encode(array("error" => $conn->error));
    exit();
}

$stmt->bind_param(
    "ssssiii", 
    $opportunity->opportunity_id,
    $opportunity->creator_id,
    $opportunity->title,
    $opportunity->contents,
    $opportunity->views,
    $opportunity->createdAt,
    $opportunity->updatedAt
);
if(!$stmt->execute()) {
    echo json_encode(array("error" => $stmt->error));
    exit();
}
$stmt->close();

echo json_encode(array("success" => true, "opportunity" => $opportunity));
?>