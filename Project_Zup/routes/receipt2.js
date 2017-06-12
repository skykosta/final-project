var mysql = require("mysql");
var request = require("request");
var firebase = require("firebase");
var nodemailer = require('nodemailer');

var client = mysql.createConnection({
	host: '192.168.0.67',
	user: 'root',
	password: 'root',
	database: 'zup'
});

//get 방식
exports.receipt2 = function(req, res){
  console.log("접수하기 2페이지 get방식 요청");
  
  var user_id = req.session.user_id;
  
  if(user_id == null){
	  console.log("로그인 후 이용 가능합니다.");
  }else{
	  
      client.query("select user_name, user_phonenum, user_address from user where user_id = ?", [user_id], function(error, results){
 	 
  		res.render('receipt2', {
			name: results[0].user_name,
			tel : results[0].user_phonenum,
			address: results[0].user_address,
			sessionId: user_id
			});
      });
  }
};

//post 방식
/* 접수하기 페이지 안드로이드와 통신 */
exports.send = function(req, res){
	  
	  //위도 경도 받아오기
	  var lat = req.body.lat;
	  var lng = req.body.lng;
	  
	  //접수하기 페이지 값 받아오기
      var name = req.body.name;
      var tel = req.body.telephone;
      var mapAddress = req.body.mapAddress;
      var detailAddress = req.body.detailAddress;
      var address = mapAddress + "*" +detailAddress;
      
	  //유저 값 세팅
	  var user_id = req.session.user_id;
	  
	  //디바이스 키값, 위도 경도 세팅
	  var deviceId = "fsXFrBLwN8g:APA91bFwe4Gd-LzFEfWrHcSRh0O9cCp06W7VWYosoKPfbsoc9meBWAiWp30FffqTtJ7aEzowWvTDpQnTF9dtzywLr5ex8sZTu6a_k23IrrrUzRUPu73FpXsVKTNq-Qz5hIJ8lkIuxMnn";
//	  var deviceId = "fsXFrBLwN8g:APA91bFwe4Gd-LzFEfWrHcSRh0O9cCp06W7VWYosoKPfbsoc9meBWAiWp30FffqTtJ7aEzowWvTDpQnTF9dtzywLr5ex8sZTu6a_k23IrrrUzRUPu73FpXsVKTNq-Qz5hIJ8lkIuxMnn";
	
	  //직원 정보
	  var employee_num = 2; // 잦됨
    
      //안드로이드와 통신하기.
      sendMessageToUser(deviceId, lat, lng);

      function sendMessageToUser(deviceId, lat, lng) {
    	  
  		request({
  			url : 'https://fcm.googleapis.com/fcm/send',
  			method : 'POST',
  			headers : {
  				'Content-Type' : 'application/json',
  				'Authorization' : 'key=AIzaSyBcGM6s4SQtDGLWQlb9Lab60HUF8kGcZP4'
  			},
  			body : JSON.stringify({
  				"data" : { "rorder" :
  				                   {					
  						   "user_name" : name,
  						   "user_phonenum" : tel,
  						   "lat" : lat,
  						   "lng" : lng,
  						   "user_address" : address
  				                   }
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
  				console.log('전송 성공!')
  			}
  		});
  	}//sendMessageToUser()
      
      
      client.query("select user_num from user where user_id = ?", [user_id], function(error, results){
    	  
    	  var user_num = results[0].user_num;
    	
    	  //메일
          client.query('select user_email from user where user_id=?', [user_id], function(err, result){
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
    						  subject: user_id +'님으로부터 접수신청이 되었습니다' ,
    						  text: 
    							  '접수 고객명 :' + name+ '\n'+
    							  '접수 고객 전화번호 :' + tel + '\n'+
    							  '접수 고객 주소 :' + mapAddress+','+detailAddress
    						  		
    						  		
    						  		
    						};
    				
    				transporter.sendMail(mailOptions, function(error, info){
    					  if (error) {
    					    console.log(error);
    					  } else {
    					    console.log('Email sent: ' + info.response);
    					  }
    					});
    			
    		});
    	  
    	  client.query("insert into userlog(user_num, logtype, status) values(?,'대기', '회수예정')",
                  [user_num]);
      
    	  client.query("insert into orderlist(user_num, employee_num)values(?, ?)",
    			  [user_num, employee_num]);	  
	  
    	  client.query("update user set user_address = ? where user_num = ? AND user_id = ?",
		          [address, user_num, user_id],
		       
		          function(){
    		  		res.render("receipt3", {
    		  			name : name,
    		  			tel : tel,
    		  			mapAddress : mapAddress,
    		  			detailAddress : detailAddress,
    		  			sessionId: user_id
    		  		});			  
    	  });
      });     

};//send = function(req, res)