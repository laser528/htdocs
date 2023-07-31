<?php
/** We use this to refresh our local database. */
require_once "../contrib/lib.php";
require_once "../contrib/api_request.php";
require_once "../users/lib.php";
require_once "../connections/lib.php";

set_headers();

function getIds($user) {
    return $user->user_id;
}

// First remove all old users.
$users = array();
$after = null;
while(true) {
    $result = get_users(null, $after);
    $response = json_decode($result);

    if (isset($response->error)) exit();
    $users = array_merge($users, $response->users);

    if (!count($response->users) || count($response->users) % 100 != 0) break;
    $after = end($response->users)->user_id;
}

if (!count($users)) {
    exit();
}

$users = array_map('getIds', $users);
$conn = get_mysql_connection();
$params = rtrim(str_repeat("?,", count($users)), ",");
$stmt = $conn->prepare("DELETE from `users` WHERE user_id NOT IN ({$params})");
$stmt->bind_param(str_repeat("s", count($users)), ...$users);
if(!$stmt->execute()) echo json_encode(array("error" => $stmt->error));
$stmt->close();

// Get all updated users.
$conn = get_mysql_connection();
$stmt = $conn->prepare("SELECT MAX(last_api_updated) as updatedAt FROM `users`");
$stmt->execute();
$stmt_result = $stmt->get_result();
$row = $stmt_result->fetch_object();
$stmt->close();

$updatedAt = $row->updatedAt ?: null;
$users = array();
$after = null;
while (true) {
    $result = get_users($updatedAt, $after);
    $response = json_decode($result);

    if (isset($response->error)) exit();
    $users = array_merge($users, $response->users);

    if (!count($response->users) || count($response->users) % 100 != 0) break;
    $after = end($response->users)->user_id;
}

foreach($users as $user) {
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("INSERT into `users` (user_id, username, email, url, last_api_updated) VALUES(?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE user_id=VALUES(user_id), username=VALUES(username), email=VALUES(email), last_api_updated=VALUES(last_api_updated), url=VALUES(url)");
    $stmt->bind_param("ssssi", $user->user_id, $user->username, $user->email, $user->user_id, $user->updatedAt);
    if(!$stmt->execute()) echo $stmt->error;
    $stmt->close();
}

foreach($users as $user){
    foreach(get_connections_api($user->user_id) as $connection) {
        $conn_2 = get_mysql_connection();
        $stmt_2 = $conn_2->prepare("INSERT into `connections` (user_id, connection_id) VALUES(?, ?) ON DUPLICATE KEY UPDATE user_id=VALUES(user_id), connection_id=VALUES(connection_id)");
        $stmt_2->bind_param("ss", $user->user_id, $connection);
        if(!$stmt_2->execute()) echo $stmt_2->error;
        $stmt_2->close();

        $conn_2 = get_mysql_connection();
        $stmt_2 = $conn_2->prepare("INSERT into `connections` (user_id, connection_id) VALUES(?, ?) ON DUPLICATE KEY UPDATE user_id=VALUES(user_id), connection_id=VALUES(connection_id)");
        $stmt_2->bind_param("ss", $connection, $user->user_id);
        if(!$stmt_2->execute()) echo $stmt_2->error;
        $stmt_2->close();
    }
}

$date = date('Y-m-d H:i:s');
echo json_encode(array("success" => "App updated at {$date}"))
?>