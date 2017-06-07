exports.receipt = function(req, res){
	
//	  var user_id = req.session.user_id;
	
	/*
	  if(user_id == null){
		  alert("로그인 후 접수하기를 이용 하실 수 있습니다.");
	  }else{
		  res.render('receipt');
	  }
	 */

	res.render('receipt');
	
};