<?php

	if (isset($_POST['test'])) {
		$test = $_POST['test'];
	}
	if (isset($_POST['id'])) {
		$id = $_POST['id'];
	}

    require('connect.php');

	$query = "DELETE FROM bookmarks WHERE id={$id}";
	// print_r($query);

	if ($delete = $db->query($query)) {
		// echo $delete->num_rows;
		// print_r($delete);
	}



header('Content-type: application/json');
 echo '{';




   // echo '"bookmarks" : "'.json_encode($html).'",';

   echo '"idDeleted" : "'.$id.'",';



 echo '"last": ""';

 echo '}';





















?>