
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
    var totalStudents = 80,
    	pageSize = 8,
    	pageCount = 80/8,
    	currentPage = 1;
    
    if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
    }
    
    
	client.query("select * from user limit 10, 10" ,function(error, results) {
		res.render('user', {
			data: results,
		    pageSize: pageSize,
		    pageCount: pageCount,
		    currentPage: currentPage
			})
		})
	};
