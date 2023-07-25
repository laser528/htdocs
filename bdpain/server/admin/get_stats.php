<?php
/* Get sitewide stats. */
require_once "../contrib/lib.php";
require_once "../contrib/api_request.php";

set_headers();

$result = fetch("info", "GET");
echo $result;
?>