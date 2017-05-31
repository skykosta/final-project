/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, test = require('./routes/test')
, chatserver = require('./routes/chatserver')

/*마이페이지*/
, mypage = require('./routes/mypage')

, http = require('http')
, path = require('path')
, socketio = require('socket.io')
, fs = require('fs');
 
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
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
app.get('/test', function(request, response) {
	fs.readFile('test.html', function(error, data) {
		response.writeHead(200, {
			'Content-Type' : 'Application/json'
		});
		response.end(data);
	});
});
/*마이페이지*/
app.get('/mypage', mypage.mypage);


var sio = http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});


var chatServer = socketio.listen(sio);
var chatArray = null;

var chatInfo = null;
chatServer.sockets.on('connection', function(socket) {
	// message 이벤트 처리(메시지 수신)
	socket.on('foo', function(data) {
		// message 이벤트 발생(메시지 송신)
		socket.broadcast.emit("bar", data);
		chatArray = new Array();

		chatInfo = new Object();
         console.log(data);
        chatInfo.message = data;
        chatArray.push(chatInfo);
        console.log(JSON.stringify(chatArray));
        
		fs.appendFile('test.html', JSON.stringify(chatArray), function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log("성공했어?");
			}
		});
	});
});
