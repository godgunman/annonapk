var exec = require('child_process').exec;

exports.run = function(req, res) {
    console.log(req.files);
    // get the temporary location of the file
    var tmp_path = req.files.apk.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    
    mkdirp.sync('../apk/files/');

    var target_path = '../apk/files/' + req.files.apk.name;
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + req.files.apk.size + ' bytes');
        });

        var callback = function(error, stdout, stderr) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(stdout);
            res.end();
        };
        exec("../script/analyze_apk.py " + target_path, callback);
    });
};

