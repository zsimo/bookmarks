<?php

header('Content-type: application/json');
echo '{';


    // no error reporting for secure reason
//    error_reporting(0);

//    error reporting for development
    error_reporting(E_ALL);

   require('connect.php');


//    if ($insert = $db->query()) {
//
//    }


	// in remoto json_decode non restituisce nulla senza stripslashes()
	$bookmarks = json_decode(stripslashes($_REQUEST['bookmarks']));
	// json_last_error();

	print_r($bookmarks);

	set_time_limit(120);


	foreach($bookmarks as  $key =>$value) {
		// print_r("key: {$key}\n");
		foreach($value as  $singleBookmark) {
			// sanitize with db->real_escape_string()
			$date = $singleBookmark->date;
			$name = $singleBookmark->name;
			$href = $singleBookmark->href;
			$tags = $singleBookmark->tags;

			// NOW() per la data attuale
			// Complex (curly) syntax
			// If a dollar sign ($) is encountered, the parser will greedily take as many tokens as possible to form a
			// valid variable name. Enclose the variable name in curly braces to explicitly specify the end of the name.

			$query = "INSERT INTO bookmarks (name, link, date, tags, note)
									VALUES ('{$name}', '{$href}', '{$date}', '{$tags}', null)";

			if ($db->query($query)) {
				// Gets the number of affected rows in a previous MySQL operation
				// echo $db->affected_rows;
			}

			// print_r("date: {$date}\n");
			print_r("name: {$name}\n");
			// print_r("href: {$href}\n");
			// print_r("tags: {$tags}\n");
		}
	}



    echo '"bookmarks" : "ok",';
//   echo '"bookmarks" : "'.$_REQUEST['bookmarks'].'",';

echo '"last": ""';

echo '}';









?>





