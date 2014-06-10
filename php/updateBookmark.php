<?php

	class bookmark {}

	$name = $_POST['name_value'];
	$link = $_POST['link_value'];
	$tags = $_POST['tags_value'];
	$note = $_POST['note_value'];
	$id = $_POST['id_value'];
	$date = time();

    require('connect.php');

	// $query = "UPDATE bookmarks
				// SET name='{$name}',
					// link='{$link}',
					// date='{$date}',
					// tags='{$tags}',
					// note='{$note}'
				// WHERE id={$id}";
				
	$statement = $db->prepare("UPDATE bookmarks SET name=?, link=?, date=?, tags=?,note=? WHERE id=?");
	$statement->bind_param('sssssi', $name, $link, $date, $tags, $note, $id);

	try {
		// $db->query($query);
		$statement->execute();
	} catch (Exception $e) {
		print_r($e->getMessage());
	}

	$date = date("D, d M Y - H:i:s", $date);

	$book = new bookmark;
	$book->id = $id;
	$book->name = $name;
	$book->link = $link;
	$book->date = $date;
	$book->tags = $tags;
	$book->note = $note;


header('Content-type: application/json');
 echo '{';

				


   // echo '"bookmarks" : "'.json_encode($html).'",';

   echo '"bookmark" : '. json_encode($book) .",";

   echo '"idUpdated" : "'.$id.'",';
   echo '"name" : "'.$name.'",';
   echo '"link" : "'.$link.'",';
   echo '"date" : "'.$date.'",';
   echo '"tags" : "'.$tags.'",';
   echo '"note" : "'.$note.'",';

 echo '"last": ""';

 echo '}';






?>












