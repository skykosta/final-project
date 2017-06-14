
/*
 * GET users listing.
 */
var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');


var client = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: 'root',
	database: 'zup'
});

exports.regresult = function(req, res){
	  client.query('select * from user where user_id = ?',[
			req.query.id
		], function(error, result){
			res.render('regresult', {data: result});
		});
};

