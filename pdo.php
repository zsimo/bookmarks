<?php






	// print_r(PDO::getAvaileDrivers());'dbname=blogscrip;mysql:host=localhost
	try {
		$handler = new PDO("mysql:host=localhost;dbname=simonesa_simone", "root", "");
		$handler->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	} catch(PDOEception $e) {
		echo $e->getMessage();
		// die("database problem");
	}



	// PDO
	// $db->beginTransaction();
	// $sql = $db->exec($query);


	class GuestbookEntry {
		// properties
		public $name, $message, $entry;
	}

	$result = $handler->query("SELECT * FROM counters");
	if ($result) {
		// print_r("OK");
	} else {
		// print_r("ERROR");
	}

	// $row = $result->fetch(PDO::FETCH_ASSOC);
	// $row = $result->fetch(PDO::FETCH_NUM);
	// $row = $result->fetch(PDO::FETCH_BOTH);
	// $row = $result->fetch(PDO::FETCH_OBJ);
	// echo $row;
	// echo "<pre>" . print_r($row) . "</pre>";
	// print_r($row);

	while ($row = $result->fetch()) {
		echo $row['site'] . "<br>";
	}



	// while ($row = $result->fetch(PDO::FETCH_OBJ)) {
		// // objected way
		// echo $row->site . "<br>";
	// }

	// $handler->lastInsertId();



?>
