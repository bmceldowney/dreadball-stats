var csv = require('csv');
var request = require('request');
var records = [];

exports.data = records;

getData();
setInterval(getData, (1000 * 60) * 5);

function getData(){
	request.get('http://db.chezalex.net/dbdatabase.csv', function (error, response, body) {
		if (!error && response.statusCode == 200) {
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
			});
			
			console.log('data fetched at ' + Date(Date.now()).toString());
		}
	});
}
