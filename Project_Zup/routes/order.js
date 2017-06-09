
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


exports.cancel = function(req, res){
	var body = req.body;
		client.query("update userlog set logtype=?, status=?, content=? where user_num=? and logtype=?  ", ['취소', '취소완료', '취소완료', body.user_num, '대기' ], function(err, result) {
	});
	
	client.query("update orderlist set order_status=?, cancelreason=? where order_num=?", ['취소완료', body.cancelreason, body.order_num],function(err, result) {
			res.redirect('order');
	});
	
};

exports.order = function(req, res){
	var sessionUserId = req.session.user_id;
	pageCount = (Math.ceil(countresult/pageSize));
	
		if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }
    if (typeof req.query.searchType == "undefined") {
    	if(typeof req.query.page == 'undefined'){
			currentPage = 1;
		}
    	client.query("select count(order_num) counts from orderlist", function(error, countresults) {
    		countresult = countresults[0].counts;
    		});
	client.query("select *" +
			" from user u, orderlist o, employee e" +
			" where o.user_num=u.user_num" +
			" and o.employee_num=e.employee_num" +
			" order by order_num desc"+
			" limit ?,?",[(currentPage*20)-20,pageSize], function(error, results) {
				res.render('order', {
				data: results,
				pageSize: pageSize,
			    pageCount: pageCount,
			    currentPage: currentPage,
			    searchValue: "",
			    searchType: "",
			    moment,
			    sessionId: sessionUserId
				});
			});
    	}
    if (typeof req.query.searchType !== 'undefined') {
    	if(typeof req.query.page == 'undefined'){
			currentPage = 1;
		}
    	if(req.query.searchType === 'on'){
        	client.query("select count(order_num) counts from orderlist where order_num=?",[req.query.value], function(error, countresults) {
        		countresult = countresults[0].counts;
        		});
    		client.query("select *" +
    				" from user u, orderlist o, employee e" +
    				" where o.user_num=u.user_num" +
    				" and o.employee_num=e.employee_num" +
    				" and o.order_num=?"+
    				" order by order_num desc"+
    				" limit ?,?",[req.query.value,(currentPage*20)-20,pageSize] ,function(error, results) {
        		res.render('order', {
        			data: results,
        		    pageSize: pageSize,
        		    pageCount: pageCount,
        		    currentPage: currentPage,
        		    searchValue: req.query.value,
        		    searchType: req.query.searchType,
        		    moment,
        		    sessionId: sessionUserId
        			});
        		});
    	}else if(req.query.searchType === 'un'){
        	client.query("select count(order_num) counts from orderlist where user_num=?",[req.query.value], function(error, countresults) {
        		countresult = countresults[0].counts;
        		});
    		client.query("select *" +
    				" from user u, orderlist o, employee e" +
    				" where o.user_num=u.user_num" +
    				" and o.employee_num=e.employee_num" +
    				" and u.user_name=?"+
    				" order by order_num desc"+
    				" limit ?,?",[req.query.value,(currentPage*20)-20,pageSize] ,function(error, results) {
        		res.render('order', {
        			data: results,
        		    pageSize: pageSize,
        		    pageCount: pageCount,
        		    currentPage: currentPage,
        		    searchValue: req.query.value,
        		    searchType: req.query.searchType,
        		    moment,
        		    sessionId: sessionUserId
        			});
        		})	;
    		}else{
            client.query("select count(order_num) counts from orderlist where user_phonenum=?",[req.query.value], function(error, countresults) {
            	countresult = countresults[0].counts;
            	});
    		client.query("select *" +
    				" from user u, orderlist o, employee e" +
    				" where o.user_num=u.user_num" +
    				" and o.employee_num=e.employee_num" +
    				" and u.user_phonenum=?"+
    				" order by order_num desc"+
    				" limit ?,?",[req.query.value,(currentPage*20)-20,pageSize] ,function(error, results) {
        		res.render('order', {
        			data: results,
        		    pageSize: pageSize,
        		    pageCount: pageCount,
        		    currentPage: currentPage,
        		    searchValue: req.query.value,
        		    searchType: req.query.searchType,
        		    moment,
        		    sessionId: sessionUserId
        			});
        		});
    		}
        }
};



