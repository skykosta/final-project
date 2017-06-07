
var nodemailer = require('nodemailer');
var randomNum = null;
 
exports.idcheck = function(req, res){
	  res.render('idcheck');
	};
	
exports.idcheck2 = function(req, res){
	randomNum = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
	var body =  req.body;
		console.log(body.contents);
		var transporter = nodemailer.createTransport({
			  service: 'gmail',
			  auth: {
			    user: 'qoehd0@gmail.com',
			    pass: 'ghkwjd3ehd!'
			  }
			});

			var mailOptions = {
			  from: 'qoehd0@gmail.com',
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
			res.render('idcheck', { title: 'Express' });
	  
	};
	
	exports.idresult = function(req, res){
		var bodyNum =  req.body;
		console.log("넘버체크:"+bodyNum.numCheck);
		console.log("랜덤넘버:"+randomNum);
		if(bodyNum.numCheck == randomNum){
		  res.render('idresult');
		}else{
			res.send('<script type="text/javascript">alert("인증번호가 틀렸습니다!");location.href="idcheck"</script>');
			
		}
		};
	
	