<?php

/** 
 * Trigger Server-Sent Events
 * EventManager/app.js must be running under nodejs!
 */
use voxx\Events as Events;

require_once __DIR__ . '/../vendor/autoload.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

try
{
	/**
	 * missedCall is your custom event
	 */
	$bytes	=	Events\EventTriggerer::trigger(array(
		'type' => 'missedCall', 
		'data' => str_repeat('a', rand(10, 20))
	));

	echo "send $bytes bytes event\n";
}
catch(Exception $ex)
{
	echo "exception:{$ex->getMessage()}";
}
