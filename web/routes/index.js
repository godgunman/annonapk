var appName = 'AnnonaPK';

exports.index = function(req, res) {
    res.render('index', {
        title: appName
    });
};

exports.search = function(req, res) {
    res.render('search', {
        title: appName
    });
};

exports.browse = function(req, res) {
    res.render('browse', {
        title: appName
    });
};

exports.pricing = function(req, res) {
    res.render('pricing', {
        title: appName
    });
};

exports.apkinfo = function(req, res) {
    res.render('apkinfo', {
        title: appName
    });
};
