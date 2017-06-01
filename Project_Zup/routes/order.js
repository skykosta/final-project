
/*
 * GET users listing.
 */
var mysql = require("mysql")
var fs = require("fs")
var ejs = require("ejs")
var countresult;
var client = mysql.createConnection({
	user: "root",
	password: "zx12zx12",
	database: "zup"
})


exports.order = function(req, res){
client.query("select count(user_num) counts from user", function(error, countresults) {
	countresult = countresults[0].counts})
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
            " limit 0, 10", function(error, results) {
			res.render('order', {
			data: results,
			count: countresult
			})
		})
};

