var mongodb = require('mongodb');
var csv = require('csv-parser');
var fs = require('fs');

var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb://localhost:27017/911-calls';

var insertCalls = function(db, callback) {
    var collection = db.collection('calls');

    var calls = [];
    fs.createReadStream('../911.csv')
        .pipe(csv())
        .on('data', data => {
            var splitTitle = data.title.split(': ');
            var call = {
              'category': splitTitle[0],
              'title': splitTitle[1],
              'desc': data.desc,
              'timestamp': new Date(data.timeStamp),
              'coordinates': [parseFloat(data.lng), parseFloat(data.lat)],
              'addr': data.addr,
              'zip': data.zip,
              'twp': data.twp,
              'e': data.e
            }; // DONE créer l'objet call à partir de la ligne
            calls.push(call);
        })
        .on('end', () => {
          collection.insertMany(calls, (err, result) => {
            callback(result)
          });
        });
}

MongoClient.connect(mongoUrl, (err, db) => {
    insertCalls(db, result => {
        console.log(`${result.insertedCount} calls inserted`);
        db.close();
    });
});
