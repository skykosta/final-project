
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

/**
 * order
 */
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

/**
 * orderresult요청시
 */
exports.orderresult = function(req, res){
	var sessionUserId = req.session.user_id;
	pageCount = (Math.ceil(countresult/pageSize));
	client.query("select count(bottlelist_num) counts from bottle_list", function(error, countresults) {
		countresult = countresults[0].counts;
		});
		if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }
    if (typeof req.query.searchType == "undefined") {
    	if(typeof req.query.page == 'undefined'){
			currentPage = 1;
		}
	client.query("select	bl.bottlelist_num,"+ 
							"u.user_name,"+ 
							"u.user_phonenum,"+ 
							"u.user_address,"+ 
							"e.employee_name,"+ 
							"e.employee_phonenum,"+ 
							"b.bottle_name,"+ 
							"bl.bottle_amount,"+
							"bl.return_status"+
				" from user u, employee e, bottle_list bl, bottle b"+
				" where bl.user_num=u.user_num"+ 
			    " and bl.employee_num=e.employee_num"+ 
	            " and bl.bottle_num=b.bottle_num"+
	            " order by bottlelist_num desc"+
	            " limit ?, ?",[(currentPage*20)-20,pageSize], function(error, results) {
				res.render('orderresult', {
				data: results,
				pageSize: pageSize,
			    pageCount: pageCount,
			    currentPage: currentPage,
			    searchValue: "",
			    searchType: "",
			    sessionId: sessionUserId
				});
			});
    	}
    if (typeof req.query.searchType !== 'undefined') {
    	if(typeof req.query.page == 'undefined'){
			currentPage = 1;
		}
    	if(req.query.searchType === 'bn'){
    		client.query("select	bl.bottlelist_num,"+ 
					"u.user_name,"+ 
					"u.user_phonenum,"+ 
					"u.user_address,"+ 
					"e.employee_name,"+ 
					"e.employee_phonenum,"+ 
					"b.bottle_name,"+ 
					"bl.bottle_amount,"+
					"bl.return_status"+
		" from user u, employee e, bottle_list bl, bottle b"+
		" where bl.user_num=u.user_num"+ 
	    " and bl.employee_num=e.employee_num"+ 
        " and bl.bottle_num=b.bottle_num"+
        " and bottlelist_num=?"+
        " order by bottlelist_num desc"+
        " limit ?, ?",[req.query.value,(currentPage*20)-20,pageSize] ,function(error, results) {
    			console.log("아이디필터");
        		res.render('orderresult', {
        			data: results,
        		    pageSize: pageSize,
        		    pageCount: pageCount,
        		    currentPage: currentPage,
        		    searchValue: req.query.value,
        		    searchType: req.query.searchType,
        		    sessionId: sessionUserId
        			});
        		});
    	}else if(req.query.searchType === 'un'){
    		client.query("select	bl.bottlelist_num,"+ 
					"u.user_name,"+ 
					"u.user_phonenum,"+ 
					"u.user_address,"+ 
					"e.employee_name,"+ 
					"e.employee_phonenum,"+ 
					"b.bottle_name,"+ 
					"bl.bottle_amount,"+
					"bl.return_status"+
		" from user u, employee e, bottle_list bl, bottle b"+
		" where bl.user_num=u.user_num"+ 
	    " and bl.employee_num=e.employee_num"+ 
        " and bl.bottle_num=b.bottle_num"+
        " and user_name=?"+
        " order by bottlelist_num desc"+
        " limit ?, ?",[req.query.value,(currentPage*20)-20,pageSize] ,function(error, results) {
    			console.log("아이디필터");
        		res.render('orderresult', {
        			data: results,
        		    pageSize: pageSize,
        		    pageCount: pageCount,
        		    currentPage: currentPage,
        		    searchValue: req.query.value,
        		    searchType: req.query.searchType,
        		    sessionId: sessionUserId
        			});
        		});	
    		}else{
    		client.query("select	bl.bottlelist_num,"+ 
					"u.user_name,"+ 
					"u.user_phonenum,"+ 
					"u.user_address,"+ 
					"e.employee_name,"+ 
					"e.employee_phonenum,"+ 
					"b.bottle_name,"+ 
					"bl.bottle_amount,"+
					"bl.return_status"+
		" from user u, employee e, bottle_list bl, bottle b"+
		" where bl.user_num=u.user_num"+ 
	    " and bl.employee_num=e.employee_num"+ 
        " and bl.bottle_num=b.bottle_num"+
        " and user_phonenum=?"+
        " order by bottlelist_num desc"+
        " limit ?, ?",[req.query.value,(currentPage*20)-20,pageSize] ,function(error, results) {
    			console.log("이메일필터");
        		res.render('orderresult', {
        			data: results,
        		    pageSize: pageSize,
        		    pageCount: pageCount,
        		    currentPage: currentPage,
        		    searchValue: req.query.value,
        		    searchType: req.query.searchType,
        		    sessionId: sessionUserId
        			});
        		});
    		}
        }
};


/**
 * user요청시
 */

exports.user = function(req, res){
	var sessionUserId = req.session.user_id;
    pageCount = (Math.ceil(countresult/pageSize));
    client.query("select count(user_num) counts from user", function(error, countresults) {
    	countresult = countresults[0].counts;
    	});
    if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }
    if (typeof req.query.searchType == "undefined") {
    	if(typeof req.query.page == 'undefined'){
			currentPage = 1;
		}
		client.query("select * from user limit ?,?",[(currentPage*20)-20,pageSize] ,function(error, results) {
			res.render('user', {
				data: results,
			    pageSize: pageSize,
			    pageCount: pageCount,
			    currentPage: currentPage,
			    searchValue: "",
			    searchType: "",
			    sessionId: sessionUserId
				});
			});
    	}
    if (typeof req.query.searchType !== 'undefined') {
    	if(typeof req.query.page == 'undefined'){
			currentPage = 1;
		}
    	if(req.query.searchType === 'i'){
    		client.query("select * from user where user_id = ? limit ?,?",[req.query.value,(currentPage*20)-20,pageSize] ,function(error, results) {
    			console.log("아이디필터");
        		res.render('user', {
        			data: results,
        		    pageSize: pageSize,
        		    pageCount: pageCount,
        		    currentPage: currentPage,
        		    searchValue: req.query.value,
        		    searchType: req.query.searchType,
        		    sessionId: sessionUserId
        			});
        		});
    	}else{
    		client.query("select * from user where user_email = ? limit ?,?",[req.query.value,(currentPage*20)-20,pageSize] ,function(error, results) {
    			console.log("이메일필터");
        		res.render('user', {
        			data: results,
        		    pageSize: pageSize,
        		    pageCount: pageCount,
        		    currentPage: currentPage,
        		    searchValue: req.query.value,
        		    searchType: req.query.searchType,
        		    sessionId: sessionUserId
        			});
        		});
    	}
    	
    	
        }
	};
	
/**
* total요청시
*/
	
exports.total = function(req, res){
	
	var sessionUserId = req.session.user_id;
	client.query("select u.user_address from user u, bottle_list bl" ,function(error, results) {
		var count1 = 0;
		var count2 = 0;
		var count3 = 0;
		var count4 = 0;
		var count5 = 0;
		var count6 = 0;
		var count7 = 0;
		var count8 = 0;
		var count9 = 0;
		var count10 = 0;
		var count11 = 0;
		var count12 = 0;
		var count13 = 0;
		var count14 = 0;
		var count15 = 0;
		var count16 = 0;
		var count17 = 0;
		var count18 = 0;
		var count19 = 0;
		var count20 = 0;
		var count21 = 0;
		var count22 = 0;
		var count23 = 0;
		var count24 = 0;
		var count25 = 0;
		
		var totalCount = [];
		//console.log(results.length);
		for (var i = 0; i < results.length; i++) {
			var address = results[i].user_address;
			var token = address.split(" ");
			for (var j = 0; j < token.length; j++) {
				switch (token[j]) {
				case "도봉구" : count1++;
				case "강북구" : count2++;
				case "노원구" : count3++;
				case "은평구" : count4++;
				case "성북구" : count5++;
				case "종로구" : count6++;
				case "동대문구" : count7++;
				case "중랑구" : count8++;
				case "서대문구" : count9++;
				case "중구" : count10++;
				case "성동구" : count11++;
				case "광진구" : count12++;
				case "용산구" : count13++;
				case "마포구" : count14++;
				case "강서구" : count15++;
				case "양천구" : count16++;
				case "구로구" : count17++;
				case "영등포구" : count18++;
				case "금천구" : count19++;
				case "관악구" : count20++;
				case "동작구" : count21++;
				case "서초구" : count22++;
				case "강남구" : count23++;
				case "송파구" : count24++;
				case "강동구" : count25++;
				}
			}
		}
		

		
		res.render('total', {
			count1: count1,
			count2: count2,
			count3: count3,
			count4: count4,
			count5: count5,
			count6: count6,
			count7: count7,
			count8: count8,
			count9: count9,
			count10: count10,
			count11: count11,
			count12: count12,
			count13: count13,
			count14: count14,
			count15: count15,
			count16: count16,
			count17: count17,
			count18: count18,
			count19: count19,
			count20: count20,
			count21: count21,
			count22: count22,
			count23: count23,
			count24: count24,
			count25: count25,
		    sessionId: sessionUserId
			});
		});
};



