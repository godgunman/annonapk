var fs = require('fs');

exports.hightlight = function(req, res) {
  console.log(req.url);
  var url = '..'+req.url;
  console.log(url);

  fs.readFile(url, 'UTF-8', function(err, file) {
    if (err) {
    
    
    } else {
      console.log(file);
      res.render('highlight', {
        content:file
      });
    }
  });

}
