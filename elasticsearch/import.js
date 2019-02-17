var elasticsearch = require('elasticsearch');
var csv = require('csv-parser');
var fs = require('fs');

var esClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error'
});

fs.createReadStream('../911.csv')
    .pipe(csv())
    .on('data', data => {
      // TODO extract one line from CSV
    })
    .on('end', () => {
      // TODO insert data to ES
    });
