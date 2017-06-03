//get 방식
exports.submit2 = function(req, res){
  console.log("접수하기 2페이지 get방식 요청");
  res.render("submit2", {name: "곽", telephone: "010-1234-5678"});
};
