/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, test = require('./routes/test')
, chatserver = require('./routes/chatserver')

/* FireBase - 동준*/
, request = require('request')
, firebase = require("firebase")

/*마이페이지*/
, mypage = require('./routes/mypage')

, http = require('http')

/* google Map 때문에 필요한 https 모듈 */
, https = require('https')

/* 접수하기 페이지 */
, submit = require('./routes/submit')
, submit2 = require('./routes/submit2')
, submit3 = require('./routes/submit3')

, path = require('path')
, socketio = require('socket.io')
, fs = require('fs')
 
/*회원 관련*/
, login = require('./routes/login')
, logout = require('./routes/logout')
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
, orderresult = require('./routes/orderresult')

/* 고객센터 페이지 */
, notice = require('./routes/notice')

/*고객센터 페이지*/
, ejs = require('ejs');

//데이터 연동
var bodyParser = require('body-parser');

//login 관련 세션
var cookieParser = require('cookie-parser');
var session = require('express-session');

/* https프로토콜 생성을 위한 키,인증서 읽어오기*/
var options = {  
	    key: fs.readFileSync('key.pem'),
	    cert: fs.readFileSync('cert.pem')
	};

var app = express();

//바디파서
app.use(cookieParser());
app.use(bodyParser.urlencoded({	extended:true }));
app.use(bodyParser.json());
app.use(session({
	secret : 'enter secret key',
	resave : false,
	saveUninitialized : true
}));

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
app.post('/mypage', mypage.mypage_change);


/*회원 관련*/
//로그인
app.get('/login', login.login );
app.post('/login', login.login2);

//로그아웃
app.get('/logout', logout.logout);

app.get('/idcheck', idcheck.idcheck);
app.get('/pwcheck', pwcheck.pwcheck);
app.get('/newpw', newpw.newpw);
app.get('/idresult', idresult.idresult);
app.get('/pwresult', pwresult.pwresult);
//약관 동의
app.get('/agree', agree.agree);
app.post('/agree', agree.agree2);
//회원가입
app.get('/regist', regist.regist);
app.post('/regist', regist.regist2);
//가입 확인
app.get('/regresult', regresult.regresult);


/* 관리자 페이지 */
app.get('/order', order.order);
app.post('/order', order.cancel);
app.get('/total', total.total);
app.get('/user', user.user);
app.get('/orderresult', orderresult.order);

/*접수 하기 페이지*/
app.get('/submit', submit.submit);
app.get('/submit2', submit2.submit2);


/*고객센터 페이지 총5개*/
//notice 공지사항(고객센터1)
app.get('/notice1', notice.notice);
app.get('/noticecount', notice.count);//게시판 조회수처리
app.get('/noticeedit', notice.edit);//게시판 조회수처리

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



https.createServer(options, app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));

});

/* 접수하기 페이지 안드로이드와 통신 */
app.post('/submit2', function(req, res){
	
	var mysql = require("mysql");
	var client = mysql.createConnection({
		user: 'root',
		password: '024931',
//		password: 'root',
		database: 'zup'
	});
	
	/*
	  console.log("접수하기 2페이지 post방식 요청");
	  console.log("name : " + req.body.name);
	  console.log("tel : " + req.body.telephone);
	  console.log("mapAddress : " + req.body.mapAddress);
	  console.log("detailAddress : " + req.body.detailAddress);
	  console.log("lat : " + req.body.lat);
	  console.log("lng : " + req.body.lng);
	 */
	  
	  //위도 경도
	  var lat = req.body.lat;
	  var lng = req.body.lng;
	  
	  //디바이스 키값, 위도 경도 세팅
	  var latData = lat + "," + lng;
	  var deviceId = "fsXFrBLwN8g:APA91bFwe4Gd-LzFEfWrHcSRh0O9cCp06W7VWYosoKPfbsoc9meBWAiWp30FffqTtJ7aEzowWvTDpQnTF9dtzywLr5ex8sZTu6a_k23IrrrUzRUPu73FpXsVKTNq-Qz5hIJ8lkIuxMnn";
	  
	  //유저 값 세팅
	  var user_num = 1;
	  var employee_num = 1;
	  var user_id = "dlqudgjs";
	  
	  //접수하기 페이지 값 세팅
      var name = req.body.name;
      var tel = req.body.telephone;
      var mapAddress = req.body.mapAddress;
      var detailAddress = req.body.detailAddress;
      var address = mapAddress + detailAddress;
      
      //안드로이드와 통신하기.
      sendMessageToUser(deviceId, latData);

function sendMessageToUser(deviceId, latData) {
		console.log(latData);
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
				    "name" : name,
				    "tel" : tel,
					"message" : latData,
					"address" : address
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
	  client.query("insert into userlog(user_num,logtype,status,content) values(?,'대기','회수대기중..','회수예정')",
	               [user_num]);

	  client.query("insert into orderlist(user_num, employee_num)values(?, ?)",
		           [user_num, employee_num]);
     
	  client.query("update user set user_address = ? where user_num = ? AND user_id = ?",
			       [address, user_num, user_id],
			       
			       function(){
//				    res.redirect('/regresult/:id='+body.inputId);
					res.render("submit3", {
						name : name,
						tel : tel,
						mapAddress : mapAddress,
						detailAddress : detailAddress						  
					});			  
			  });
	  
});//app.post("submit2");
