<?php
/**
 * Stores functions related to app.
 */
require_once "../contrib/lib.php";

/** Gets the last time the users or opportunities table was updated. */
function get_last_updated($table) {
    if (!isset($table)) throw new Exception("A table of name users or opportunity must be specified");

    $conn = get_mysql_connection();
    $stmt = $conn->prepare("SELECT MAX(updatedAt) as updatedAt FROM `{$table}`");
    $stmt->execute();
    $stmt_result = $stmt->get_result();
    // The result is stored in row.
    $row = $stmt_result->fetch_object();
    $stmt->close();

    return $row->updatedAt ?: null;
}

/**
 * Gets a feed of users from the api.
 */
function get_users_api($updatedAfter, $after) {
    $endpoint = "users";

    if (isset($updatedAfter) || isset($after)) {
        if (isset($updatedAfter) && !isset($after)) $endpoint.="?updatedAfter={$updatedAfter}";
        else if(!isset($updatedAfter) && isset($after)) $endpoint.="?after={$after}";
        else $endpoint.="?updatedAfter={$updatedAfter}&after={$after}";
    }

    return bdpa_fetch($endpoint, "GET");
}

function get_opportunities_api($updatedAfter, $after) {
    $endpoint = "opportunities";

    if (isset($updatedAfter) || isset($after)) {
        if (isset($updatedAfter) && !isset($after)) $endpoint.="?updatedAfter={$updatedAfter}";
        else if(!isset($updatedAfter) && isset($after)) $endpoint.="?after={$after}";
        else $endpoint.="?updatedAfter={$updatedAfter}&after={$after}";
    }

    return bdpa_fetch($endpoint, "GET");
}

function modify_user_db($user) {
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("INSERT into `users` (
        user_id, 
        username, 
        email, 
        salt, 
        views, 
        type, 
        createdAt, 
        updatedAt, 
        url 
        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
                username=VALUES(username), 
                email=VALUES(email),
                salt=VALUES(salt),
                views=VALUES(views),
                type=VALUES(type),
                createdAt=VALUES(createdAt),
                updatedAt=VALUES(updatedAt)
                ");
    if(!$stmt) return $conn->error;
    $stmt->bind_param(
        "ssssisiis", 
        $user->user_id, 
        $user->username, 
        $user->email, 
        $user->salt, 
        $user->views, 
        $user->type, 
        $user->createdAt, 
        $user->updatedAt, 
        $user->user_id
    );
    if(!$stmt->execute()) return $stmt->error;
    $stmt->close();
    return "success";
}

function modify_user_profile_about($user) {
    if(!isset($user->sections->about)) return "success";

    $conn = get_mysql_connection();
    $stmt = $conn->prepare("INSERT into `profile_about` (
        user_id, 
        about 
        ) VALUES(?, ?) 
            ON DUPLICATE KEY UPDATE 
                about=VALUES(about)
                ");
    if(!$stmt) return $conn->error;
    $stmt->bind_param("ss", $user->user_id, $user->sections->about);
    if(!$stmt->execute()) return $stmt->error;
    $stmt->close();
    return "success";
}

function modify_user_profile_skills($user) {
    if(!isset($user->sections->skills) || !count($user->sections->skills)) return "success";

    foreach($user->sections->skills as $skill) {
        $conn = get_mysql_connection();
        $stmt = $conn->prepare("INSERT into `profile_skills` (
            user_id, 
            skill 
            ) VALUES(?, ?) 
                ON DUPLICATE KEY UPDATE 
                    skill=VALUES(skill)
                    ");
        if(!$stmt) return $conn->error;
        $stmt->bind_param("ss", $user->user_id, $skill);
        if(!$stmt->execute()) return $stmt->error;
        $stmt->close();
    }

    return "success";
}

function modify_user_profile_sections($user) {
    foreach($user->sections->education as $section) {
        $edu = "education";
        $conn = get_mysql_connection();
        $stmt = $conn->prepare("INSERT into `profile_user_section` (
            user_id,
            type,
            title,
            location,
            description,
            startedAt,
            endedAt 
            ) VALUES(?, ?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                    title=VALUES(title),
                    location=VALUES(location),
                    description=VALUES(description),
                    startedAt=VALUES(startedAt),
                    endedAt=VALUES(endedAt)
                    ");
        if(!$stmt) return $conn->error;
        $stmt->bind_param(
            "sssssii", 
            $user->user_id, 
            $edu, 
            $section->title, 
            $section->location,
            $section->description,
            $section->startedAt,
            $section->endedAt,
        );
        if(!$stmt->execute()) return $stmt->error;
        $stmt->close();
    }

    foreach($user->sections->experience as $section) {
        $exp = "experience";
        $conn = get_mysql_connection();
        $stmt = $conn->prepare("INSERT into `profile_user_section` (
            user_id,
            type,
            title,
            location,
            description,
            startedAt,
            endedAt 
            ) VALUES(?, ?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                    title=VALUES(title),
                    location=VALUES(location),
                    description=VALUES(description),
                    startedAt=VALUES(startedAt),
                    endedAt=VALUES(endedAt)
                    ");
        if(!$stmt) return $conn->error;
        $stmt->bind_param(
            "sssssii", 
            $user->user_id, 
            $exp, 
            $section->title, 
            $section->location,
            $section->description,
            $section->startedAt,
            $section->endedAt,
        );
        if(!$stmt->execute()) return $stmt->error;
        $stmt->close();
    }

    foreach($user->sections->volunteering as $section) {
        $vol = "volunteering";
        $conn = get_mysql_connection();
        $stmt = $conn->prepare("INSERT into `profile_user_section` (
            user_id,
            type,
            title,
            location,
            description,
            startedAt,
            endedAt 
            ) VALUES(?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    title=VALUES(title),
                    location=VALUES(location),
                    description=VALUES(description),
                    startedAt=VALUES(startedAt),
                    endedAt=VALUES(endedAt)
                    ");
        if(!$stmt) return $conn->error;
        $stmt->bind_param(
            "sssssii", 
            $user->user_id, 
            $vol, 
            $section->title, 
            $section->location,
            $section->description,
            $section->startedAt,
            $section->endedAt,
        );
        if(!$stmt->execute()) return $stmt->error;
        $stmt->close();
    }

    return "success";
}

function modify_user_connections($user) {
    $after = null;
    $connections = array();

    while(true) {
        $endpoint = "users/{$user->user_id}/connections";
        if(isset($after)) $endpoint.="?after={$after}";
        
        $result = bdpa_fetch($endpoint);
        $response = json_decode($result);

        if (isset($response->error)) return $response->error;
        $connections = array_merge($connections, $response->connections);

        if (!count($response->connections) || count($response->connections) % 100 != 0) break;
        $after = end($response->connections);
    }

    foreach($connections as $connection) {
        $conn = get_mysql_connection();
        $stmt = $conn->prepare("INSERT into `connections` (
            user_id,
            connection_id
            ) VALUES(?, ?), (?, ?)
                ON DUPLICATE KEY UPDATE
                    user_id=VALUES(user_id),
                    connection_id=VALUES(connection_id)
        ");
        if(!$stmt) return $conn->error;
        $stmt->bind_param(
            "ssss",
            $user->user_id,
            $connection,

            // Connections are bi-directional so insert the reverse connection as well.
            $connection,
            $user->user_id
        );
        if(!$stmt->execute()) return $stmt->error;
        $stmt->close();
    }

    return "success";
}

function modify_opportunity_db($opportunity) {
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("INSERT into `opportunities` (
        opportunity_id, 
        creator_id, 
        title, 
        views, 
        contents, 
        createdAt, 
        updatedAt 
        ) VALUES(?, ?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
                title=VALUES(title), 
                views=VALUES(views),
                contents=VALUES(contents),
                createdAt=VALUES(createdAt),
                updatedAt=VALUES(updatedAt)
                ");
    if(!$stmt) return $conn->error;
    $stmt->bind_param(
        "sssisii", 
        $opportunity->opportunity_id,
        $opportunity->creator_id, 
        $opportunity->title, 
        $opportunity->views, 
        $opportunity->contents, 
        $opportunity->createdAt, 
        $opportunity->updatedAt, 
    );
    if(!$stmt->execute()) return $stmt->error;
    $stmt->close();
    return "success";
}

?>