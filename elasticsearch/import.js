var elasticsearch = require('elasticsearch');
var csv = require('csv-parser');
var fs = require('fs');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info',
  requestTimeout: Infinity
});

const transformData = data => {
  const { lat, lng, zip, title, timeStamp, twp, addr } = data;

  const category = title.split(':')[0];
  const detail = title.split(':')[1].trim();

  return {
    coordinates: { lon: parseFloat(lng), lat: parseFloat(lat)},
    zip,
    category,
    detail,
    date: new Date(timeStamp),
    twp,
    addr
  }
}

// Fonction utilitaire permettant de formatter les données pour l'insertion "bulk" dans elastic
function createBulkInsertQuery(calls) {
  const body = calls.reduce((acc, call) => {
    acc.push({ index: { _index: '911', _type: 'call' } })
    acc.push( call )
    return acc
  }, []);
  return { body };
}

client.indices.create({ 
  index: '911',
  body : {
    mappings: {
      call: {
        properties : {
          coordinates : { type: 'geo_point' }
        }
      }
    }
  }
}, (err, resp) => {
  if (err) console.trace(err.message);
  insert();
});

const insert = () => {
let calls = [];
fs.createReadStream('../911.csv')
  .pipe(csv())
  .on('data', data => {
    calls.push(transformData(data));
    console.log(data)
  })
  .on('end', () => {
    client.bulk(createBulkInsertQuery(calls), (err, resp) => {
      if (err) console.trace(err.message);
      else console.log(`Inserted ${resp.items.length} calls`);
      client.close();
    });
  });
}