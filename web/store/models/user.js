var mongoose = require('mongoose'),
//  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;

//******* Database schema TODO add more validation
var Schema = mongoose.Schema;

// User schema
var userSchema = new Schema({
  username: { type: String, required: true },
  authType: { type: String, required: true },
  authId: { type: String },
  email: { type: String },
  password: { type: String },
  admin: { type: Boolean, default: false },
  meta : {type: String },
  created : { type: Date, default: Date.now},
});

userSchema.path('meta').get(function(v) {
  return JSON.parse(v);
});

userSchema.set('toJSON', { getters: true, virtuals: false });

// Bcrypt middleware
userSchema.pre('save', function(next) {
  var user = this;

  if(!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

// Export user model
exports.model = mongoose.model('UserModel', userSchema);

