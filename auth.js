var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
   function(username, password, done) {
       var user = { name: "admin"}; //could have called to a database to look this up
       if (username === user.name && password === "password") // tripple equal is type and value; double == is just equal
       {
           return done(null, user);
       }
       else
       {
           return done(null, false);
       }
   }
));

exports.isAuthenticated = passport.authenticate('basic', { session: false });
