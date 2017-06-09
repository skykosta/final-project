
exports.receipt3 = function(req, res){
	var sessionUserId = req.session.user_id;
  res.render('receipt3', { 
	      sessionId : sessionUserId 
	  });
};

