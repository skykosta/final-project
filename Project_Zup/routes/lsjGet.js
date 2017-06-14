var mysql = require("mysql");
var request = require("request");
var firebase = require("firebase");

var client = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: 'root',
	database: 'zup'
});

exports.lsj2 = function(req, res){
	
	var user_num;
	var user_id = "rhkrtjdrb";
	var user_pw;
	var user_name;
	var user_phonenum;
	var user_address;
	var user_bankname;
	var user_banknum;
	var user_zupmoney;
	var regdate;
	var dropdate;
	var ismember;
	var data;
	
	//디바이스 키값, 위도 경도 세팅
	var deviceId = "fsXFrBLwN8g:APA91bFwe4Gd-LzFEfWrHcSRh0O9cCp06W7VWYosoKPfbsoc9meBWAiWp30FffqTtJ7aEzowWvTDpQnTF9dtzywLr5ex8sZTu6a_k23IrrrUzRUPu73FpXsVKTNq-Qz5hIJ8lkIuxMnn";
	
	
	console.log("lsj GET 호출됨.");
	console.log(req.body.id);
	console.log(req.body.password);
	        
    /*
	  client.query("insert into userlog(user_num,logtype,status,content) values(?,'대기','회수대기중..','회수예정')",
                [user_num]);
    
	  client.query("insert into orderlist(user_num, employee_num)values(?, ?)",
	           [user_num, employee_num]);	  
	  
	  client.query("update user set user_address = ? where user_num = ? AND user_id = ?",
		       [address, user_num, user_id],
		       
		       function(){
//			    res.redirect('/regresult/:id='+body.inputId);
				res.render("receipt3", {
					name : name,
					tel : tel,
					mapAddress : mapAddress,
					detailAddress : detailAddress						  
				});			  
		  });
	   */
//	   client.query("select * from user where user_id = ?", [user_id], function(error, results){
       client.query("select * from user", function(error, results){
    	  
//    	  console.log(results[0].user_name)
//    	  console.log(results[0].user_phonenum)
//    	  console.log(results);
//    	  console.log(results[0].user_name);
//    	  console.log(results[0].user_phonenum);
    	
		/*
  		res.render('receipt2', {
			name: results[0].user_name,
			tel : results[0].user_phonenum
			});
		*/

	    //안드로이드와 통신하기.
	    sendMessageToUser(deviceId);

	    function sendMessageToUser(deviceId) {

			request({
				url : 'https://fcm.googleapis.com/fcm/send',
				method : 'POST',
				headers : {
					'Content-Type' : 'application/json',
					'Authorization' : 'key=AIzaSyBcGM6s4SQtDGLWQlb9Lab60HUF8kGcZP4'
				},
				body : JSON.stringify({
					"data" : {					
					     
						"order" : results
						
						/*
						"name" : name,
					    "tel" : tel,
						"message" : latData,
						"address" : address
					    */
					},
					"to" : deviceId
				})
			}, function(error, response, body) {
				if (error) {
					console.error(error, response, body);
				} else if (response.statusCode >= 400) {
					console.error('HTTP Error: ' + response.statusCode + ' - '
							+ response.statusMessage + '\n' + body);
				} else {
					console.log('JSON 메세지 전송 성공!')
				}
			});
		}//sendMessageToUser()
		  
       });//client.query 
	   
	 res.render("lsj", {message: "이승진 몽춍이 ㅗ"});
		  
};//exports.lsj2 = function(req, res)