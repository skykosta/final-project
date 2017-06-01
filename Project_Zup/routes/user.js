
/*
 * GET users listing.
 */
/*
 * GET users listing.
 */
var mysql = require("mysql")
var fs = require("fs")
var ejs = require("ejs")

var client = mysql.createConnection({
	user: "root",
	password: "zx12zx12",
	database: "zup"
})

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.user = function(req, res){
	client.query("select * from user", function(error, results) {
		res.render('user', {
			data: results
			})
		})
	};
