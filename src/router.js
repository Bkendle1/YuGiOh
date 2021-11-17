//controls page requests

const path = require('path');

//Page Listeners
//retrieve pages
var router = function(app) {
	app.get('/', function(req, res) {
		res.status(200).sendFile(path.join(__dirname + '/../client/home.html'));
	});

	// app.get('/', function(req, res) {
	// 	res.status(200).sendFile(path.join(__dirname + '/../client/index.html'));
	// });

	app.get('/index', function(req, res) {
		res.status(200).sendFile(path.join(__dirname + '/../client/index.html'));
	});

	app.get('/table', function(req, res) {
		res.status(200).sendFile(path.join(__dirname + '/../client/table.html'));
	});
};

module.exports = router;
