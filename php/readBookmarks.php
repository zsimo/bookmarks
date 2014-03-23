<?php


include('lib/simple_html_dom.php');

	$bookmarks = $_REQUEST['bookmarks'];

	$html = file_get_html($bookmarks);

	print_r($html);

header('Content-type: application/json');
 echo '{';




   echo '"bookmarks" : "'.json_encode($html).'",';

   echo '"test" : "'.$test.'",';



 echo '"last": ""';

 echo '}';



?>






