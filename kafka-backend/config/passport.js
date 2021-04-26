const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const UserModel = require('../models/UserSchema');
const secret = "CMPE_273_Splitwise_secret";

function auth() {
    console.log("Inside kafka-backend auth");
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = secret;
    passport.use(new JwtStrategy(opts, function (jwt_payload, callback) {
        UserModel.find({ email: jwt_payload.email }, function (err, user) {
            if (err) {
                console.log("Error in passport" + err)
                return callback(err, false);
            }
            if (user) {
                callback(null, user);
            } else {
                callback(null, false);
            }
        }).catch(error => {
            console.log("Error in authorizing user", error)
        });
    }));
};

exports.auth = auth;

exports.checkAuth = passport.authenticate('jwt', { session: false });