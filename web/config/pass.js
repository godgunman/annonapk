var passport = require('passport')
  , util = require('util')
  , UserModel = require('../store/models/user').model
  , LocalStrategy = require('passport-local').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = "531676303594092"
var FACEBOOK_APP_SECRET = "25a9a845d66cf1615bd88dee1f681b03";

var GOOGLE_CLIENT_ID = "883942239122.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "MYO7EWuCD4Lb4_TRS2nDUUhB";

var TWITTER_CONSUMER_KEY = "9ALUFj8DNxyFzvlJK0M3Jg";
var TWITTER_CONSUMER_SECRET = "lUH7cdl4D66LB9e0qGz61MNzDBAfxAsozq4KYsukpc";

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  UserModel.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  UserModel.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    UserModel.findOne({
      'authType' : 'google',
      'authId' : profile.id
    }, function(err, user) {
      
      if (err) {
        return done(err, user);
      }

      // raw data include '\n'. sucks ...
      profile._raw = profile._raw.replace('\n','');
      if (user) {
        user.username = profile.displayName;
        user.meta = profile._raw;
        user.email = profile.emails[0]['value'];
      } else {
        var user = new UserModel({
          'authType' : 'google',
          'authId' : profile.id,
          'username' : profile.displayName,
          'meta' : profile._raw,
          'email': profile.emails[0]['value'],
        }); 
      }
      // associate the Google account with a user record in your database,
      // and return that user instead.
      
      user.save(function(err) {
        process.nextTick(function () {
          return done(err, user);
        });
      }); 
    });
  }
));


// Use the TwitterStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Twitter profile), and
//   invoke a callback with a user object.
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },  
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...

    UserModel.findOne({
      'authType' : 'twitter', 
      'authId' : profile.id
    }, function(err, user) {
      
      if (err) {
        return done(err, user);
      }

      if (user) {
        user.username = profile.username;
        user.meta = profile._raw;
      } else {
        var user = new UserModel({
          'authType' : 'twitter',
          'authId' : profile.id,
          'username' : profile.username,
          'meta' : profile._raw,
        }); 
      }
      // associate the Twitter account with a user record in your database,
      // and return that user instead.
      
      user.save(function(err) {
        process.nextTick(function () {
          return done(err, user);
        });
      }); 
    });
  }
));

// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/facebook/callback"
  },  
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    console.log(profile);

    UserModel.findOne({
      'authType' : 'facebook', 
      'authId' : profile.id
    }, function(err, user) {
      
      if (err) {
        return done(err, user);
      }

      if (user) {
        user.username = profile.username;
        user.meta = profile._raw;
        user.email = profile.emails[0]['value'];
      } else {
        var user = new UserModel({
          'authType' : 'facebook',
          'authId' : profile.id,
          'username' : profile.username,
          'meta' : profile._raw,
          'email': profile.emails[0]['value'],
        }); 
      }
      // associate the Facebook account with a user record in your database,
      // and return that user instead.
      
      user.save(function(err) {
        process.nextTick(function () {
          return done(err, user);
        });
      }); 
    });

   }
));


// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/user/login');
}


// Check for admin middleware, this is unrelated to passport.js
// You can delete this if you use different method to check for admins or don't need admins
exports.ensureAdmin = function ensureAdmin(req, res, next) {
  return function(req, res, next) {
    if(req.user && req.user.admin === true)
      next();
    else
      res.send(403);
  }
}
