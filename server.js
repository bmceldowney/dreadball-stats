var express = require("express");
var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var fetcher = require('./fetcher.js');
var mongoose = require('mongoose');
var User = require('./models/User.js');

var host = process.env.NODE_ENV === 'production' ? "dreadball-stats.herokuapp.com" : "localhost";
var port = process.env.PORT || 9999;

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/dreadnauts');

passport.use(new GoogleStrategy({
    returnURL: 'http://' + host + ':' + port + '/auth/google/return',
    realm: 'http://' + host + ':' + port + '/'
  },
  function(identifier, profile, done) {
	User.findOrCreate({ openId: identifier }, function(err, user, created) {
      if (created){
				debugger;
			};
			
			done(err, user);
    });
  }
));

var app = express();

app.use(express.logger());
app.use(express.compress());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router); //use both root and other routes below
app.use(express.static(__dirname + '/public')); //use static files in ROOT/public folder

app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return', 
  passport.authenticate('google', { successRedirect: '/games',
                                    failureRedirect: '/auth/google' }));

app.get("/games", function(request, response){
    response.json(fetcher.data);
});

function listen(){
	app.listen(port, function(){
		console.log("listening %d", port)
	});
}

listen();
