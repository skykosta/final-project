
/*
 * GET home page.
 */

exports.index = function(req, res){
	console.log('로그인후'+req.session.user_id);
	  var sessionUserId = req.session.user_id;
	  res.render('index', { 
		  title: 'Express',
		  sessionId : sessionUserId
			  });
};