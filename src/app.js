//bring in module
const express = require('express');
//create object
const app = express();
//bring in body-parser
const bodyParser = require('body-parser');
//bring in path object
const path = require('path');

//handle incoming requests

app.use((req, res, next) => {
	//create response header (research)
	res.header('Access-Control-Allow-Origin', '*');

	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//create an alias to access our files/folders in the client directory
app.use('/client', express.static(path.resolve(__dirname + '/../client/')));

//Make the server
var server;
//port number, this is where our server is going to run
var port = 5000;

//Page listeners (our router)
//go pull in our .js file that's in this directory
var router = require('./router.js');
router(app);

//Service listeners (our data processes)
var services = require('./services.js');
services(app);

//Listen
server = app.listen(port, function(err) {
	if (err) {
		throw err;
	}

	console.log('Listening on port ' + port);
});
