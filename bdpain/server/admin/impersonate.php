<?php
/** Determines if user is able to be impersonated. */
set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

// Get user status.
$result = fetch("users/{$data->payload->user_id}", "GET");
$response = json_decode($result);

if(isset($response->error)) {
    // TODO: Check response error. If user not found, remove user from local DB.
    echo json_encode($response);
    exit();
}

if ($response->user->type == "administrator") {
    echo json_encode(array("error" => "Can't impersonate a fellow admin!"));
    exit();
}

return json_encode($response);
?>