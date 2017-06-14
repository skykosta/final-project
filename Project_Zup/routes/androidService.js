var mysql = require("mysql");
var request = require("request");
var firebase = require("firebase");

var client = mysql.createConnection({
	host: '192.168.0.59',
	user: 'root',
	password: 'root',
	database: 'zup'
});

//직원이 접수하기 승낙시
exports.mreceipt = function(req, res){

	var user_num = parseInt(req.body.user_num);
	var employee_num = parseInt(req.body.employee_num);
	
	console.log("user_num :" + user_num);
	console.log("employee_num : " + employee_num);
	
	  client.query("insert into orderlist(user_num, employee_num)values(?, ?)",
			      [user_num, employee_num]);
	  
		var deviceId = "fmSaNS8SGNs:APA91bHHFX_mvKzAeNzbJNCaT0MNwrmAPdEm6Tf1fA6-qjzP5ZfYapDFtLv1RbGpyhQHlmppWzNAxpEdNHB9eG0t22htB_c0DeBiACJQr8dYBx0eBshu4ugb4p3KyNC68bkRPoKSDJ_N";

		sendMessageToUser(deviceId);
		
	    function sendMessageToUser(deviceId) {

			request({
				url : 'https://fcm.googleapis.com/fcm/send',
				method : 'POST',
				headers : {
					'Content-Type' : 'application/json',
	  	  		    'Authorization' : 'key=AIzaSyBSbZnXnWynFcza_5hg5T3KlXIKgpwE3lg'
				},
				body : JSON.stringify({	
					
					"data" : {		
						        
						      "mreceipt" : "줍맨 접수 확인"

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
					console.log('줍맨 접수 확인 JSON 메세지 전송 성공!');
				}
			});
		}//sendMessageToUser()
}


//회수완료
exports.mresult = function(req, res){
	
	
	console.log("mresult 호출됨.");
	
//	console.log("user_num : " + req.body.user_num);
//	console.log("order_num : " + req.body.order_num);
//	console.log("bottleArray : " + req.body.bottleArray);
//	console.log("employee_num : " + req.body.employee_num);
	
	var employee_num = req.body.employee_num;
	var order_num = req.body.order_num;
	var user_num = req.body.user_num;
	var bottleArray = JSON.parse(req.body.bottleArray);



    for (var i = 0; i < bottleArray.length; i++) {
    	
    	console.log("bottle_amount :" + bottleArray[i].bottle_amount);
    	console.log("bottle_num :" + bottleArray[i].bottle_num);
	}

	
	//회수완료시 orderlist, userlog,  
	
	/*
	  client.query("insert into userlog(user_num, logtype, status) values(?,'대기', '회수예정')",
                   [user_num]);
	*/
    
	client.query("delete from orderlist where user_num = ? and employee_num = ?",
		         [user_num, employee_num]);

    
	var deviceId = "fmSaNS8SGNs:APA91bHHFX_mvKzAeNzbJNCaT0MNwrmAPdEm6Tf1fA6-qjzP5ZfYapDFtLv1RbGpyhQHlmppWzNAxpEdNHB9eG0t22htB_c0DeBiACJQr8dYBx0eBshu4ugb4p3KyNC68bkRPoKSDJ_N";

	sendMessageToUser(deviceId);
	
    function sendMessageToUser(deviceId) {
    	
    	

		request({
			url : 'https://fcm.googleapis.com/fcm/send',
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json',
  	  		    'Authorization' : 'key=AIzaSyBSbZnXnWynFcza_5hg5T3KlXIKgpwE3lg'
			},
			body : JSON.stringify({	
				
				"data" : {		
					        
					      "mresult" : "회수완료 요청 확인완료"

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
				console.log('회수완료 요청 확인완료 JSON 메세지 전송 성공!');
			}
		});
	}//sendMessageToUser()
	
}//mresult


//직원 앱 로그인시 오더 리스트 넘겨주기.
exports.mlogin = function(req, res){
	
	var user_num;
	var user_id;
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
	
	console.log("mlogin 호출됨.");
//	console.log(req.body.id);
//	console.log(req.body.password);
//	console.log(req.body.token);
	
	//디바이스 키값, 위도 경도 세팅
//	var deviceId = "fmSaNS8SGNs:APA91bHHFX_mvKzAeNzbJNCaT0MNwrmAPdEm6Tf1fA6-qjzP5ZfYapDFtLv1RbGpyhQHlmppWzNAxpEdNHB9eG0t22htB_c0DeBiACJQr8dYBx0eBshu4ugb4p3KyNC68bkRPoKSDJ_N";
	var deviceId = req.body.token;

	   client.query("select employee_num from employee where device_key = ?",
                    [deviceId], function(error, results){
		   
		   var employee_num = results[0].employee_num;
		   
		   sendMessageToUser(deviceId, employee_num);
		   
		   function sendMessageToUser(deviceId, remployee_num) {
		    	
		    	console.log("employee_num :" + employee_num);

				request({
					url : 'https://fcm.googleapis.com/fcm/send',
					method : 'POST',
					headers : {
						'Content-Type' : 'application/json',
		  	  		    'Authorization' : 'key=AIzaSyBSbZnXnWynFcza_5hg5T3KlXIKgpwE3lg'
					},
					body : JSON.stringify({	
						
						"data" : {		
							        
							      "login" : employee_num						   
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
						console.log('orderlist 데이터 JSON 메세지 전송 성공!');
					}
				});
			}//sendMessageToUser()
		   
		   
	   });//client.query
	
	
       client.query(
    	   

           "select o.order_num," +
                  "o.orderdate,"+ 
        	      "u.user_num,"+ 
        	      "u.user_id,"+
        	      "u.user_name,"+
        	      "u.user_phonenum,"+
        	      "u.user_address,"+
        	      "u.lat,"+
        	      "u.lng" +
           " from orderlist o join user u"+
           		 " on o.user_num = u.user_num"+
           " where employee_num = ( select employee_num"+
                                 " from employee"+
                                 " where device_key = ?)" 
   
    	   
       ,[deviceId], function(error, results){
    		   
//        console.log(results);
//         console.log(results.length);
//       console.log(results[0]);

 
    	for (var i = 0; i < results.length; i++) {
			var result = results[i]

			sendMessageToUser(deviceId, result);
			
			}

	    function sendMessageToUser(deviceId, result) {
	    	
			request({
				url : 'https://fcm.googleapis.com/fcm/send',
				method : 'POST',
				headers : {
					'Content-Type' : 'application/json',
	  	  		    'Authorization' : 'key=AIzaSyBSbZnXnWynFcza_5hg5T3KlXIKgpwE3lg'
				},
				body : JSON.stringify({	
					
					"data" : {		
						        
						      "order" : result
						   
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
					console.log('orderlist 데이터 JSON 메세지 전송 성공!');
				}
			});
		}//sendMessageToUser()
		  
       });//client.query 
	   
		res.render("lsj", {message: "이승진 몽춍이 ㅗ"});
		  

};//exports.lsj1 = function(req, res)