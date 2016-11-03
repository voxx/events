/** 
 * EventManager app
 */
var dgram	= require('dgram');
var http	= require('http');
var url		= require('url');

/**
 * The list with all registered event listeners
 * 
 * @type object
 */
var clients	=	{};
var clientsLength	=	0;

//debug ID variable
var i = 0;

/**
 * The TCP Server that handles/registers new event listeners
 * 
 * @type Server.prototype.listen.self
 */
var listenersManager;

/**
 * The UDP server that receive triggered events and then dispatch the events to
 * all registered clients
 * 
 * @type Socket
 */
var receiver;

/********************************************
 * The event receiver (catch all triggered events)
 */
receiver = dgram.createSocket('udp4');

var UDP_PORT	=	6969;
var TCP_PORT	=	6970;

receiver.on('error', function (err) {
	console.log('RECEIVER ERROR:\n' + err.stack);
	receiver.close();
});

receiver.on('message', function (msg, rinfo) {
	console.log( 'EVENT ID: ' + (i++) + ' - EVENT MANAGER GOT: ' + msg.length + ' BYTES FROM ' + rinfo.address + ':' + rinfo.port);
	
	var json = JSON.parse(msg);
	
	if(clientsLength <= 0)
		console.log('NO CLIENTS CURRENTLY REGISTERED TO STREAM!');

	// Broadcast the event to all registered clients
	for(var j in clients) {
		
		if(!clients.hasOwnProperty(j))
			continue;
		
		var client = clients[j];
		
		if(!json.userId || client.userId == json.userId)
		{
		client.response.write('event: ' + (json.type || 'heartbeat') + '\n');
			if(json.id)
				client.response.write('id: ' + json.id + '\n');
				client.response.write('data: ' + msg + '\n\n');
				
				console.log('BROADCASTING EVENT TO CLIENT #' + j);
			}
			else
				// Don't broadcast event data not meant for this client!
				console.log('NOT BROADCASTING EVENT TO CLIENT: ' + j);
		}
	}
);

setInterval(function() {
	for(var j in clients) {
		if( !clients.hasOwnProperty(j) )
			continue;
		
		var client = clients[j];
		
		client.response.write('event: heartbeat\n');
		client.response.write('data: ' + JSON.stringify( {timestamp: Date.now().toString()} ) + '\n\n');
		
		console.log('HEARTBEAT BROADCAST TO CLIENT #' + j);
	}
}, (60 * 1000)); // Broadcast heartbeat to clients every (X)milliseconds to ensure the connections are kept alive.

receiver.on('listening', function () {
	var address = receiver.address();
	console.log('UDP RECEIVER LISTENING ON: ' + address.address + ':' + address.port);
});

receiver.bind(UDP_PORT, '127.0.0.1');

/**************************
 * The event listeners manager
 */
listenersManager = http.createServer();

listenersManager.on('request', function(req, response){
	
	var sock		=	req.connection;
	var client_id	=	sock.remoteAddress + ':' + sock.remotePort + '#' + Math.random();
	var url_parts	=	url.parse(req.url, true);
	
	console.log('** NEW CLIENT REQUESTED REGISTRATION: ' + sock.remoteAddress + ':' + sock.remotePort + ' **');
	
	// add client to clients list
	clients[client_id] = {
		response:	response,
		userId:		url_parts.query.userId
	};
	
	clientsLength++;
	console.log('clientsLength:' + clientsLength);
	
	response.writeHead(200, {
		'Content-Type'					:	'text/event-stream', 
		'Access-Control-Allow-Origin'	:	'*'
	});
	
	sock.on('close', function(){
		// Emitted once the socket is fully closed. 
		console.log('** SERVER CLOSED CONNECTION: ' + client_id + ' **');
	});
	
	sock.on('end', function(){
		// Emitted when the other end of the socket sends a FIN packet.
		console.log('** CLIENT ENDED CONNECTION: ' + client_id + ' **');
		delete clients[client_id];
		clientsLength--;
	});
	
	sock.on('error', function(){
		console.log('error event: ' + client_id);
	});
	
}).listen(TCP_PORT, '0.0.0.0');

function pecho(s)
{
	console.log(s);
}
