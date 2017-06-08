
/*
 * GET users listing.
 */
var mysql = require("mysql");
var fs = require("fs");
var ejs = require("ejs");
var countresult;
var pageSize = 20;
var pageCount = 1;
var currentPage = 1;


var client = mysql.createConnection({
	host: '192.168.0.67',
	user: "root",
	password: "root",
	database: "zup"
});


exports.order = function(req, res){
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
			    searchType: ""
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
        		    searchType: req.query.searchType
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
        		    searchType: req.query.searchType
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
        		    searchType: req.query.searchType
        			});
        		});
    		}
        }
};

