
/*
 * users login.
 */
var mysql = require('mysql');
var fs = require('fs');
var ejs = require('ejs');
var crypto = require('crypto');


var client = mysql.createConnection({
	host: '192.168.0.67',
	user: 'root',
	password: 'root',
	database: 'zup'
});

//get 방식
exports.login = function(req, res){
	  res.render('login');
	};
	
//post 방식
exports.login2 = function(req, res){
	
	//쿠키생성
	var login = req.body.inputId;
	var password = req.body.inputPassword;
	var hashpass = crypto.createHash("sha512").update(password).digest("base64");
	//출력
	console.log(req.body);
	console.log(login);
	console.log(password);
	
	//쿼리문
	 
	
		client.query('select ismember from user where user_id=?', [login], function(err, results){
			var ismember = results[0].ismember;
			console.log(ismember);
			console.log(results);
			client.query('select count(*) cnt from user where user_id=? and user_pw=?', [login,hashpass], function(err, result){
				
			
		//res.render('index', {data: result});
		console.log('결과값');
		console.log(result);
		console.log('메인으로 가버렷!!!');
		var cnt = result[0].cnt;
		
		console.log(cnt);
		
		if(cnt === 1 && ismember === 'Y'){
			req.session.user_id = login;
			console.log(req.session.user_id);
			console.log('정상 로그인');
			
			res.send('<script type="text/javascript">location.href="/"</script>');
		}else{
			console.log('로그인 실패');
			res.send('<script type="text/javascript">alert("아이디나 비밀번호를 다시 확인해 주십시오.");location.href="login"</script>');
		
		}
		
	});
	
	
});
};