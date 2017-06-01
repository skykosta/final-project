/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), user = require('./routes/user'), map = require('./routes/maptest7'), chatserver = require('./routes/chatserver'), http = require('http'), path = require('path'), socketio = require('socket.io'), fs = require('fs'), request = require('request'), firebase = require("firebase");

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/chat', chatserver.chat);
app.get('/map', map.map);

var sio = http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));

});

var chatServer = socketio.listen(sio);

chatServer.sockets
		.on(
				'connection',
				function(socket) {
					// message 이벤트 처리(메시지 수신)
					socket
							.on(
									'foo',
									function(data) {
										// message 이벤트 발생(메시지 송신)
										socket.broadcast.emit("bar", data);
										chatInfo = new Object();

										sendMessageToUser(
												"ftM37xsE4jU:APA91bEunaSR2DvFloH7sGw6Q5pmdiUfVtmri67t6xaBMYHiYPwA8z4HzX5J66jrBanHmAGyeRl-cXNBX5MDXNMVXXrT9PiEaYp_ygTTvGJq0OlMqoa0nbcUmLAZlIWhIZeNpVCWtTCG",
												data);
									});
				});

function sendMessageToUser(deviceId, message) {
	console.log(message);
	console.log(deviceId);

	request({
		url : 'https://fcm.googleapis.com/fcm/send',
		method : 'POST',
		headers : {
			'Content-Type' : 'application/json',
			'Authorization' : 'key=AIzaSyBcGM6s4SQtDGLWQlb9Lab60HUF8kGcZP4'
		},
		body : JSON.stringify({
			"data" : {
				"message" : message
			},
			"to" : deviceId
		})
	}, function(error, response, body) {
		if (error) {
			console.error(error, response, body);
		} else if (response.statusCode >= 400) {
			console.error('HTTP Error: ' + response.statusCode + ' - '
					+ response.statusMessage + '\n' + body);
		} else {
			console.log('성공!')
		}
	});
}
