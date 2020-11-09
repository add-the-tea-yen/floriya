const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});
passport.use(new GoogleStrategy({
    clientID: "201734197350-pr6kt7jn1d39gq8l3ndiilhhds9qqide.apps.googleusercontent.com",
    clientSecret: "cE1yihNRbOuEUdr1cOI5ckVG",
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('ID: '+profile.id);
    console.log('Name: '+profile.displayName);
    console.log('Email : '+profile.emails[0].value);
    return done(null, profile);
  }
));