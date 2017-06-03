
/*
 * GET users listing.
 */
var mysql = require("mysql")
var fs = require("fs")
var ejs = require("ejs")
var moment = require("moment")
var express = require("express")
var bodyParser = require("body-Parser")
var countresult;
var pageSize = 20
var pageCount = 1
var currentPage = 1;

var app = express()
app.use(bodyParser.urlencoded({
	extended: false
}))


var client = mysql.createConnection({
	user: "root",
	password: "zx12zx12",
	database: "zup"
})


exports.cancel = function(req, res){
	var body = req.body
	client.query("update orderlist set order_status=?, cancelreason=? where order_num=?", ['취소완료', body.cancelreason, body.order_num],function(err, result) {
			res.redirect('order');
	})
}

exports.count = function(req, res){
	client.query("update article set article_viewpoint = article_viewpoint+1 where article_num=?", [req.query.article_num],function(err, result) {
			res.redirect('notice1');
	})
}

exports.edit = function(req, res){
	client.query("select *" +
			" from article "+
			" where article_num > 0 and article_num=?",[req.query.article_num], function(error, results) {
				console.log(results);
				res.render('noticeedit', {
				data: results
				})
			})
}


exports.notice = function(req, res){
	pageCount = (Math.ceil(countresult/pageSize))
	client.query("select count(article_num) counts from article", function(error, countresults) {
		countresult = countresults[0].counts
		})
		if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }
    if (typeof req.query.searchType == "undefined") {
    	if(typeof req.query.page == 'undefined'){
			currentPage = 1
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
			    moment
				})
			})
    	}
    if (typeof req.query.searchType !== 'undefined') {
    	if(typeof req.query.page == 'undefined'){
			currentPage = 1
		}
    	if(req.query.searchType === 'on'){
    		client.query("select *" +
    				" from user u, orderlist o, employee e" +
    				" where o.user_num=u.user_num" +
    				" and o.employee_num=e.employee_num" +
    				" and o.order_num=?"+
    				" limit ?,?",[req.query.value,(currentPage*20)-20,pageSize] ,function(error, results) {
        		res.render('order', {
        			data: results,
        		    pageSize: pageSize,
        		    pageCount: pageCount,
        		    currentPage: currentPage,
        		    searchValue: req.query.value,
        		    searchType: req.query.searchType,
        		    moment
        			})
        		})
    	}else if(req.query.searchType === 'un'){
    		client.query("select *" +
    				" from user u, orderlist o, employee e" +
    				" where o.user_num=u.user_num" +
    				" and o.employee_num=e.employee_num" +
    				" and u.user_name=?"+
    				" limit ?,?",[req.query.value,(currentPage*20)-20,pageSize] ,function(error, results) {
        		res.render('order', {
        			data: results,
        		    pageSize: pageSize,
        		    pageCount: pageCount,
        		    currentPage: currentPage,
        		    searchValue: req.query.value,
        		    searchType: req.query.searchType,
        		    moment
        			})
        		})	
    		}else{
    		client.query("select *" +
    				" from user u, orderlist o, employee e" +
    				" where o.user_num=u.user_num" +
    				" and o.employee_num=e.employee_num" +
    				" and u.user_phonenum=?"+
    				" limit ?,?",[req.query.value,(currentPage*20)-20,pageSize] ,function(error, results) {
        		res.render('order', {
        			data: results,
        		    pageSize: pageSize,
        		    pageCount: pageCount,
        		    currentPage: currentPage,
        		    searchValue: req.query.value,
        		    searchType: req.query.searchType,
        		    moment
        			})
        		})
    		}
        }
};


