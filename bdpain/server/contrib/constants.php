<?php
/** Holds constants used server wide. */

# Load env variables.
$environment_path = realpath(__DIR__."/../../.env");
$file_open = fopen($environment_path, 'r');

if($file_open) {
    while($line = fgets($file_open)) {
        [$key, $value] = explode("=", $line);
        $_ENV[$key] = trim($value);
    }
    fclose($file_open);
}

# Encryption constants
const SALT_BYTES = 16;
const KEY_LENGTH_BYTES = 64;
const KEY_GEN_ITERATIONS = 100000;
const KEY_ALGORITHM = "sha256";
?>