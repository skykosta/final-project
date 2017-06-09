exports.receipt = function(req, res){
	var sessionUserId = req.session.user_id;
	res.render('receipt', {
		sessionId: sessionUserId
	});
	
};