
var nodemailer = require('nodemailer');
var randomNum = null;
var name = null;
var mysql = require('mysql');


var client = mysql.createConnection({
	host: '192.168.0.59',
	user: 'root',
	password: 'root',
	database: 'zup'
});
 
//get
exports.idcheck = function(req, res){
	  res.render('idcheck');
	};

	
	//post	
exports.idcheck2 = function(req, res){
	randomNum = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
	var body =  req.body;
	var name = body.inputName;
	var email = body.inputEmail;
	console.log(body.inputName);
	console.log(body.inputEmail);
		
		
		client.query('select count(*) cnt from user where user_name=? and user_email=?', [name,email], function(err, result){
			//res.render('index', {data: result});
			console.log('아이디를 찾자');
			console.log(result);
			var cnt = result[0].cnt;
			
			console.log(cnt);
			
			if(cnt === 1){
				console.log('오! 인증번호 보내줌!');
				req.session.user_name = name;
				console.log("세션저장"+req.session.user_name);
//인증번호 보내기
				var transporter = nodemailer.createTransport({
					  service: 'gmail',
					  auth: {
					    user: 'zupkosta@gmail.com',
					    pass: 'zup12345'
					  }
					});
				
				var mailOptions = {
						  from: 'zupkosta@gmail.com',
						  to: body.inputEmail,
						  subject: '[ZUP] 줍계정 아이디 찾기 인증번호',
						  text: "안녕하세요. ZUP 입니다. \r\n" +
						  		"\r\n" + 
						  		"요청하신 아이디 찾기를 위한 인증번호입니다. \r\n" +
						  		"줍계정 아이디 찾기 페이지에서 아래의 인증번호를 입력하여 아이디를 찾으실 수 있습니다. \r\n" +
						  		"-----------------------------------------------------------------------------------------------------------\r\n\r\n" +
						  		"이름 : \r\n" +
						  		body.inputName + "\r\n" +
						  		"\r\n" +
						  		"아이디 찾기 인증번호 : \r\n" +
						  		randomNum +
						  		"\r\n\r\n" +
						  		"-----------------------------------------------------------------------------------------------------------\r\n" +
						  		"* 요청하지 않은 인증번호 메일을 받으셨나요?\r\n" +
						  		"내 줍계정이 맞다면, 누군가 오타로 메일을 잘못 발송했을 수 있습니다. 줍계정이 도용된 것은 아니니 안심하세요.\r\n" +
						  		"직접 가입한 줍계정이 아닌데 이 메일을 받았다면, '내 계정이 아님'을 클릭해주세요."
						  		
						  		
						  		
						};
				
				transporter.sendMail(mailOptions, function(error, info){
					  if (error) {
					    console.log(error);
					  } else {
					    console.log('Email sent: ' + info.response);
					  }
					});
				
				
				
				
				res.send('<script type="text/javascript">alert("메일로 인증번호가 전송되었습니닷!!");location.href="idcheck"</script>');
			}else{
				//res.json({result:'fail'});
				console.log('틀림 인증번호 노노');
				res.send('<script type="text/javascript">alert("이름과 이메일을 다시 확인해주세요");location.href="idcheck"</script>');
				//res.render('login');
			
			}
			
		}); 
	};
	
	exports.idresult = function(req, res){
		console.log('찾기후'+req.session.user_name);
		var sessionUsername = req.session.user_name;
		var bodyNum =  req.body;
		
		client.query('select * from user where user_name=?', [sessionUsername], function(err, result){
		
		console.log("넘버체크:"+bodyNum.numCheck);
		console.log("랜덤넘버:"+randomNum);
		if(bodyNum.numCheck == randomNum){
			console.log(result);
		  res.render('idresult', {data : result});
		}else{
			res.send('<script type="text/javascript">alert("인증번호가 틀렸습니다!");location.href="idcheck"</script>');
			
		}
		
		});
		
		};
	
	