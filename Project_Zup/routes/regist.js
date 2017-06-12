
/*
 * users listing.
 */
var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');


var client = mysql.createConnection({
	host: '192.168.0.67',
	user: 'root',
	password: 'root',
	database: 'zup'
});
//get방식
exports.regist = function(req, res){
	console.log('화면만 겟겟');
		res.render('regist');
};


//post방식
exports.regist2 = function(req, res){
 var body = req.body;
 
  client.query('insert into user (user_id, user_pw, user_name, user_phonenum, user_address, user_email, user_bankname, user_banknum) values(?,?,?,?,?,?,?,?)',
		  [body.inputId, body.inputPassword, body.inputName, body.inputNumber, body.address_base+"*"+body.address_detail, body.inputEmail, body.inputBank, body.inputAccount ], function(){
	  res.redirect('/regresult?id='+body.inputId);
  });
};

exports.idCheckConfirm = function(req, res){
	res.render('idCheckConfirm');
};

exports.idCheckConfirm2 = function(req, res){
	var body = req.body;
	
	  client.query('select user_id from user where user_id = ?',[body.id],
			   function(error, result){
		  console.log(result);
		  var cnt = result[0].cnt;
		  console.log(cnt);
		  if(cnt === 1){
				console.log(req.session.user_id);
				console.log('아이디 중복');
				//res.send('<!-- Sweetalert --><script src="/stylesheets/js/sweetalert2.min.js"></script><link rel="stylesheet" type="text/css" href="/stylesheets/css/sweetalert2.min.css"><script type="text/javascript">swal({title : "비밀번호 미입력!",text : "비밀번호를 입력해주세요!",type :"warning"});location.href="/"</script>');
				
				res.send('<script type="text/javascript">alert("로그인 실패.."); window.close();</script>');
				//res.render('index');
			}else{
				//res.json({result:'fail'});
				console.log('아이디 중복아님');
				res.send('<script type="text/javascript">alert("로그인 실패.."); return false;</script>');
				//res.render('login');
			
			}
		  
		  
		  
	  });
	};



