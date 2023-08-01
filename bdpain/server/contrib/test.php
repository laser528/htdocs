<?php
require_once "rate_limit.php";

$limiter = RateLimiter::getInstance();

for($i = 0; $i < 100; $i++) {
echo $limiter->run(function() {
    return $i;
});
}

?>