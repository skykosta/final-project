
/*
 * GET home page.
 */

exports.intro = function(req, res){
	  res.render('intro', { 
		  title: 'Express'
			  });
};