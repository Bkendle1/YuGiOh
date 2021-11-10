const fs = require('fs');
const path = require('path');

const FILENAME = path.join(__dirname + '/../src/files/cards.txt');
//for some reason, the program doesn't run this services.js file which is evident due to the fact that the console log that I'm using doesn't output to the console

var services = function(app) {
	//create a key
	var id = 'card' + Date.now();
	//create a record
	app.post('/write-record', function(req, res) {
		//capture client-sent data
		var cardData = {
			//client and server side variables are the same for readability
			id: id,
			cardName: req.body.cardName,
			description: req.body.description,
			cardType: req.body.cardType,
			attribute: req.body.attribute,
			level: req.body.level
		};

		console.log('Data: ' + JSON.stringify(cardData));
		console.log('in services');

		var deckData = [];

		if (fs.existsSync(FILENAME)) {
			//Read in current database
			//.readFile is async
			fs.readFile(FILENAME, 'utf8', function(err, data) {
				if (err) {
					res.send(JSON.stringify({ msg: err }));
				} else {
					deckData = JSON.parse(data);

					deckData.push(cardData);

					fs.writeFile(FILENAME, JSON.stringify(deckData), function(err) {
						if (err) {
							res.send(JSON.stringify({ msg: err }));
						} else {
							res.send(JSON.stringify({ msg: 'SUCCESS' }));
						}
					});
				}
			});
		} else {
			//this basically runs once, when the file doesn't exist in the first place
			deckData.push(cardData);

			fs.writeFile(FILENAME, JSON.stringify(deckData), function(err) {
				if (err) {
					res.send(JSON.stringify({ msg: err }));
				} else {
					res.send(JSON.stringify({ msg: 'SUCCESS' }));
				}
			});
		}
	});

	//read records
	app.get('/read-records', function(req, res) {
		fs.readFile(FILENAME, 'utf8', function(err, data) {
			if (err) {
				res.send(JSON.stringify({ msg: err }));
			} else {
				//convert JSON string to object
				deckData = JSON.parse(data);

				res.send(JSON.stringify({ msg: 'SUCCESS', cardData: deckData }));
			}
		});
	});
};

module.exports = services;
