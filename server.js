var records = [];
var host = "127.0.0.1";
var port = process.env.port || 8080;
var express = require("express");
var request = require('request');
var csv = require('csv');
var http = require('http');

var app = express();
var server = http.createServer(app);

app.use(app.router); //use both root and other routes below
app.use(express.static(__dirname + '/public')); //use static files in ROOT/public folder

app.get("/", function(request, response){
	response.send('The service');
});

app.get("/games", function(request, response){
    response.json(records);
});

request.get('http://db.chezalex.net/dbdatabase.csv', function (error, response, body) {
	if (!error && response.statusCode == 200) {
        // Continue with your processing here.
        csv().from.string(body)
		.to.array(function(data, count){
			data.forEach(function(item){
				if('no' !== item[0]){ //ignore header row
					var record = {};
					record.no = item[0];
					record.timestamp = item[1];
					record.valid = item[2];
					record.hometeam = item[3];
					record.visitorsteam = item[4];
					record.winner = item[5];
					record.finalscore = item[6];
					record.rulesversion = item[7];
					record.homecoach = item[8];
					record.homerank = item[9];
					record.homeinj = item[10];
					record.viscoach = item[11];
					record.visrank = item[12];
					record.visinj = item[13];
					record.teamwon = item[14];
					record.teamlost = item[15];
					
					records.push(record);
				}
			});

			listen();
		});
	}
});

function listen(){
	//app.listen(port, host);
	server.listen(port);
	console.log("listening %d", server.address().port)
}
