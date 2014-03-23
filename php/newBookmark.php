<?php
	$name = null;
	$link = null;
	$tags = null;
	$note = null;

	if (isset($_POST['name'])) {
		$name = $_POST['name'];
	}
	if (isset($_POST['link'])) {
		$link = $_POST['link'];
	}
	if (isset($_POST['tags'])) {
		$tags = $_POST['tags'];
	}
	if (isset($_POST['note'])) {
		$note = $_POST['note'];
	}
	$date = time();

    require('connect.php');

	$query = "INSERT INTO bookmarks(name, link, date, tags, note)
		VALUES('{$name}', '{$link}', '{$date}', '{$tags}', '{$note}')";
	print_r($query);

	if ($insert = $db->query($query)) {

	}



header('Content-type: application/json');
 echo '{';




   // echo '"bookmarks" : "'.json_encode($html).'",';

   echo '"name" : "'.$name.'",';



 echo '"last": ""';

 echo '}';




?>











