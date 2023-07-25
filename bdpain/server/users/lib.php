<?php
/** Common functions related to users. */
require_once "../contrib/lib.php";
require_once "../contrib/api_request.php";

/** Gets a feed of users. */
function get_users($updatedAfter, $after) {
    $endpoint = "users";

    if (isset($updatedAfter) || isset($after)) {
        if (isset($updatedAfter) && !isset($after)) $endpoint.="?updatedAfter={$updatedAfter}";
        else if(!isset($updatedAfter) && isset($after)) $endpoint.="?after={$after}";
        else $endpoint.="?updatedAfter={$updatedAfter}&after={$after}";
    }

    return fetch($endpoint, "GET");
}

/** Gets a users data. */
function get_user($user_id, $username) {
    if (!isset($user_id) && !isset($username)) throw new Exception("User Name or ID must be provided");
    $extension = $user_id ?? $username;
    
    return fetch("users/{$extension}", "GET");
}

function remove_user($user_id) {
    if (!isset($user_id)) throw new Exception("User ID must be defined");

    $result = fetch("users/{$user_id}", "DELETE");
    $response = json_decode($result);

    if (isset($response->error)) return json_encode($response);

    $conn = get_mysql_connection();
    $stmt = $conn->prepare("DELETE from `users` where user_id=?");
    $stmt->bind_param("s", $user_id);
    if(!$stmt->execute()) echo json_encode(array("error" => $stmt->error));
    return json_encode(array("success" => true));
}

function update_user($payload) {
    if (!isset($payload) || !isset($payload->user_id)) throw new Exception("User ID must be defined");

    $user_id = $payload->user_id;
    unset($payload->user_id);
    $result = fetch("users/{$payload->user_id}", "PATCH", $payload);
    return $result;
}
?>