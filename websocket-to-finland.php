<?php

$requestMethod = 'GET';
$host    = 'www.ytj.fi' ;
$target  = '/index.html';
$port    = 80 ;
$timeout = 60;
$br       = "\r\n" ;
$dati = '' ;


$socket = fsockopen($host, $port, $errnum, $errstr, $timeout);

if (!is_resource($socket)) {
	exit('Connessione fallita: '.$errnum.' ' .$errstr);
}
else {

	$header = "GET / HTTP/1.1".$br;
	$header .= "Host: simonesacchi.com".$br;
	$header .= "Connection: keep-alive".$br;
	$header .= "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8".$br;
	$header .= "User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36".$br;
	// $header .= "Accept-Encoding: gzip,deflate,sdch".$br;
	$header .= "Accept-Language: it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4".$br;

	$header .= $br;

	$header = file_get_contents('header.txt');

 	fputs ($socket, $header);

 	while (!feof($socket)) {

  		$dati.= fgets ($socket, 2048);

 	}
}

print_r($dati);
file_put_contents('out.html', $dati);


?>






