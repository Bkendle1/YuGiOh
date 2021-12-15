// const fs = require('fs');
// const path = require('path');

//include mongodb client
const MongoClient = require('mongodb').MongoClient;

//ObjectID
const ObjectId = require('mongodb').ObjectId;

//Define Database URL
const dbURL = process.env.DB_URI || 'mongodb://localhost';

// const FILENAME = path.join(__dirname + '/../src/files/cards.txt');

var services = function(app) {
	// MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
	// 	if (err) {
	// 		console.log(err);
	// 	} else {
	// 		//get database object
	// 		var dbo = client.db('deck');

	// 		//create the collection
	// 		dbo.createCollection('cards', function(err, client) {
	// 			if (err) {
	// 				console.log(err);
	// 			} else {
	// 				console.log('Collection created!');
	// 			}
	// 		});
	// 	}
	// });

	//create a record
	app.post('/write-record', function(req, res) {
		//create a key
		var id = 'card' + Date.now();

		var id = id;
		var cardName = req.body.cardName;
		var description = req.body.description;
		var cardType = req.body.cardType;
		var attribute = req.body.attribute;
		var level = req.body.level;

		//connect to database
		MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
			if (err) {
				res.send(JSON.stringify({ msg: err }));
			} else {
				var dbo = client.db('deck');
				//create JSON
				var newCard = {
					id: id,
					cardName: cardName,
					description: description,
					cardType: cardType,
					attribute: attribute,
					level: level
				};
				var search = { cardName: cardName };
				dbo.collection('cards').find(search).toArray(function(err, data) {
					if (err) {
						return res.send(JSON.stringify({ msg: err }));
					} else {
						if (data.length > 0) {
							return res.send(JSON.stringify({ msg: 'Card Already Exists' }));
						} else {
							dbo.collection('cards').insertOne(newCard, function(err) {
								if (err) {
									client.close();
									return res.send(JSON.stringify({ msg: 'Error: ' + err }));
								} else {
									client.close();
									return res.send(JSON.stringify({ msg: 'SUCCESS' }));
								}
							}); //end of collection
						}
					}
				});
			}
		}); //end of MongoClient
	}); //end of write-record

	//read records
	app.get('/read-records', function(req, res) {
		MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
			if (err) {
				return res.send(JSON.stringify({ msg: 'Error: ' + err }));
			} else {
				var dbo = client.db('deck');
				dbo.collection('cards').find().toArray(function(err, data) {
					if (err) {
						//what to do if can't connect
						client.close();
						return res.send(JSON.stringify({ msg: 'Error: ' + err }));
					} else {
						client.close();
						return res.send(JSON.stringify({ msg: 'SUCCESS', cardData: data }));
					}
				}); //end of collection
			}
		}); //end of MongoClient
	}); //end of read-records

	app.get('/get-cardsByType', function(req, res) {
		//card type
		var type = req.query.type;

		var search = type === '' ? {} : { type: req.query.type };

		MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
			if (err) {
				return res.status(200).send(JSON.stringify({ msg: 'Error: ' + err }));
			} else {
				var dbo = client.db('deck');
				dbo.collection('cards').find(search).toArray(function(err, data) {
					if (err) {
						client.close();
						return res.status(200).send(JSON.stringify({ msg: 'Error: ' + err }));
					} else {
						client.close();
						return res.status(200).send(JSON.stringify({ msg: 'SUCCESS', deck: data }));
					}
				});
			}
		}); //end of MongoClient
	}); //end of get-cardsByType

	app.put('/update-card', function(req, res) {
		var cardID = req.body.cardID;
		var name = req.body.name;
		var description = req.body.description;
		var type = req.body.type;
		var attribute = req.body.attribute;
		var level = req.body.level;

		// convert cardID into a variable Mongo can understand
		var c_id = new ObjectId(cardID);

		var search = { _id: c_id };
		var updateData = {
			$set: {
				name: name,
				description: description,
				type: type,
				attribute: attribute,
				level: level
			}
		};

		MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
			if (err) {
				return res.status(200).send(JSON.stringify({ msg: 'Error: ' + err }));
			} else {
				var dbo = client.db('deck');

				dbo.collection('cards').updateOne(search, updateData, function(err) {
					if (err) {
						client.close();
						return res.status(200).send(JSON.stringify({ msg: 'Error: ' + err }));
					} else {
						client.close();
						return res.status(200).send(JSON.stringify({ msg: 'SUCCESS' }));
					}
				});
			}
		}); //end of MongoClient
	}); //end of update-card

	app.delete('/delete-records', function(req, res) {
		var cardID = req.query.id;
		var search = cardID;

		//convert cardID for Mongo
		var c_id = new ObjectId(cardID);
		search = { _id: c_id };

		MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
			if (err) {
				res.send(JSON.stringify({ msg: err }));
			} else {
				var dbo = client.db('deck');
				dbo.collection('cards').deleteOne(search, function(err) {
					if (err) {
						res.send(JSON.stringify({ msg: err }));
					} else {
						res.send(JSON.stringify({ msg: 'SUCCESS' }));
						client.close();
					}
				});
			}
		}); //end of MongoClient
	}); //end of delete-records
}; //end of services

module.exports = services;
