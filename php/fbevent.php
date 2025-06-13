<?php
include("get-location.php");

$userIP = $_SERVER['REMOTE_ADDR'];
$geoData = getGeoLocation($userIP);

echo $userIP;

 $pixelId = '1316018702983520';
 $accessToken = 'EAAIUG9onWZCMBO6lCk6olDps4zNc7XIZAPGhs16E4woAiBaYnqQ99gJNONgluqCTpcfZBPmvfZBRsIt7oOb8fXworYZAj5oiilAw44Vi1bVE2sXsLASF28hyZBOxg0IZBcRqTydzlS5LmZCYWOLNFc6DbUJ1l5tMVICElsZBObYOuMGgQYa4sZAylgMkaQWxZCHaZCRSZCQZDZD';
 $url = "https://graph.facebook.com/v11.0/$pixelId/events";

$estadoHash = hash('sha256', $geoData['region']);
$paisHash = hash('sha256', $geoData['country']);
$cidadeHash = hash('sha256', $geoData['city']);
$zipHash = hash("sha256", $geoData['zip']);

$eventData = json_decode($json, true);


$data = [
    'data' => [
        [
            'event_name' => $eventData["eventName"],
            'event_time' => time(),
            'action_source' => 'website',
            'event_source_url' => 'https://lp.flowch.com',
            'user_data' => [
                'external_id' => $_SERVER['REMOTE_ADDR'],
                'client_ip_address' => $_SERVER['REMOTE_ADDR'],
                'client_user_agent' => $_SERVER['HTTP_USER_AGENT'],
                'fbc' => filter_input(INPUT_COOKIE, '_fbc') ? filter_input(INPUT_COOKIE, '_fbc') : null,
                'fbp' => filter_input(INPUT_COOKIE, '_fbp'),
                'st' => $estadoHash,
                'country' => $paisHash,
                'ct' => $cidadeHash, 
                'zp' => $zipHash,
            ],
        ],
    ],
    'access_token' => $accessToken,
];


$jsonData = json_encode($data);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if ($response === false) {
        echo "Erro ao enviar o evento: " . curl_error($ch);
    } else {
        echo "Evento enviado com sucesso: " . $response;
    }

    curl_close($ch);

?>
