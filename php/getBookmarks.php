<?php

header('Content-type: application/json');
echo '{';



//    no error reporting for secure reason
//    error_reporting(0);
//    error reporting for development
    // error_reporting(E_ALL);

    require('connect.php');

	$results = array();
	$query = "SELECT * FROM bookmarks";
	$jsonString = '[';

	class bookmark {}

	if ($result = $db->query($query)) {

		if ($count = $result->num_rows) {
			// echo "count ". $count. "\n";

			while ($rows = $result->fetch_assoc()) {
				$book = new bookmark;
				$book->name = $rows['name'];
				$book->link = $rows['link'];
				$book->date = $rows['date'];
				$book->tags = $rows['tags'];
				$book->note = $rows['note'];

				// $book['name'] = $rows['name'];
				// $book['link'] = $rows['link'];
				// $book['date'] = $rows['date'];
				// $book['tags'] = $rows['tags'];
				// $book['note'] = $rows['note'];

				// $book = array();
				// array_push($book, $rows['name']);
				// array_push($book, $rows['link']);
				// array_push($book, $rows['date']);
				// array_push($book, $rows['tags']);
				// array_push($book, $rows['note']);

				// array_push($results, $book);

				$jsonString .= '{"name":"'. $rows['name'] .'",';
				$jsonString .= '"link":"'. $rows['link'] .'",';
				$jsonString .= '"date":"'. $rows['date'] .'",';
				$jsonString .= '"tags":"'. $rows['tags'] .'",';
				$jsonString .= '"note":"'. $rows['note'] .'"},';
			}

			$jsonString = rtrim($jsonString, ',');
			$jsonString .= "]";
			// substr($jsonString, 0, strlen($jsonString)-2);
			// print_r($jsonString);

			// $rows = $result->fetch_all();

			// echo '"result" : "'.json_encode($prova).'",';

		}


	} else {
		die($db->error);
	}

	// $prova['prova'] = "prova";


	echo '"bookmarks" : '. $jsonString .",";

	// echo '"bookmarks" : "'.json_encode($results).'",';

  	// echo '"test" : "'.$_REQUEST['input'].'",';



  // $langs = array("JavaScript","HTML/CSS","PHP","Python", "Ruby");
  // foreach ($langs as $lang) {
      // echo "<li>$lang</li>";
  // }

  	// function displayName() {
		// echo "simone";
	// }

    class Person {
        // Creating some properties (variables tied to an object)
        public $isAlive = true;
        public $firstname;
        public $lastname;
        public $age;

        // Assigning the values
        public function __construct($firstname, $lastname, $age) {
          $this->firstname = $firstname;
          $this->lastname = $lastname;
          $this->age = $age;
        }

        // Creating a method (function tied to an object)
        public function greet() {
          return "Hello, my name is " . $this->firstname . " " . $this->lastname . ". Nice to meet you! :-)";
        }
      }

    // $me = new Person('boring', '12345', 12345);
    // echo $me->greet();

	$myArray = array(2012, 'blue', 5);
    $myAssocArray = array('year' => 2012,'colour' => 'blue','doors' => 5);

    $salad = array('lettuce' => 'with','tomato' => 'without','onions' => 'with');
  	foreach ($salad as $ingredient=>$include) {
		echo $include . ' ' . $ingredient . '<br />';
  	}

echo '"last": ""';
echo '}';








?>