
/*
 * GET users listing.
 */


var mysql = require('mysql');
var fs = require('fs');
var ejs = require('ejs');

// 데이터 베이스와 연결
var client = mysql.createConnection({
	host: '192.168.0.67',
	user: 'root',
	password: 'root',
	database: 'zup'
});

client.connect();


exports.mypage = function(req, res){
	console.log("======마이페이지 로그인한 아이디 ========");
	console.log(req.session.user_id);
	  client.query('select * from user where user_id=?',[req.session.user_id], function(error0, user){
		  client.query('select * from userlog where user_num=(select user_num from user where user_id=?)',[req.session.user_id], function(error1, log){
			  console.log("======User========");
			  console.log(user);
			  console.log("======Log========");
			  console.log(log);
			  if(error0){
				  console.log('쿼리 문장에 오류 있숨');
			  }else{
				  res.render('mypage', {
					  user : user,
					  log : log
				  });
			  }
		  });
	  });
	};

exports.mypage_change = function(req, res){
	 var body = req.body;
	 
	 
	 console.log("========바디========");
	 console.log(body);
	 client.query('update user set user_pw=?, user_phonenum=?, user_address=?, user_email=?, user_bankname=?, user_banknum=? where user_id = ?',
			  [body.inputPassword, body.inputNumber, body.address_base + body.address_detail, body.inputEmail, body.inputBank, body.inputAccount, req.session.user_id ], function(){
		 
		 res.redirect('/mypage');
	  });

	};
	
exports.drop = function(req, res){
	var bodyff = req.body;
	 console.log("========회원 탈퇴 바디========");
	 console.log(bodyff);
	 console.log("========회원 탈퇴 비밀번호========");
	 console.log(bodyff.user_pw1);
	
	var user_id = req.session.user_id;
	var user_pw = bodyff.user_pw1;
	 
	 console.log("========회원 탈퇴 요청 정보========");
	 console.log(user_id);
	 console.log(user_pw);
	 
	 client.query('select count(*) cnt from user where user_id=? and user_pw=?', [req.params.user_id, user_pw], function(err, result){
			//res.render('index', {data: result});
			console.log('탈퇴 결과값');
			console.log(result);
			console.log('카운터값! ');
			var cnt = result[0].cnt;
			
			console.log(cnt);
			
			if(cnt === 1){
				console.log(req.session.user_id);
				console.log('탈퇴 완료');
			}else{
				console.log('탈퇴 실패');
			}
			
		});
};
	
	
	
	
	
	