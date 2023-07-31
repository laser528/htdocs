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

function remove_user_locally($user_id, $username = null) {
    if (!isset($user_id) && !isset($username)) throw new Exception("User ID must be defined");

    $col = isset($user_id) ? "user_id" : "username";
    $val = $user_id ?: $username;

    $conn = get_mysql_connection();
    $stmt = $conn->prepare("DELETE from `users` where {$col}=?");
    $stmt->bind_param("s", $val);
    if(!$stmt->execute()) echo json_encode(array("error" => $stmt->error));
    return json_encode(array("success" => true));
}

function remove_user($user_id) {
    if (!isset($user_id)) throw new Exception("User ID must be defined");

    $result = fetch("users/{$user_id}", "DELETE");
    $response = json_decode($result);

    if (isset($response->error)) return json_encode($response);

    return remove_user_locally($user_id);
}

function update_user($payload) {
    if (!isset($payload) || !isset($payload->user_id)) throw new Exception("User ID must be defined");

    $user_id = $payload->user_id;
    unset($payload->user_id);
    $result = fetch("users/{$payload->user_id}", "PATCH", $payload);
    return $result;
}

function create_user($payload) {
    if(!isset($payload) || !isset($payload->username)) throw new Exception("Username must be defined");

    $api_salt = openssl_random_pseudo_bytes(16);
    $key = hash_pbkdf2("sha256", $payload->password, $api_salt, 100000, 64);

    $api_salt = bin2hex($api_salt);
    $key = bin2hex($key);

    $api_result = fetch("users", "POST", array(
        "username" => $payload->username,
        "email" => $payload->email,
        "salt" => $api_salt,
        "key" => $key,
        "type" => $payload->type,
    ));

    $response = json_decode($api_result);
    if (isset($response->error)) return $api_result;

    $user = $response->user;

    $conn = get_mysql_connection();
    $stmt = $conn->prepare("INSERT INTO `users` (user_id, last_api_updated, url) VALUES(?,?,?)");
    $stmt->bind_param("sss", $user->user_id, $user->updatedAt, $user->user_id);
    
    if(!$stmt->execute()) return json_encode(array("error" => $stmt->error));
    else return $api_result;

    $stmt->close();
}
?>