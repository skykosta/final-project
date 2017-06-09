

//get 방식
exports.logout = function(req, res){
	  req.session.destroy(function(err){
		  
		  res.send('<script type="text/javascript">location.href="/"</script>');
	  });
	};
	


	
	