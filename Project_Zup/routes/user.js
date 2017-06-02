
/*
 * GET users listing.
 */
/*
 * GET users listing.
 */
var mysql = require("mysql")
var fs = require("fs")
var ejs = require("ejs")
var countresult
var pageSize = 20
var pageCount = 1
var currentPage = 1;




var client = mysql.createConnection({
	user: "root",
	password: "zx12zx12",
	database: "zup"
})

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.user = function(req, res){
    pageCount = (Math.ceil(countresult/pageSize))
    client.query("select count(user_num) counts from user", function(error, countresults) {
    	countresult = countresults[0].counts
    	})
    if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }
    if (typeof req.query.searchType == "undefined") {
    	if(typeof req.query.page == 'undefined'){
			currentPage = 1
		}
		client.query("select * from user limit ?,?",[(currentPage*20)-20,pageSize] ,function(error, results) {
			res.render('user', {
				data: results,
			    pageSize: pageSize,
			    pageCount: pageCount,
			    currentPage: currentPage,
			    searchValue: "",
			    searchType: ""	
				})
			})
    	}
    if (typeof req.query.searchType !== 'undefined') {
    	if(typeof req.query.page == 'undefined'){
			currentPage = 1
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
        		    searchType: req.query.searchType
        			})
        		})
    	}else{
    		client.query("select * from user where user_email = ? limit ?,?",[req.query.value,(currentPage*20)-20,pageSize] ,function(error, results) {
    			console.log("이메일필터");
        		res.render('user', {
        			data: results,
        		    pageSize: pageSize,
        		    pageCount: pageCount,
        		    currentPage: currentPage,
        		    searchValue: req.query.value,
        		    searchType: req.query.searchType
        			})
        		})
    	}
    	
    	
        }
	};
