<?php
	
	$name = '';
	$pass = '';
	$today = '';
	$status = 'error';
	$file = '../lock.json';
	
	
	if (isset($_POST['name'])) {
		$name = $_POST['name'];
	}
	if (isset($_POST['pass'])) {
		$pass = $_POST['pass'];
	}
	if (isset($_POST['today'])) {
		$today = $_POST['today'];
	}
	
	if ($today == 'lock') {
		if (file_put_contents($file, 'var todayLock = "'.$today.'";')) {
			$status = 'locked';
		}
	}

	if ($pass == 'banzai') {
			if (file_put_contents($file, 'var todayLock = "'.$today.'";')) {
				$status = 'ok';
			}
		}



header('Content-type: application/json');
 echo '{';




	// echo '"bookmarks" : "'.json_encode($html).'",';

	echo '"locker" : "'.$status.'",';
	echo '"today" : "'.$today.'",';



	echo '"last": ""';

echo '}';






?>