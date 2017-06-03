var mysql = require("mysql");

var client = mysql.createConnection({
	user: 'root',
	password: 'root',
//	password: 'root',
	database: 'zup'
});

//get 방식
exports.submit2 = function(req, res){
  console.log("접수하기 2페이지 get방식 요청");
  res.render("submit2", {name: "곽", telephone: "010-1234-5678"});
};

//post방식
exports.call = function(req, res){
  console.log("접수하기 2페이지 post방식 요청");


	  console.log("20 : " + req.body.name);
	  console.log("21 : " + req.body.telephone);
	  console.log("22 : " + req.body.mapAddress);
	  console.log("23 : " + req.body.detailAddress);
	  console.log("24 : " + req.body.lat);
	  console.log("25 : " + req.body.lng);
	  
	  var user_num = 1;
	  var employee_num = 1;
	  var user_id = "dlqudgjs";
	  
      var name = req.body.name;
      var tel = req.body.telephone;
      var mapAddress = req.body.mapAddress;
      var detailAddress = req.body.detailAddress;
      var address = mapAddress + detailAddress;
	 
	  client.query("insert into orderlist(user_num, employee_num)values(?, ?)",
		       [user_num, employee_num]);
      
	  client.query(
			  "update user set user_address = ? where user_num = ? AND user_id = ?",
			  [address, user_num, user_id],
			  function(){
//				    res.redirect('/regresult/:id='+body.inputId);
					res.render("submit3", {
						name : name,
						tel : tel,
						mapAddress : mapAddress,
						detailAddress : detailAddress						  
					});			  
			  });

};