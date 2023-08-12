<?php
/* Generic PHP Functions. */
require_once "constants.php";

/** Gets a new Mysqli Instance. */
function get_mysql_connection() {
    return new mysqli($_ENV["DB_HOST"], $_ENV["DB_USER"], $_ENV["DB_PASSWORD"], $_ENV["DB_NAME"]);
}

?>