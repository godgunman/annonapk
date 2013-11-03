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

exports.pricing = function(req, res) {
    res.render('pricing', {
        title: appName
    });
};
