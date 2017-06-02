
/*
 * users listing.
 */
var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');


var client = mysql.createConnection({
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



