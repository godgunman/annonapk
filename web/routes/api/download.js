exports.index = function(req, res) {
    var id = req.query.id;
    if (id === undefined || id.match(/^[a-zA-Z0-9:.]+$/) == null) {
        res.send({"error": "Invalid id format."});
        return;
    }

    var exec = require('child_process').exec;
    var path = require('path');
    var mime = require('mime');
    var fs   = require('fs');

    function puts(error, stdout, stderr) {
//        res.send({"stdout": stdout, "stderr": stderr});
        var file = '../apk/files/' + id + '.apk';
        var filename = path.basename(file);
        var mimetype = mime.lookup(file);
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);
        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
        return;
    }
    exec("../download_apk/download/download.sh '" + id + "' '../../apk/files/" + id + "'", puts);
};
