var express = require("express");
var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var fetcher = require('./fetcher.js')

var host = "127.0.0.1";
var port = process.env.PORT || 8080;

passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:8080/auth/google/return',
    realm: 'http://localhost:8080/'
  },
  function(identifier, profile, done) {
	debugger;
	User.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });
  }
));

var app = express();

app.use(express.logger());
app.use(express.compress());
app.use(app.router); //use both root and other routes below
app.use(express.static(__dirname + '/public')); //use static files in ROOT/public folder

// Redirect the user to Google for authentication.  When complete, Google
// will redirect the user back to the application at
//     /auth/google/return
app.get('/auth/google', passport.authenticate('google'));

// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
app.get('/auth/google/return', 
  passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' }));

app.get("/games", function(request, response){
    response.json(fetcher.data);
});

function listen(){
	app.listen(port, function(){
		console.log("listening %d", port)
	});
}

listen();
