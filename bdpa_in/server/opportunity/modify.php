<?php
/**
 * Will modify an opportunity on the API and DB
 * Payload will look like
 * {
 *      opportunity_id: <opportunity_id>
 *      title: <title>
 *      contents: <contents>
 *      views: <increment>
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

$opportunity_id = $payload->opportunity_id;
unset($payload->opportunity_id);

$result = bdpa_fetch("opportunities/{$opportunity_id}", "PATCH", $payload);
$response = json_decode($result);
if(isset($response->error)) {
    echo $result;
    exit();
}

$result = bdpa_fetch("opportunities/{$opportunity_id}");
$response = json_decode($result);
if(isset($response->error)) {
    echo $result;
    exit();
}

$opportunity = $response->opportunity;

$conn = get_mysql_connection();
$stmt = $conn->prepare("UPDATE `opportunities` SET 
    title=?,
    contents=?,
    views=?
    WHERE opportunity_id=?");
if (!$stmt) {
    echo json_encode(array("error" => $conn->error));
    exit();
}

$stmt->bind_param("ssis", $opportunity->title, $opportunity->contents, $opportunity->views, $opportunity->opportunity_id);
if(!$stmt->execute()) {
    echo json_encode(array("error" => $stmt->error));
    exit();
}
$stmt->close();

echo json_encode(array("success" => true, "opportunity" => $opportunity));
?>