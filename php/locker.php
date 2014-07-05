<?php

	require 'lib/password.php';

	$storedPass = '$2y$10$/vSfE2GH.QZEzfjDH3Y/E.SBoQ.3WKrklbTBCZNs2ixZCOatGXAXi';

	$name = '';
	$pass = '';
	$cryptoPass = '';
	$today = '';
	$status = 'error';
	$file = '../lock.json';


	if (isset($_POST['name'])) {
		$name = $_POST['name'];
	}
	if (isset($_POST['pass'])) {
		$pass = $_POST['pass'];
		// $passToBeEventuallyStored = password_hash($pass, PASSWORD_BCRYPT);
	}
	if (isset($_POST['today'])) {
		$today = $_POST['today'];
	}

	if ($today == 'lock') {
		if (file_put_contents($file, 'var todayLock = "'.$today.'";')) {
			$status = 'locked';
		}
	}

	if (password_verify($pass, $storedPass)) {
	// if (crypt($pass, $cryptoPass) == $cryptoPass) {
		if (file_put_contents($file, 'var todayLock = "'.$today.'";')) {
			$status = 'ok';
		}
	}



header('Content-type: application/json');
 echo '{';




	// echo '"bookmarks" : "'.json_encode($html).'",';

	echo '"locker" : "'.$status.'",';
	echo '"today" : "'.$today.'",';
	echo '"pass" : "'.$pass.'",';
	echo '"cryptoPass" : "'.$cryptoPass.'",';


	echo '"last": ""';

echo '}';






?>