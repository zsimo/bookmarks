<?php

header('Content-type: application/json');
echo '{';


    // no error reporting for secure reason
//    error_reporting(0);

//    error reporting for development
    error_reporting(E_ALL);
    
//    require('connect.php');


//    if ($insert = $db->query()) {
//    
//    }

    $bookmarks = $_REQUEST['bookmarks'];
    
    print_r("simon");

    print_r($bookmarks->root[0]);


	// foreach($$bookmarks->root as $key => $value) {

	// }



    echo '"bookmarks" : "ok",';
//   echo '"bookmarks" : "'.$_REQUEST['bookmarks'].'",';

echo '"last": ""';

echo '}';









?>





