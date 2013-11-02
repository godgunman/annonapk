exports.index = function(req, res) {
    var query = req.query.q;
    if (query === undefined || query.match(/^[1-9a-zA-Z ]+$/) == null) {
        res.send({"error": "Invalid query string."});
    }

    var exec = require('child_process').exec;
    function puts(error, stdout, stderr) {
        stdout = "<pre>" + stdout + "</pre>";
        res.send(stdout);
    }
    exec("cowsay '" + query + "'", puts);
};
