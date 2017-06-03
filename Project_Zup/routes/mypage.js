
/*
 * GET users listing.
 */


var mysql = require('mysql');
var fs = require('fs');
var ejs = require('ejs');

// 데이터 베이스와 연결
var client = mysql.createConnection({
	user: 'root',
	password: 'root',
	database: 'zup'
});

client.connect();

exports.mypage = function(req, res){
  client.query('select * from user u, userlog l where u.user_num = l.user_num and u.user_num=1', function(error, result){
	  console.log(result);
  	if(error){
  		console.log('쿼리 문장에 오류 있숨');
  	}else{
  		res.render('mypage', {
  			data: result,
  		});
  	}
  });
};

exports.mypage_change = function(req, res){
	 var body = req.body;
	 console.log(body);
	 client.query('update user set user_pw=?, user_phonenum=?, user_address=?, user_email=?, user_bankname=?, user_banknum=? where user_num = ?',
			  [body.inputPassword, body.inputNumber, body.address_base + body.address_detail, body.inputEmail, body.inputBank, body.inputAccount, body.user_num ], function(){
	     res.redirect('/mypage');
	  });
	};