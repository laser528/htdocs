<?php
require_once "../contrib/lib.php";
require_once "../contrib/api_request.php";
require_once "../users/lib.php";
set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

if (isset($data->payload->username) && isset($data->payload->email)) {
    $result = fetch("users/{$data->payload->username}", "GET");
    $response = json_decode($result);

    if(isset($response->error)) {
        if (strpos($response->error, $data->payload->username) != false) {
            remove_user_locally(null, $data->payload->username);
        }
        echo json_encode($response);
        exit();
    } else if($response->user->email != $data->payload->email) {
        echo json_encode(array("error" => "Wrong Credentials"));
        exit();
    }

    $token = substr(hash('sha512', mt_rand() . microtime()), 0, 50);
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("INSERT into `forgot_password` (security, user_id) VALUES(?, ?)");
    $stmt->bind_param("ss", $token, $response->user->user_id);
    echo json_encode(array("success" => true, "security" => $token));

    $stmt->close();
    exit();
}
else if(isset($data->payload->security)) {
    $conn = get_mysql_connection();
    $stmt = $conn->prepare("SELECT user_id from `forgot_password` where security=?");
    $stmt->bind_param("s", $data->payload->security);
    $stmt->execute();
    $stmt_result = $stmt->get_result();
    $row = $stmt_result->fetch_object();
    $stmt->close();
    
    if (!isset($row->user_id)) {
        echo json_encode(array("error" => "No user found"));
        exit();
    }

    $encryption = generate_salt_and_key($data->payload->password);
    $result = fetch("users/{$row->user_id}", "PATCH", array("salt" => $encryption->salt, "key" => $encryption->key));
    echo $result;
}
else {
    echo json_encode(array("error" => "Something went wrong!"));
}
?>