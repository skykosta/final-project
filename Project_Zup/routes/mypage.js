/*
 * GET users listing.
 */


var mysql = require('mysql');
var fs = require('fs');
var ejs = require('ejs');
var moment = require("moment");
var crypto = require('crypto');

// 데이터 베이스와 연결
var client = mysql.createConnection({
	host: '192.168.0.67',
	user: 'root',
	password: 'root',
	database: 'zup'
});

client.connect();


exports.mypage = function(req, res){
	var User_address;
	var User_address_base;
	var User_address_detail;
	
	client.query('select user_address from user where user_id=?',[req.session.user_id], function(err, user_address){
		var user_address = user_address[0].user_address;
		console.log(user_address);
		User_address= user_address.split("*");
		User_address_base = User_address[0];
		User_address_detail = User_address[1];
	});
	
	  client.query('select * from user where user_id=?',[req.session.user_id], function(error0, user){
		  client.query('select * from userlog where user_num=(select user_num from user where user_id=?)',[req.session.user_id], function(error1, log){
			  if(error0){
				  console.log('쿼리 문장에 오류 있숨');
			  }else{
				  res.render('mypage', {
					  user : user,
					  log : log,
					  moment,
					  User_address_base : User_address_base,
					  User_address_detail : User_address_detail,
					  sessionId: req.session.user_id
				  });
			  }
		  });
	  });
	};

exports.mypage_change = function(req, res){
	 var body = req.body;
	 client.query('update user set user_pw=?, user_phonenum=?, user_address=?, user_email=?, user_bankname=?, user_banknum=? where user_id = ?',
			  [body.inputPassword, body.inputNumber, body.address_base+"*"+body.address_detail, body.inputEmail, body.inputBank, body.inputAccount, req.session.user_id ], function(){
		 
		 res.redirect('/mypage');
	  });

	};
	
	exports.delete = function (req, res){
		client.query('delete from userlog where userlog_num = ?', [req.params.userlog_num], function(){
			res.redirect('/mypage');
		});
		
	};
		
	exports.drop = function(req, res){
		 var user_id = req.session.user_id;
		 var user_pw = req.params.user;
		 var hashpass = crypto.createHash("sha512").update(user_pw).digest("base64");
		 console.log("========회원 탈퇴 요청 정보========");
		 console.log(user_id);
		 console.log(req.params.user);
		 
		 client.query('select count(*) cnt from user where user_id=? and user_pw=?', [user_id, hashpass], function(err, result){
				var cnt = result[0].cnt;
				
				if(cnt === 1){
					client.query('update user set ismember = "N" where user_id=? and user_pw=?', [user_id, hashpass]);
					res.redirect('logout');
				}else{
					res.send('<script type="text/javascript">alert("비밀번호를 다시 확인해 주십시오.");location.href="/mypage";</script>');
				}
				
			});
		 
		 
		 
	};
	

	exports.withdrawal = function(req, res){
	       var user_id = req.session.user_id;
	       var zupmoney = req.params.withdrawalmoney;
	       
	       client.query('update user set zupmoney=? where user_id=?', [zupmoney, user_id]);
	       
	       res.redirect('/mypage');
	       
	};
