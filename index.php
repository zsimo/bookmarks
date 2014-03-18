<?php

include('php/lib/simple_html_dom.php');

$html = str_get_html('data/bookmarks_07_03_14.html');

// print_r("simon");
print_r(json_encode($html));


// foreach($html->find('A') as $e) {
	// echo "simon";
// } 







?>