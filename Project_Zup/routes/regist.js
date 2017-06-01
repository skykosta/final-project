
/*
 * users listing.
 */
var mysql = require('mysql');


var client = mysql.createConnection({
	user: 'root',
	password: 'root',
	database: 'zup'
});

exports.regist = function(req, res){
	console.log('화면만 겟겟');
	  res.render('regist');
};

exports.regist2 = function(req, res){
 var body = req.body;
 
 console.log('데이터 입려억!!');
  console.log("가입 시작");
  client.query('insert into user (user_id, user_pw, user_name, user_phonenum, user_address, user_email, user_bankname, user_banknum) values(?,?,?,?,?,?,?,?)',
		  [body.inputId, body.inputPassword, body.inputName, body.inputNumber, body.address_base+body.address_detail, body.inputEmail, body.inputBank, body.inputAccount ], function(){
     res.redirect('/regresult/:id='+body.inputId);
  });
};

