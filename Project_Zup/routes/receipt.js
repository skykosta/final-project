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

//1페이지
exports.receipt = function(req, res){
	var sessionUserId = req.session.user_id;
	res.render('receipt', {
		sessionId: sessionUserId
	});
	
};

//2페이지
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

//3페이지 보여주기
//post 방식 실시간 접수 데이터 보내주기
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
	  
	  //일단 접수하면 모든 직원한테 가야함.
	  //유저 로그에는 하나씩만 들어가고 직원한테만 3번 보내야함
	  
	  //디바이스 키값, 위도 경도 세팅            
      client.query("select user_num from user where user_id = ?", [user_id], function(error, user_results){
    	  
    	  var user_num = user_results[0].user_num;

    	  client.query("select device_key from employee",function(errer, device_results){
    		  
    		  for(var i = 0; i < device_results.length; i++){
    	          var deviceId = device_results[i].device_key;
    		      sendMessageToUser(deviceId, lat, lng);
    		  }
    	  });//client.query
    	      	  
      //안드로이드와 통신하기.
      function sendMessageToUser(deviceId, lat, lng) {
        	  
      		request({
      			url : 'https://fcm.googleapis.com/fcm/send',
      			method : 'POST',
      			headers : {
      				'Content-Type' : 'application/json',
         		    'Authorization' : 'key=AIzaSyBSbZnXnWynFcza_5hg5T3KlXIKgpwE3lg'
      			},
      			body : JSON.stringify({
      				"data" : { "rorder" :
      				                   {					
      						   "user_num" : user_num,
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
      				console.log('실시간 접수 요청 전송 성공!')
      			}
      		});
      	}//sendMessageToUser()   	 
    	
    	  //메일
          client.query('select user_email from user where user_id=?', [user_id], function(err, result){
    			//res.render('index', {data: result});
//    			console.log('메일을 보내자');
//    			console.log(result);
    			var email = result[0].user_email;
//    			console.log("보내는 이메일 :"+email);
    			
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
	  
    	  client.query("update user set user_address = ?, lat = ?, lng = ? where user_num = ? AND user_id = ?",
		          [address, lat, lng, user_num, user_id],
		       
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