<?php

header('Content-type: application/json');
echo '{';



//    no error reporting for secure reason
//    error_reporting(0);
//    error reporting for development
    // error_reporting(E_ALL);



    $db = new PDO('mysql:host=localhost;dbname=simonesa_simone', 'root', '');

	$query = "SELECT * FROM bookmarks ORDER BY date DESC";
	$result = $db->query($query);

	$out = array();

	// r = $result->fetchAll(PDO::FETCH_NUM)
	// r = $result->fetchAll(PDO::FETCH_OBJ)
	while ($r = $result->fetchAll(PDO::FETCH_ASSOC)) {
		// array_push($out, $r);
		print_r($r);
	}


	echo '"bookmarks" : '. json_encode($r) .",";


	// echo "<pre>", print_r($expression, true) ,  "</pre>";
	// prova anche uso var_dump e var_export per stampare gli array

	// is_callable verifica se cio che gli passi � una funzione o no

echo '"last": ""';
echo '}';








?>