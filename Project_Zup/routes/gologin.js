

//get 방식
exports.gologin = function(req, res){
	  req.session.destroy(function(err){
		  
		  res.send('<script type="text/javascript">alert("로그인화면으로 이동합니다.!!");location.href="/login"</script>');
	  });
	};
	


	
	