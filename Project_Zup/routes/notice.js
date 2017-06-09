
/*
 * GET users listing.
 */
var mysql = require("mysql");
var fs = require("fs");
var ejs = require("ejs");
var moment = require("moment");
var express = require("express");
var bodyParser = require("body-Parser");
var countresult;
var pageSize = 20;
var pageCount = 1;
var currentPage = 1;

var app = express();
app.use(bodyParser.urlencoded({
	extended: false
}));


var client = mysql.createConnection({
	host: '192.168.0.67',
	user: "root",
	password: "root",
	database: "zup"
});


exports.fnq = function(req, res){
	res.render('fnq');
}

exports.contact = function(req, res){
	res.render('contact');
}





exports.count = function(req, res){
	client.query("update article set article_viewpoint = article_viewpoint+1 where article_num=?", [req.query.article_num],function(err, result) {
			res.redirect('notice');
	});
}

exports.edit = function(req, res){
	var sessionUserId = req.session.user_id;
	client.query("select *" +
			" from article "+
			" where article_num > 0 and article_num=?",[req.query.article_num], function(error, results) {
				console.log(results);
				res.render('noticeedit', {
				data: results,
				sessionId: sessionUserId
				});
			});
		};

exports.editresult = function(req, res){
	var body = req.body
	client.query("update article" +
				" set article_title=? , article_content=? where article_num=?",[body.title,body.content,req.query.article_num], function(error, results) {
				res.redirect('notice');
			});
		};

exports.noticeadd = function(req, res){
	console.log("noticeadd들어옴");
	var body = req.body;
	client.query("insert into article(board_num, article_writer, article_title, article_content, employee_num)" +
				" values(1,?,?,?,1) ",['관리자',body.title, body.content], function(error, results) {
				res.redirect('notice');
			});
		};

exports.delete = function(req, res){
	client.query("delete from article" +
				" where article_num=?",[req.query.article_num], function(error, results) {
				res.redirect('notice');
			});
		};
exports.notice = function(req, res){
	var sessionUserId = req.session.user_id;
	pageCount = (Math.ceil(countresult/pageSize));
	client.query("select count(article_num) counts from article", function(error, countresults) {
		countresult = countresults[0].counts;
		});
		if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }
    if (typeof req.query.searchType == "undefined") {
    	if(typeof req.query.page == 'undefined'){
			currentPage = 1;
		}
	client.query("select *" +
			" from article "+
			" where article_num > 0 and board_num = 1" +
			" order by article_num desc, articledate desc" +
			" limit ?,?",[(currentPage*20)-20,pageSize], function(error, results) {
				res.render('notice', {
				data: results,
				pageSize: pageSize,
			    pageCount: pageCount,
			    currentPage: currentPage,
			    searchValue: "",
			    searchType: "",
			    userid: req.session.user_id,
			    moment,
			    sessionId: sessionUserId
				});
			});
    	}
    if (typeof req.query.searchType !== 'undefined') {
    	if(typeof req.query.page == 'undefined'){
			currentPage = 1
		}
     }
};






