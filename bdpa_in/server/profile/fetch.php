<?php
/**
 * Will get an opportunity or all opportunities from the DB
 * Payload will look like
 * {
 *      url: <url>
 *      is_signed_in: <bool>
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

$user = get_user($payload->url);

if(!isset($user)) {
    echo json_encode(array("error" => "Profile Not Found!"));
    exit();
}

$about = get_profile_about($user->user_id) ?: "";
$skills = get_profile_skills($user->user_id);
$education = get_profile_user_section($user->user_id, "education");
$experience = get_profile_user_section($user->user_id, "experience");
$volunteering = get_profile_user_section($user->user_id, "volunteering");
$connections = get_connections_bfs(
    $user->user_id, 
    $payload->is_signed_in ? 3 : 2
);

echo json_encode(array("success" => true, "profile" => array(
    "user" => $user,
    "connections_count" => count($connections),
    "about" => $about,
    "education" => $education,
    "experience" => $experience,
    "volunteering" => $volunteering,
    "skills" => $skills,
)));
?>