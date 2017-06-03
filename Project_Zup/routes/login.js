
/*
 * GET users login.
 */
var mysql = require('mysql');
var fs = require('fs');
var ejs = require('ejs');

var client = mysql.createConnection({
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
	
	//출력
	console.log(req.body);
	console.log(login);
	console.log(password);
	
	//쿼리문
	client.query('select count(*) cnt from user where user_id=? and user_pw=?', [login,password], function(err, result){
		//res.render('index', {data: result});
		console.log('결과값');
		console.log(result);
		console.log('메인으로 가버렷!!!');
		var cnt = result[0].cnt;
		
		console.log(cnt);
		
		if(cnt === 1){
			req.session.user_id = login;
			console.log(req.session.user_id);
			console.log('정상 로그인');
			//res.send('<!-- Sweetalert --><script src="/stylesheets/js/sweetalert2.min.js"></script><link rel="stylesheet" type="text/css" href="/stylesheets/css/sweetalert2.min.css"><script type="text/javascript">swal({title : "비밀번호 미입력!",text : "비밀번호를 입력해주세요!",type :"warning"});location.href="/"</script>');
			
			res.send('<script type="text/javascript">alert("로그인 성공!!");location.href="/"</script>');
			//res.render('index');
		}else{
			//res.json({result:'fail'});
			console.log('로그인 실패');
			res.send('<script type="text/javascript">alert("로그인 실패..");location.href="/login"</script>');
			res.render('login');
		
		}
		
	});
	
};	