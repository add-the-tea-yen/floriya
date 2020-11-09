const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport');
const mongoose = require('mongoose');
var path = require('path');
const cookieSession = require('cookie-session')
//passport setup

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
    console.log('profile')
    return done(null, profile);
  }
));

//google auth code

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/login')
    }
}

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user.displayName}!`))

// Auth Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/d');
  }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/login');
})


//google auth code

// connection to db
mongoose.connect('mongodb+srv://user:admin@cluster0.zzpbu.mongodb.net/main?retryWrites=true&w=majority',{ useNewUrlParser: true ,useUnifiedTopology: true})
  .then(db => console.log('db connected'))
  .catch(err => console.log(err));

//no shit rule
  

//all the routes

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
app.use(express.static('public'))
// login page
app.get('/', function(req, res) {
    res.render('pages/loading');
});
app.get('/login', function(req, res) {
  res.render('pages/index');
});
// about page
app.get('/at', function(req, res) {
    res.render('pages/AT',{nameuser :req.user.displayName,pic:req.user.photos[0]});
});
// dashboard
var name = name;
app.get('/d',isLoggedIn , function(req, res) {
    res.render('pages/d',{nameuser :req.user.displayName,pic:req.user.photos[0]});
});
// paitients
app.get('/p', function(req, res) {
    res.render('pages/p',{nameuser :req.user.displayName,pic:req.user.photos[0]});
});
// schedeul
app.get('/s', function(req, res) {
    res.render('pages/s',{nameuser :req.user.displayName,pic:req.user.photos[0]});
});
// paitient details
app.get('/pd', function(req, res) {
    res.render('pages/pd',{nameuser :req.user.displayName,pic:req.user.photos[0]});
});
//random
// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set 'views' directory for any views 
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'));
  
app.listen(3000);
console.log('3000 is the magic port');