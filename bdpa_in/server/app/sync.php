<?php
require_once "../contrib/lib.php";
require_once "lib.php";
/**
 * We use this file to keep the Apps DB in sync with the API.
 * The app is a DB first app, so if other apps change data on the API.
 * We need to keep ours in sync.
 */

// Begin

// Lets update the users first.
// Retrieve the last time users where updated in the DB.
$updatedAt = get_last_updated("users");

// The api limits to 100 results per call. It could be the case that 1000 users were updated.
// So loop to get all users updated after.
$users = array();
$after = null;
while(true) {
    $result = get_users_api($updatedAt, $after);
    $response = json_decode($result);

    if (isset($response->error)) {
        echo $result;
        exit();
    }
    
    $users = array_merge($users, $response->users);

    if (!count($response->users) || count($response->users) % 100 != 0) break;
    $after = end($response->users)->user_id;
}

// For each user lets add or update there info.
foreach($users as $user) {
    // Update there info.
    $status = modify_user_db($user);
    if ($status != "success") {
        echo json_encode(array("error" => $status));
        exit();
    }

    // Update there profile.
    // About
    $status = modify_user_profile_about($user);
    if ($status != "success") {
        echo json_encode(array("error" => $status));
        exit();
    }

    // Skills
    $status = modify_user_profile_skills($user);
    if ($status != "success") {
        echo json_encode(array("error" => $status));
        exit();
    }

    // Edu, Exp, Vol
    $status = modify_user_profile_sections($user);
    if ($status != "success") {
        echo json_encode(array("error" => $status));
        exit();
    }
}

// Update the users connections. We don't do it in the loop above,
// to ensure all users are valid in the table, so we dont hit any FK errors.
foreach($users as $user) {
    // Update their connections.
    $status = modify_user_connections($user);
    if ($status != "success") {
        echo json_encode(array("error" => $status));
        exit();
    }
}

// Now lets update all the opportunities in the DB.
$updatedAt = get_last_updated("opportunities");

// The api limits to 100 results per call. It could be the case that 1000 opportunities were updated.
// So loop to get all users updated after.
$opportunities = array();
$after = null;
while(true) {
    $result = get_opportunities_api($updatedAt, $after);
    $response = json_decode($result);

    if (isset($response->error)) {
        echo $result;
        exit();
    }
    
    $opportunities = array_merge($opportunities, $response->opportunities);

    if (!count($response->opportunities) || count($response->opportunities) % 100 != 0) break;
    $after = end($response->opportunities)->opportunity_id;
}

foreach($opportunities as $opportunity) {
    // Update the opportunity locally.
    $status = modify_opportunity_db($opportunity);
    if ($status != "success") {
        echo json_encode(array("error" => $status));
        exit();
    }
}

// END
$date = date('Y-m-d H:i:s');
echo json_encode(array("success" => "Last updated at {$date}"));
?>
