<?php
/* Generic PHP Functions. */
require_once "constants.php";
require_once "rate_limit.php";

/** Gets a new Mysqli Instance. */
function get_mysql_connection() {
    $conn = new mysqli($_ENV["DB_HOST"], $_ENV["DB_USER"], $_ENV["DB_PASSWORD"], $_ENV["DB_NAME"]);
    $conn->set_charset("utf8mb4");
    return $conn;
}

/** Make a call to BDPA API. */
function bdpa_fetch($endpoint, $method = "GET", $payload = null) {
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

    $ch = curl_init();
    curl_setopt_array($ch, $opt);

    $limiter = RateLimiter::getInstance();
    $limiter->await();
    $response = curl_exec($ch);
    curl_close($ch);

    return $response;
}

/** Used at the top of files to set php headers. */
function set_headers() {
    header('Content-type: application/json');
    header("Access-Control-Allow-Origin: *");
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
    return $stmt_result->fetch_object()->count == 0 ? false : true;
}

/** Outputs to the browser, logout the user. */
function force_logout_response() {
    echo json_encode(array("logout" => true));
}
?>