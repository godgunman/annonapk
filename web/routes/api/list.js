exports.index = function(req, res) {
    var exec = require('child_process').exec;
    function puts(error, stdout, stderr) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(stdout);
        res.end();
    }
    exec("../script/search.pl", puts);
};
