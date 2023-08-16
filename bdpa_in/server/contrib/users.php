<?php
/**
 * A Collection of functions related to users in the app.
 * So we can reuse in multiple surfaces.
 */
require_once "constants.php";
require_once "lib.php";

/**
 * @param string $password users password
 * @param hex_string $salt users salt. Must be a Hexadecimal string.
 */
function generate_salt_and_key($password, $user_salt = null) {
    $salt  = hex2bin($user_salt) ?: openssl_random_pseudo_bytes(SALT_BYTES);
    $key = hash_pbkdf2(KEY_ALGORITHM, $password, $salt, KEY_GEN_ITERATIONS, KEY_LENGTH_BYTES);

    return (object) array("salt" => bin2hex($salt), "key" => bin2hex($key));
}

function create_user($user_data) {
    $username = $user_data->username;
    $password = $user_data->password;
    $email = $user_data->email;
    $type = $user_data->type;

    $credentials = generate_salt_and_key($password);
    $result = bdpa_fetch("users", "POST", array(
        "username" => $username,
        "email" => $email,
        "type" => $type,
        "salt" => $credentials->salt,
        "key" => $credentials->key
    ));
    $response = json_decode($result);
    if(isset($response->error)) return $response->error;

    $user = $response->user;
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("INSERT INTO `users` (
        user_id, 
        username,
        email,
        salt,
        views,
        type,
        url,
        createdAt,
        updatedAt
        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    if(!$stmt) return $conn->error;
    
    $stmt->bind_param(
        "ssssissii", 
        $user->user_id,
        $user->username,
        $user->email,
        $user->salt,
        $user->views,
        $user->type,
        $user->user_id,
        $user->createdAt,
        $user->updatedAt
    );
    if(!$stmt->execute()) return $stmt->error;
    $stmt->close();
    return "success";
}

function get_user($name_or_id_or_email_or_url) {
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("SELECT * FROM `users` WHERE username=? or user_id=? or email=? or url=?");
    $stmt->bind_param("ssss", $name_or_id_or_email_or_url, $name_or_id_or_email_or_url, $name_or_id_or_email_or_url, $name_or_id_or_email_or_url);
    $stmt->execute();
    $stmt_result = $stmt->get_result();
    $row = $stmt_result->fetch_object();
    $stmt->close();
    return $row;
}

function get_users_feed() {
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("SELECT * FROM `users` ORDER BY updatedAt DESC");
    $stmt->execute();
    $stmt_result = $stmt->get_result();

    $rows = array();
    while($row = $stmt_result->fetch_object()) {
        $rows[] = $row;
    }
    $stmt->close();

    return $rows;
}
?>