<?php
require_once __DIR__ . '/../vendor/autoload.php';

/** 
 * Trigger Server-Sent Events
 * EventManager/app.js must be running under NodeJS!
 */
use voxx\Events as Events;

try
{
	// Query Cache or DB for data and loop? or accept get/post for feeding data in
	// Hardcoding for example
	
	$id = rand(1,20);
	$workerId = 'worker_' . $id;
	$checkChallenge = [true,false];
	$checkChallenge = $checkChallenge[array_rand($checkChallenge)];
	$challengeUrl = ['http://test.com/captcha/','http://test.net/captcha/'];
	$challengeUrl = $checkChallenge ? $challengeUrl[array_rand($challengeUrl)] : '';
	$data = array('id' => $id, 'workerId' => $workerId, 'checkChallenge' => $checkChallenge, 'challengeUrl' => $challengeUrl, 'timestamp' => date("h:i:s", time()) );
	
	/**
	 * `update` is your custom event
	 */
	$bytes = Events\EventTriggerer::trigger(
		array(
			'type'	=> 'update', 
			'data'	=> $data
		)
	);

	echo "send $bytes bytes event\n";
}
catch(Exception $ex)
{
	echo "EXCEPTION: { $ex->getMessage() }";
}
