var appName = 'AnnonaPK';

exports.index = function(req, res) {
    res.render('index', {
        title: appName
    });
};

exports.pricing = function(req, res) {
    res.render('pricing', {
        title: appName
    });
};
