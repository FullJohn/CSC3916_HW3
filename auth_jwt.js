var passport = require('passport');
const { authenticate } = require('passport/lib');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

require("dotenv").config();
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("JWT");
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    var user = db.find(jwt_payload.id);

    if (user) {
        console.log(passport.authenticate('jwt'));
        done(null, user);
    } else {
        done(null, false);
    }
}));
exports.isAuthenticated = passport.authenticate('jwt', { session : false });
exports.secret = opts.secretOrKey ;