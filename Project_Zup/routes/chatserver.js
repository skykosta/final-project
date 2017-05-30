
/*
 * GET home page.
 */

exports.chat = function(req, res){
  res.render('chatserver', { title: 'Express' });
};