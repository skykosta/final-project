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
, fs = require('fs')
 
/*회원 관련*/
, login = require('./routes/login')
, regist = require('./routes/regist')
, idcheck = require('./routes/idcheck')
, pwcheck = require('./routes/pwcheck')
, newpw = require('./routes/newpw')
, pwresult = require('./routes/pwresult')
, idresult = require('./routes/idresult')
, regresult = require('./routes/regresult')
, agree = require('./routes/agree')

/* 관리자 페이지 */
, user = require('./routes/user')
, order = require('./routes/order')
, total = require('./routes/total')


/*고객센터 페이지*/
, ejs = require('ejs');


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
/*회원 관련*/
app.get('/login', login.login );
app.get('/regist', regist.regist);
app.get('/regist', regist.regist);
app.get('/idcheck', idcheck.idcheck);
app.get('/pwcheck', pwcheck.pwcheck);
app.get('/newpw', newpw.newpw);
app.get('/idresult', idresult.idresult);
app.get('/pwresult', pwresult.pwresult);
app.get('/regresult', regresult.regresult);
app.get('/agree', agree.agree);

/* 관리자 페이지 */
app.get('/order', order.order);
app.get('/total', total.total);
app.get('/user', user.user);


/*고객센터 페이지 총5개*/
//notice 공지사항(고객센터1)
app.get('/notice', function(request, response){
	fs.readFile('views/notice.ejs', 'utf8', function(error, data){
		response.send(ejs.render(data));
	});
});
//fnq 자주묻는질문(고객센터2)
app.get('/fnq', function(request, response){
	fs.readFile('views/fnq.ejs', 'utf8', function(error, data){
		response.send(ejs.render(data));
	});
});
//contact 문의게시판(고객센터3)
app.get('/contact', function(request, response){
	fs.readFile('views/contact.ejs', 'utf8', function(error, data){
		response.send(ejs.render(data));
	});
});
//게시판 글쓰기 <게시판(notice) 글쓰기 버튼 클릭시 이동하는 화면입니다>
app.get('/board', function(request, response){
	fs.readFile('views/board.ejs', 'utf8', function(error, data){
		response.send(ejs.render(data));
	});
});
//게시글 상세보기 <게시판(notice) 글 클릭시 이동하는 화면입니다> 
app.get('/boardview', function(request, response){
	fs.readFile('views/boardview.ejs', 'utf8', function(error, data){
		response.send(ejs.render(data));
	});
});



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
