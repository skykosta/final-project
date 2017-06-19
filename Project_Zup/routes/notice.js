
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
var nodemailer = require('nodemailer');
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
	var sessionUserId = req.session.user_id;
	res.render('fnq',{
		sessionId: sessionUserId
	});
};

exports.contact = function(req, res){
	var sessionUserId = req.session.user_id;
	res.render('contact',{
		sessionId: sessionUserId
	});
};


//post	
exports.contact2 = function(req, res){
	var sessionUserId = req.session.user_id;
	var body =  req.body;
	var title = body.title;
	var message = body.message;
	console.log(title);
	console.log(message);
		
		
		client.query('select user_email from user where user_id=?', [sessionUserId], function(err, result){
			//res.render('index', {data: result});
			console.log('메일을 보내자');
			console.log(result);
			var email = result[0].user_email;
			console.log("보내는 이메일 :"+email);
			
//인증번호 보내기
				var transporter = nodemailer.createTransport({
					  service: 'gmail',
					  auth: {
					    user: 'zupkosta@gmail.com',
					    pass: 'zup12345'
					  }
					});
				
				var mailOptions = {
						  from: email,
						  to: 'zupkosta@gmail.com',
						  subject: '[ZUP] 고객으로 부터 질문이 도착하였습니다.' + title,
						  text: message
						  		
						  		
						  		
						};
				
				transporter.sendMail(mailOptions, function(error, info){
					  if (error) {
					    console.log(error);
					  } else {
					    console.log('Email sent: ' + info.response);
					  }
					});
				
				
				
				
				res.send('<script type="text/javascript">alert("메일이 전송되었습니다. 빠른시일내에 답변 드리겠습니다.");location.href="/"</script>');
			
			
		}); 
	};



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

exports.noticem = function(req, res){
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
			" where article_num > 0 and board_num = 2" +
			" order by article_num desc, articledate desc" +
			" limit ?,?",[(currentPage*20)-20,pageSize], function(error, results) {
				res.render('noticem', {
				data: results,
				pageSize: pageSize,
			    pageCount: pageCount,
			    currentPage: currentPage,
			    searchValue: "",
			    searchType: "",
			    moment
				});
			});
    	}
    if (typeof req.query.searchType !== 'undefined') {
    	if(typeof req.query.page == 'undefined'){
			currentPage = 1
		}
     }
};

exports.countm = function(req, res){
	client.query("update article set article_viewpoint = article_viewpoint+1 where article_num=?", [req.query.article_num],function(err, result) {
			res.redirect('mnotice');
	});
}






