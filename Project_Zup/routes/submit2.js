var mysql = require("mysql");

var client = mysql.createConnection({
	user: 'root',
	password: '024931',
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

	/*
	  console.log("20 : " + req.body.name);
	  console.log("21 : " + req.body.telephone);
	  console.log("22 : " + req.body.mapAddress);
	  console.log("23 : " + req.body.detailAddress);
	*/
      var name = req.body.name;
      var tel = req.body.telephone;
      var mapAddress = req.body.mapAddress;
      var detailAddress = req.body.detailAddress;
   
	  res.render("submit3", {
		
		  name : name,
		  tel : tel,
		  mapAddress : mapAddress,
		  detailAddress : detailAddress
		  
	    });
	  
	  /*
	  client.query('insert into user (user_id, user_pw, user_name, user_phonenum, user_address, user_email, user_bankname, user_banknum) values(?,?,?,?,?,?,?,?)',
	  [body.inputId, body.inputPassword, body.inputName, body.inputNumber, body.address_base+body.address_detail, body.inputEmail, body.inputBank, body.inputAccount ], function(){
	     res.redirect('/regresult/:id='+body.inputId);
	  });
	  */
	
};