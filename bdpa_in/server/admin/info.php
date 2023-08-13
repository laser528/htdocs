<?php
/**
 * Get site wide info
 */
require_once "../contrib/lib.php";

set_headers();

echo bdpa_fetch("info");
?>