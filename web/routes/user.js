var UserModel = require('../store/models/user').model,
    util = require('util'),
    passport = require('passport');
/*
 * GET users listing.
 */

exports.profile = function(req, res){
//  console.log(req.user);
  res.render('profile', { user: req.user }); 
};

exports.profileApi = function(req, res){
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(req.user));
  res.end();
};

exports.register = function(req, res) {
  UserModel.findOne({
    'authType':'local', 
    'email':req.body.email,
  }, 
  function(err, user) {
    if(err || user) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      if (user) {
        errorMessage = {
          error : {
            message : 'This email is already registered.',
            type : '',
            code : '201',
          }
        };
      }
      else {
        errorMessage = {
          error : {
            message : err,
            type: "ServerError",
            code: "100",
          }
        };
      }
      res.write(JSON.stringify(errorMessage));
      res.end();
   
    } else {
      var newUser = new UserModel({
        username : req.body.username,
        password : req.body.password, 
        email : req.body.email,
        authType : 'local',
      })
      
      newUser.save(function(err) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        v = delete newUser['password'];
        newUser['password'] = undefined;
        userMessage = {
          meta: '',
          notifications: [],
          user: newUser,
        };
        res.write(JSON.stringify(userMessage));
        res.end();   
      });
    }
  })
}

exports.getLogin = function(req, res) {
  res.render('login', { user: req.user, message: req.session.messages }); 
};

/**
 * POST /login
 * Use passport.authenticate() as route middleware to authenticate the
 * request.  If authentication fails, the user will be redirected back to the
 * login page.  Otherwise, the primary route function function will be called,
 * which, in this example, will redirect the user to the home page.
 *
 * curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
 *
 */
 
exports.postLogin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      return res.redirect('/user/login')
    }   
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/user/profile');
    }); 
  })(req, res, next);
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
}
