<?php
/**
 * Gives the connections of profile_id, given visibility of user_id
 * {
 *      profile_id: <user_id>
 *      user_id: <user_id>
 * }
 */
require_once "../contrib/lib.php";
require_once "../contrib/users.php";
require_once "lib.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$payload = $data->payload;

if(force_logout($data->user_id)) {
    force_logout_response();
    exit();
}

$connections_profile = get_connections_bfs($payload->profile_id, 3);
$connections_user = get_connections_bfs($payload->user_id, 3);

$result = array_intersect($connections_profile, $connections_user);

$users = array();

foreach($result as $id) {
    $user = get_user($id);
    if(isset($user)) $users[] = $user;
}

echo json_encode(array("success" => true, "users" => $users));
?>