const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const UserModel = require('../models/UserSchema');
const secret = "CMPE_273_Splitwise_secret";

function auth() {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = secret;
  passport.use(new JwtStrategy(opts, function (jwt_payload, callback) {
    UserModel.findOne({ email: jwt_payload.email }, function (err, user) {
      if (err) {
        return callback(err, false);
      }
      if (user) {
        const modifiedUser = user.toObject()
        modifiedUser.userId = user._id;
        callback(null, modifiedUser);
      } else {
        callback(null, false);
      }
    }).catch(error => {
      console.log("Error in authorizing user", error)
    });
  }));
};

exports.auth = auth;
exports.checkAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user, info) => {
    if (error || !user) {
      console.log("Inside if");
      const error = {
        errorMessage: "Please login to continue",
      };
      return res.status(401).json(error);
    }
    else {
      console.log("Inside else");
      req.user = user;
    }
    return next();
  })(req, res, next);
};