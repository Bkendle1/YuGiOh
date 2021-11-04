const fs = require("fs");

const FILENAME = "./src/files/cards.txt";

var services = function(app) {
    //create a record
    app.post("/write-record", function(req, res){
        //capture client-sent data
        var cardData = {
            //client and server side variables are the same for readability
            cardName: req.body.cardName,
            description: req.body.cardDesc,
            cardType: req.body.cardType,
            attribute: req.body.attribute,
            level: req.body.level
        }
        
        console.log("Data: " + JSON.stringify(cardData));

        var deckData = [];

        if(fs.existsSync(FILENAME)) {
            //Read in current database
            //.readFile is async
            fs.readFile(FILENAME, "utf8", function(err, data) {
                if (err) {
                    res.send(JSON.stringify({msg:err}));
                } else {
                    deckData = JSON.parse(data);
                    
                    deckData.push(cardData);
                    
                    fs.writeFile(FILENAME, JSON.stringify(cardData), function(err) {
                        if (err) {
                            res.send(JSON.stringify({msg:err}));
                        } else {
                            res.send(JSON.stringify({msg: "SUCCESS"}))
                        }
                    });
                
                }

            });
            
        } else {
            //this basically runs once, when the file doesn't exist in the first place
            deckData.push(cardData);
            
            fs.writeFile(FILENAME, JSON.stringify(cardData), function(err) {
                if (err) {
                    res.send(JSON.stringify({msg:err}));
                } else {
                    res.send(JSON.stringify({msg: "SUCCESS"}))
                }
            });
        }
    
    })
    app.get('/get-records', function(req,res));

module.exports = services;
