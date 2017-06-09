
/*
 * GET users listing.
 */

exports.total = function(req, res){
	var sessionUserId = req.session.user_id;
  res.render("total",{
	  sessionId: sessionUserId
  });
};

