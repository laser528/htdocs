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
?>