<?php
/* Make calls to BDPA API. */
require_once "./constants.php";
require_once "./rate_limit.php";

function fetch($endpoint, $method ="GET", $payload = null) {
    $opt = array(
        CURLOPT_URL => "{$_ENV['API_URL']}/{$_ENV['API_VERSION']}/{$endpoint}",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Content-type: application/json",
            "Accept: application/json",
            "Access-Control-Allow-Origin: *",
            "Access-Control-Allow-Credentials: true",
            "Authorization: bearer {$_ENV['API_KEY']}",
        ],
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_SSL_VERIFYPEER => 0,
    );

    if ($payload) $opt[CURLOPT_POSTFIELDS] = json_encode($payload);

    echo print_r($opt);

    $ch = curl_init();
    curl_setopt_array($ch, $opt);

    $limiter = RateLimiter::getInstance();
    $limiter->await();
    $response = curl_exec($ch);
    curl_close($ch);

    return $response;
}

?>