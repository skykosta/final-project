
/*
 * GET users listing.
 */

exports.regresult = function(req, res){
	console.log(req.params.id);
  console.log("결과창 겟겟");
	res.render('regresult');
};


//exports.regresult2 =  function(req,res){
	 //console.log(req);
	/* console.log("결과창 포스트");
	 res.render('regresult');
	};*/
