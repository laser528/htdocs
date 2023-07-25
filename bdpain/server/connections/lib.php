<?php
/** Common functions related to connections. */
require_once "../contrib/lib.php";
require_once "../contrib/api_request.php";

/** Helper gets all of a users connections from DB. */
function get_connections_sql($user_id) {
    if (!$user_id) return [];
    $result = array();

    $conn = get_mysql_connection();
    $stmt = $conn->prepare("SELECT connection_id FROM `connections` where user_id=?");
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $stmt_result = $stmt->get_result();
    while ($row = $stmt_result->fetch_object()) array_push($result, $row->connection_id);

    $stmt->close();
    return $result;
}

/** Helper gets all of a users connections from API. */
function get_connections_api($user_id) {
    if (!$user_id) return [];
    $connections = array();


    $after = null;
    while(true) {
        $endpoint = "users/{$user_id}/connections".($after ? "?after={$after}" : "");
        $result = fetch($endpoint);
        $response = json_decode($result);
        if (isset($response->error) || !count($response->connections)) return $connections;
        $connections = array_merge($connections, $response->connections);

        if (count($response->connections) % 100 != 0) return $connections;
        $after = end($response->connections);
    }
}

/**
 * Retrieves all of the users connections. We have a local Cache first foremost approach. We see if the user has connections in our DB and use that. 
 * @param string $user_id The user.
 * @param int $level The deepness of connection fetching, i.e. 1 -> First Order, 2 -> Second Order.
 */
function get_connections_bfs($user_id, $level = 1) {
    if($level || !$user_id) return [];
    
    $queue = new SplQueue();
    $result = [];

    $queue->enqueue($user_id);
    $queue->enqueue(null);

    while(!$queue->isEmpty()) {
        $node = $queue->dequeue();
        if ($node) {
            $connections = get_connections_sql($node);
            if (!$connections || !count($connections)) continue;

            foreach ($connections as $connection) {
                array_push($result, $connection);
                $queue->enqueue($connection);
            }
        } else {
            $level--;
            if (!level) break;
            $queue->enqueue(null);
        }
    }

    return $result;
}
?>