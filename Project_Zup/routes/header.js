
/*
 * GET home page.
 */

exports.header = function(req, res){
	console.log('로그인후 헤더'+req.session.user_id);
	  var sessionUserId = req.session.user_id;
	  res.render('header', { 
		  title: 'Express',
		  sessionId : sessionUserId
			  });
};