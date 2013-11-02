exports.index = function(req, res) {
    var id = req.query.id;
    if (id === undefined || id.match(/^[a-zA-Z1-9:.]+$/) == null) {
        res.send({"error": "Invalid id format."});
        return;
    }

    var exec = require('child_process').exec;
    function puts(error, stdout, stderr) {
        res.send({"stdout": stdout, "stderr": stderr});
        return;
    }
    exec("../download_apk/download/download.sh '" + id + "' '../../apk/" + id + "'", puts);
};
