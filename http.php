<?php



	// $request = 'POST /anna_app/php/server_db.php HTTP/1.1
				// Host: simonesacchi.com
				// Connection: keep-alive
				// Content-Length: 32
				// Accept: application/json, text/javascript, */*; q=0.01
				// Origin: http://simonesacchi.com
				// X-Requested-With: XMLHttpRequest
				// User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36
				// Content-Type: application/x-www-form-urlencoded; charset=UTF-8
				// Referer: http://simonesacchi.com/anna_app/
				// Accept-Encoding: gzip,deflate,sdch
				// Accept-Language: it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4';
//
	// $url = 'http://server.com/path';

// $opts = array(
  // 'http'=>array(
    // 'method'=>"GET",
    // 'header'=>"Accept-language: en\r\n" .
              // "Cookie: foo=bar\r\n"
  // )
// );

// $context = stream_context_create($opts);

// $prova = array("uno", "due");


// $header = file('header.txt');
// print_r($header);
// print_r(array_values($header));


// $curl = curl_init("http://www.ytj.fi/tiedostolistaus.aspx?path=1547&kielikoodi=3");
// curl_setopt($curl, CURLOPT_POST, 1);
// curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
// curl_setopt($curl, CURLOPT_HTTPHEADER, array(
	// 'POST /tiedostolistaus.aspx?path=1547&kielikoodi=3 HTTP/1.1',
	// 'Host: www.ytj.fi',
	// 'Connection: keep-alive',
	// 'Content-Length: 1935',
	// 'Cache-Control: max-age=0',
	// 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	// 'Origin: http://www.ytj.fi',
	// 'User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36',
	// 'Content-Type: application/x-www-form-urlencoded',
	// 'Referer: http://www.ytj.fi/tiedostolistaus.aspx?path=1547&kielikoodi=3',
	// 'Accept-Encoding: gzip,deflate,sdch',
	// 'Accept-Language: it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4',
	// 'Cookie: ASP.NET_SessionId=kbjddrylqf43032zmauv4p2b; BIGipServer~YTJ~pool_ytjweb_80=rd13o00000000000000000000ffffc031c0e3o80'
	// ));
// curl_setopt($curl, CURLOPT_POSTFIELDS, '__EVENTTARGET=_ctl0%24ContentPlaceHolder%24RepeaterTiedostot%24_ctl1%24_ctl1&__EVENTARGUMENT=&__VIEWSTATE=%2FwEPDwULLTExODc0NzY5MTEPZBYCZg9kFgQCAQ9kFgICAQ9kFgYCAw8QDxYCHgtfIURhdGFCb3VuZGdkEBUMATEBMgEzATQBNQE2ATcBOAE5AjEwAjExAjEyFQwBMQEyATMBNAE1ATYBNwE4ATkCMTACMTECMTIUKwMMZ2dnZ2dnZ2dnZ2dnZGQCBw8QDxYCHwBnZBAVAgQyMDEzBDIwMTQVAgQyMDEzBDIwMTQUKwMCZ2dkZAILDxYCHgtfIUl0ZW1Db3VudAISFiQCAQ9kFgQCAQ8PFgIeBFRleHQFCjA0LzE4LzIwMTRkZAIFDw8WAh4HVmlzaWJsZWhkZAICD2QWBAIBDw8WAh8CBQowNC8xNy8yMDE0ZGQCBw8PFgIfA2hkZAIDD2QWBAIBDw8WAh8CBQowNC8xNi8yMDE0ZGQCBw8PFgIfA2hkZAIED2QWBAIBDw8WAh8CBQowNC8xNS8yMDE0ZGQCBw8PFgIfA2hkZAIFD2QWBAIBDw8WAh8CBQowNC8xNC8yMDE0ZGQCBw8PFgIfA2hkZAIGD2QWBAIBDw8WAh8CBQowNC8xMy8yMDE0ZGQCBQ8PFgIfA2hkZAIHD2QWBAIBDw8WAh8CBQowNC8xMi8yMDE0ZGQCBQ8PFgIfA2hkZAIID2QWBAIBDw8WAh8CBQowNC8xMS8yMDE0ZGQCBw8PFgIfA2hkZAIJD2QWBAIBDw8WAh8CBQowNC8xMC8yMDE0ZGQCBw8PFgIfA2hkZAIKD2QWBAIBDw8WAh8CBQowNC8wOS8yMDE0ZGQCBw8PFgIfA2hkZAILD2QWBAIBDw8WAh8CBQowNC8wOC8yMDE0ZGQCBw8PFgIfA2hkZAIMD2QWBAIBDw8WAh8CBQowNC8wNy8yMDE0ZGQCBw8PFgIfA2hkZAIND2QWBAIBDw8WAh8CBQowNC8wNi8yMDE0ZGQCBQ8PFgIfA2hkZAIOD2QWBAIBDw8WAh8CBQowNC8wNS8yMDE0ZGQCBQ8PFgIfA2hkZAIPD2QWBAIBDw8WAh8CBQowNC8wNC8yMDE0ZGQCBw8PFgIfA2hkZAIQD2QWBAIBDw8WAh8CBQowNC8wMy8yMDE0ZGQCBw8PFgIfA2hkZAIRD2QWBAIBDw8WAh8CBQowNC8wMi8yMDE0ZGQCBw8PFgIfA2hkZAISD2QWBAIBDw8WAh8CBQowNC8wMS8yMDE0ZGQCBw8PFgIfA2hkZAICDw8WAh8DaGRkZCtFQSHRlhB7rLmW52U6xKGwZZdsNrbq0JGBjA%2F4pt2s&__EVENTVALIDATION=%2FwEWLwKMp%2BPeCQKtsoXqDwKssoXqDwKvsoXqDwKusoXqDwKpsoXqDwKosoXqDwKrsoXqDwK6soXqDwK1soXqDwKtssXpDwKtssnpDwKtss3pDwLS2aflDALS2ZPeCwK%2Bnby8DwKR6ICYCwKR6JSODQKR6KCODQKR6KiEDwKR6LSEDwKR6NzTBgKR6OjTBgKR6PDxDgKR6PzxDgKR6IRoApHomN4CApHozN0NApHo2N0NApHo4NMPApHo7NMPApD4sLMLAvWOk54BAq%2F4sLMLApSPk54BArr3sLMLAp%2BOk54BAtn3sLMLApT3sLMLArP3sLMLApiOk54BAs72sLMLArONk54BAu32sLMLAtKNk54BAoj2sLMLAu2Mk54BYdVmZ0pimu7xtZJOBdFn%2BfNUnuRZMI2%2FuzdTFoEvHBA%3D&_ctl0%3AContentPlaceHolder%3AddlKuukausi=4&_ctl0%3AContentPlaceHolder%3AddlVuosi=2014');
// curl_exec($curl);
// curl_close($curl);









// header('GET www.simonesacchi.com/index.html HTTP/1.0');




$curl = curl_init();
// 'http://localhost/simonesacchi.com/anna_app/php/server_db.php'
curl_setopt($curl, CURLOPT_URL, 'http://localhost/simonesacchi.com/anna_app/php/server_db.php');
curl_setopt($curl, CURLOPT_POST , TRUE);
curl_setopt($curl, CURLOPT_POSTFIELDS, array(
        'input' => 'pepe',
        'render_on_server' => 'false'
    ));
$result = curl_exec($curl);
curl_close($curl);











?>