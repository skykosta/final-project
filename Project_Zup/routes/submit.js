/*
var mysql = require("mysql")
var fs = require("fs")
var ejs = require("ejs")

var client = mysql.createConnection({
	host: "192.168.0.70",
	user: "root",
	password: "zx12zx12",
	database: "zup"
})

client.connect();

exports.list = function(req, res){
	client.query("select * from user", function(error, results) {
		console.log(results);
		})
};

*/

exports.list = function(req, res){
	  res.render('submit', { title : "접수하기 페이지1!!!" });
};