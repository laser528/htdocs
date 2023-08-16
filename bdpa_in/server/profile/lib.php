<?php
/**
 * A Collection of functions related to users profile in the app.
 */
require_once "../contrib/lib.php";
require_once "../contrib/users.php";

function get_profile_about($user_id) {
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("SELECT about FROM `profile_about` WHERE user_id=?");
    if (!$stmt) return $conn->error;

    $stmt->bind_param("s", $user_id);
    if(!$stmt->execute()) return $stmt->error;

    $stmt_result = $stmt->get_result();
    $row = $stmt_result->fetch_object();
    $stmt->close();

    return $row->about;
}

function get_profile_skills($user_id) {
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("SELECT skill FROM `profile_skills` WHERE user_id=?");
    if (!$stmt) return $conn->error;

    $stmt->bind_param("s", $user_id);
    if(!$stmt->execute()) return $stmt->error;

    $stmt_result = $stmt->get_result();

    $skills = array();
    while($row = $stmt_result->fetch_object()) $skills[] = $row->skill;
    $stmt->close();

    return $skills;
}

function get_profile_user_section($user_id, $type) {
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("SELECT title, location, description, startedAt, endedAt FROM `profile_user_section` WHERE user_id=? and type=?");
    if (!$stmt) return $conn->error;

    $stmt->bind_param("ss", $user_id, $type);
    if(!$stmt->execute()) return $stmt->error;

    $stmt_result = $stmt->get_result();

    $section = array();
    while($row = $stmt_result->fetch_object()) $section[] = $row;
    $stmt->close();

    return $section;
}

function modify_profile_about($user_id, $about) {
    $result = bdpa_fetch("users/{$user_id}", "POST", array(
        "sections" => array(
            "about" => $about
        )
    ));

    $response = json_decode($result);
    if(isset($response->error)) return $response->error;
    
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("INSERT into `profile_about` (user_id, about) VALUES (?,?)
        ON DUPLICATE KEY UPDATE
            user_id=VALUES(user_id),
            about=VALUES(about)
        ");
    if (!$stmt) return $conn->error;

    $stmt->bind_param("ss", $user_id, $about);
    if(!$stmt->execute()) return $stmt->error;
    $stmt->close();

    return "success";
}

function modify_profile_skills($user_id, $skills) {
    $result = bdpa_fetch("users/{$user_id}", "POST", array(
        "sections" => array(
            "skills" => $skills
        )
    ));

    $response = json_decode($result);
    if(isset($response->error)) return $response->error;
    
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("DELETE from `profile_skills` WHERE user_id=?");
    if (!$stmt) return $conn->error;

    $stmt->bind_param("s", $user_id);
    if(!$stmt->execute()) return $stmt->error;
    $stmt->close();

    foreach($skills as $skill) {
        $stmt = $conn->prepare("INSERT into `profile_skills` (user_id, skill) VALUES(?,?) ON DUPLICATE KEY UPDATE user_id=VALUES(user_id), skill=VALUES(skill)");
        if (!$stmt) return $conn->error;

        $stmt->bind_param("ss", $user_id, $skill);
        if(!$stmt->execute()) return $stmt->error;
        $stmt->close();
    }

    return "success";
}

function modify_profile_user_section($user_id, $type, $section) {
    $result = bdpa_fetch("users/{$user_id}", "POST", array(
        "sections" => array(
            $type => $section
        )
    ));

    $response = json_decode($result);
    if(isset($response->error)) return $response->error;
    
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("DELETE from `profile_user_section` WHERE user_id=? and type=?");
    if (!$stmt) return $conn->error;

    $stmt->bind_param("ss", $user_id, $type);
    if(!$stmt->execute()) return $stmt->error;
    $stmt->close();

    foreach($section as $section_entry) {
        $stmt = $conn->prepare("INSERT into `profile_user_section` (
            user_id, 
            type, 
            title, 
            location, 
            description, 
            startedAt, 
            endedAt) VALUES(?,?,?,?,?,?,?) 
                ON DUPLICATE KEY UPDATE 
                    user_id=VALUES(user_id), 
                    type=VALUES(type),
                    title=VALUES(title),
                    location=VALUES(location),
                    description=VALUES(description),
                    startedAt=VALUES(startedAt),
                    endedAt=VALUES(endedAt)
                    ");
        if (!$stmt) return $conn->error;

        $stmt->bind_param(
            "sssssii", 
            $user_id, 
            $type,
            $section_entry->title,
            $section_entry->location,
            $section_entry->description,
            $section_entry->startedAt,
            $section_entry->endedAt
        );
        if(!$stmt->execute()) return $stmt->error;
        $stmt->close();
    }

    return "success";
}

function modify_profile_url($user_id, $url) {
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("UPDATE `users` SET url=? WHERE user_id=?");
    if (!$stmt) return $conn->error;

    $stmt->bind_param("ss", $url, $user_id);
    if(!$stmt->execute()) return $stmt->error;
    $stmt->close();

    return "success";
}

function get_connections($user_id) {
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("SELECT connection_id FROM `connections` WHERE user_id=?");
    if (!$stmt) return $conn->error;

    $stmt->bind_param("s", $user_id);
    if(!$stmt->execute()) return $stmt->error;

    $stmt_result = $stmt->get_result();

    $connections = array();
    while ($row = $stmt_result->fetch_object()) $connections[] = $row->connection_id;
    $stmt->close();

    return $connections;
}

function get_connections_bfs($user_id, $level = 1) {
    if(!$level || !$user_id) return [];
    
    $queue = new SplQueue();
    $result = [];

    $queue->enqueue($user_id);
    $queue->enqueue(null);

    while(!$queue->isEmpty()) {
        $node = $queue->dequeue();
        if (isset($node)) {
            $connections = get_connections($node);
            if (!$connections || !count($connections)) continue;

            foreach ($connections as $connection) {
                $result[] = $connection;
                $queue->enqueue($connection);
            }
        } else {
            $level--;
            if (!$level) break;
            $queue->enqueue(null);
        }
    }

    return $result;
}
?>