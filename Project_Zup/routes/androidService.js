var mysql = require("mysql");
var request = require("request");
var firebase = require("firebase");
var async = require("async");

var client = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'zup'
});


//금일 회수 내역 리스트 넘겨 주기
exports.mhistory = function(req, res){
	
	var employee_num = req.body.employee_num;
	var deviceId = req.body.token;
	
	console.log(employee_num);
	console.log(deviceId);


	
}//mhistory

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
}//mreceipt


//회수완료
exports.mresult = function(req, res){
	
	
	console.log("mresult 호출됨.");
	
	var employee_num = req.body.employee_num;
	var user_num = req.body.user_num;
	var bottleArray = JSON.parse(req.body.bottleArray);
	var deviceId = req.body.token;
    var zupmoney = 0;
    var soju = 100;
    var beer = 130;

    
    console.log(employee_num);
    console.log(user_num);
    console.log(bottleArray);
    console.log(deviceId);
                           
    for (var i = 0; i < bottleArray.length; i++) {
    	
    	var bottle_num = bottleArray[i].bottle_num;
    	var bottle_amount = bottleArray[i].bottle_amount;
        var bottle_price = 0;
    	
    	switch(bottle_num){
    	  
    	   case "1": case "2": case "3": case "4": 
    		     bottle_price = bottle_amount * soju;
    		     bottle_list(bottle_price);
    		     zupmoney += bottle_price
    		     break;
    	   
    	   case "5": case "6": case "7" : case "8":
    		     bottle_price = bottle_amount * beer;
    		     bottle_list(bottle_price);
    	       	 zupmoney += bottle_price;
    	       	 break;
    	}
    	
    	function bottle_list(price){
    		
    		console.log("적립될 줍머니 : " + price);
    		
    		//보틀 리스트 삽입
    		client.query("insert into bottle_list(employee_num," +
    											"user_num," +
    											"bottle_num," +
    											"bottle_amount," +
    											"bottle_price)"+
					     " values  ( ?,"+
					  			   " ?,"+
					  			   " ?,"+
					  			   " ?,"+
					  			   " ?)",
					 [employee_num,
						  user_num,
						bottle_num, 
				     bottle_amount, 
				             price]);
        };
    	
 	}//for()
    
	//고객 줍머니 적립
	client.query("update user set zupmoney = zupmoney + ? where user_num = ?",
	             [zupmoney, user_num]);

	//유저 내역 회수완료로 업데이트
    client.query(" update userlog set status = '회수완료', logtype = '완료', content = ?" +
                 " where status = '회수예정' and logtype = '대기' and user_num = ? ", 
                 [zupmoney, user_num]);
    
    //오더리스트 지우기
	client.query("delete from orderlist where user_num = ? and employee_num = ?",
		         [user_num, employee_num]);

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
	
	console.log("mlogin 호출됨.");
	
	var employee_id = req.body.employee_id;
	var employee_pw = req.body.employee_pw;
	var deviceId = req.body.token;
	
//	console.log(employee_id);
//	console.log(employee_pw);
//	console.log(deviceId);

	client.query('select count(*) cnt from employee where employee_id= ? and employee_pw= ?', 
            [employee_id, employee_pw], function(err, result){

		     var cnt = result[0].cnt;		
             if(cnt === 1){
            		async.series([
            			
       		         //로그인 시 오더리스트 넘겨주기
       		          function(callback){
       		        	    console.log("============로그인 성공===========");
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
       		        		
       		        		//금일 회수 내역 넘기기
       		        		client.query(" select b.employee_num,"+
       	                         "b.user_num,"+
       	                         "b.bottle_num,"+
       	                         "b.bottle_amount,"+
       	                         "b.return_status,"+
       	                         "b.returndate,"+
       	                         "u.user_name,"+
       	                         "u.user_phonenum,"+
       	                         "u.user_address,"+
       	                         "u.lat,"+
       	                         "u.lng"+
       	                 " from bottle_list b join user u"+ 
       	                        " on b.user_num = u.user_num"+
       	                	    " join employee e"+
       	                        " on b.employee_num = e.employee_num"+       	                        
       	                 " where device_key = ? AND DATE_FORMAT(b.returndate, '%Y-%m-%d')"+ 
       	                                           "= DATE_FORMAT(sysdate(), '%Y-%m-%d')",
       	                   [deviceId],
       	    function(error, results){

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
       						      "history" : result
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
       					console.log('회수내역 데이터 JSON 메세지 전송 성공!');
       				}
       			});
       		  }//sendMessageToUser()

       		});//client.query       		        		
       		        		
       		        		setTimeout(function(){
       				        	  
       		        			callback(null, 1);
       		        			
       		        		}, 2000); 
                      },//function(callback)
       		         
       		         function(callback){
               		
       		       	   client.query("select employee_num from employee where device_key = ?",
       		                      [deviceId], function(error, results){
       		       	   
       		       	   var employee_num = results[0].employee_num;
       		       	   
       		       	   sendMessageToUser(deviceId, employee_num);
       		       	   
       		       	   function sendMessageToUser(deviceId, remployee_num) {
       		       	    	
//       		       	    	console.log("employee_num :" + employee_num);

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
       		       					console.log('직원번호 데이터 JSON 메세지 전송 성공!');
       		       				}
       		       			});
       		       		}//sendMessageToUser()       		       	         		       	   
       		         });//client.query			                 		          
       		             callback(null, 2);
       		          }//function(callback)
       			
       	       ]);//async()            	             	 


              }else{
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
		       						      "status" : "로그인실패"
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
		       					console.log('로그인 실패 메세지 전송 성공!');
		       				}
		       			});
		       		}//sendMessageToUser()            	            	  	             
              }//else	
     });//client.login 체크
};//exports.mlogin = function(req, res)