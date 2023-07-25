<?php
/* Generic PHP Functions. */
require_once "constants.php";

/** Gets a new Mysqli Instance. */
function get_mysql_connection() {
    return new mysqli($_ENV["DB_HOST"], $_ENV["DB_USER"], $_ENV["DB_PASSWORD"], $_ENV["DB_NAME"]);
}

/**
 * @param string $password users password
 * @param hex_string $salt users salt. Must be a Hexadecimal string.
 */
function generate_salt_and_key($password, $user_salt = null) {
    $salt  = hex2bin($salt) ?: openssl_random_pseudo_bytes(SALT_BYTES);
    $key = hash_pbkdf2(KEY_ALGORITHM, $password, $salt, KEY_GEN_ITERATIONS, KEY_LENGTH_BYTES);

    return (object) array("salt" => bin2hex($salt), "key" => bin2hex($key));
}

/** Used at the top of files to set php headers. */
function set_headers() {
    header('Content-type: application/json');
    header("Access-Control-Allow-Origin: *");
}

/** Stores the result of a function call in-memory. Reduces amount of calls. Useful for Big DB queries. */
function memoize($func)
{
    return function () use ($func) {
        static $cache = [];

        $args = func_get_args();
        $key = serialize($args);
        $cached = true;

        if (!isset($cache[$key])) {
            $cache[$key] = $func(...$args);
            $cached = false;
        }

        return ['result' => $cache[$key], 'cached' => $cached];
    };
}

/** When true all responses from server will force user to logout. */
function force_logout($user_id) {
    if (!isset($user_id)) return false;
    
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("SELECT COUNT(*) as `count` FROM `force_logout` WHERE user_id=?");
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $stmt_result = $stmt->get_result();
    $stmt->close();
    return $stmt->fetch_object()->count == 0 ? false : true;
}

function force_logout_response() {
    echo json_encode(array("logout" => true));
}
?>