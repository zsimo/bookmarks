<?php
	
	class bookmark {}


	$name = null;
	$link = null;
	$tags = null;
	$note = null;
	
	$callBackBookmark = '';

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

	// $query = "INSERT INTO bookmarks(name, link, date, tags, note)
		// VALUES('{$name}', '{$link}', '{$date}', '{$tags}', '{$note}')";
	$statement = $db->prepare("INSERT INTO bookmarks(name, link, date, tags, note)VALUES(?, ?, ?, ?, ?)");
	$statement->bind_param('sssss', $name, $link, $date, $tags, $note);


	// if ($insert = $db->query($query)) {
	if ($statement->execute()) {
		$book = new bookmark;
		$book->id = $db->insert_id;
		$book->name = $name;
		$book->link = $link;
		$book->date = date("D, d M Y - H:i:s", $date);
		$book->tags = $tags;
		$book->note = $note;
		
		// $callBackBookmark .= '{"name":"'. $name .'",';
				// $jsonString .= '"link":"'. $link .'",';
				// $jsonString .= '"date":"'. $date .'",';
				// $jsonString .= '"tags":"'. $tags .'",';
				// $jsonString .= '"note":"'. $note .'"}';
		
	}



header('Content-type: application/json');
 echo '{';




   // echo '"bookmarks" : "'.json_encode($html).'",';


	echo '"bookmark" : '.json_encode($book).',';
	
	
	

 echo '"last": ""';

 echo '}';




?>











