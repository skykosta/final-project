
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
		  [body.inputId, body.inputPassword, body.inputName, body.inputNumber, body.address_base+body.address_detail, body.inputEmail, body.inputBank, body.inputAccount ], function(){
	  res.redirect('/regresult?id='+body.inputId);
  });
};

exports.idCheckConfirm = function(req, res){
	res.render('idCheckConfirm');
};

exports.idCheckConfirm2 = function(req, res){
	var id = req.param.id;
	
	  client.query('select user_id from user where user_id = ?',[id],
			   function(error, results){
		  if(results){
			  res.rander('idCheckConfirm', {
					data: "입력"
			  });
		  }else{
			  res.rander('idCheckConfirm', {
					data: "꺼져"
			  });
		  }
		  
		  
	  });
	};



