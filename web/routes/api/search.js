exports.index = function(req, res) {
    var query = req.query.q;
    if (query === undefined || query.match(/^[1-9a-zA-Z ]+$/) == null) {
        res.send({"error": "Invalid query string."});
        return;
    }

    var exec = require('child_process').exec;
    function puts(error, stdout, stderr) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(stdout);
        res.end();
    }
    exec("../download_apk/search/search.py '" + query + "'", puts);
};
