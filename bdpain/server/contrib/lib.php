<?php
/* Generic PHP Functions. */
require_once "./constants.php";

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
?>