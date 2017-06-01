/*
 * GET users login.
 */

exports.agree = function(req, res) {
	res.render('agree');
	console.log("동의 동의");
};

exports.agree2 = function(req, res) {

	console.log('동의 포스트로 넘어감');
    res.redirect('/regist');
};