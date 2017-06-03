

//get 방식
exports.logout = function(req, res){
	  req.session.destroy(function(err){
		  
		  res.send('<script type="text/javascript">alert("로그아웃 성공!!");location.href="/"</script>');
	  });
	};
	


	
	