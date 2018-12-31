import Flickr from 'flickr-sdk';
import fs from 'fs';
import csv from 'csv';
import flickrApi2CsvMap from './flickrApi2CsvMap';


const JOURNAL_FILENAME = './journal.json';
const SEARCH_PARAMS_FILENAME = './search.csv';
const RESULT_FILENAME = './results.csv';
const flickr = new Flickr(process.env.FLICKR_API_KEY);
const ids = new Set();
const searchParams = [];

fs.closeSync(fs.openSync(RESULT_FILENAME, 'a+'));

fs.createReadStream(RESULT_FILENAME)
  .pipe(csv.parse())
  .on('error', (e) => {
    console.log(`Error: ${e}`)
  })
  .on('data', (d) => {
    ids.add(`${d[0]}${d[1]}`)
  })
  .on('end', () => {
    readSearchParams();
  });

const readSearchParams = () => {
  fs.createReadStream(SEARCH_PARAMS_FILENAME)
    .pipe(csv.parse({ columns: true, }))
    .on('data', (d) => {
      searchParams.push(d)
    })
    .on('end', async () => {
      for(const [idx, params] of searchParams.entries()) {
        await flickrSearch(params);
      }
    });
}

const flickrSearch = async (params) => {
  await flickr.photos.search({
    page: params.page || 0,
    radius: params.radius || 32,
    lat: params.lat,
    lon: params.lng,
    radius_units: 'km',
    extras: 'geo,date_taken,url_t,description,media,url_o',
    per_page: 250,
  }).then(function (res) {
    if(res.body.stat !== 'ok') throw new Error('Flickr responded with not ok status');

    return parseResults(params, res.body.photos);
  }).catch(function (err) {
    console.error('bonk', err);
  });
}

const parseResults = (geoParams, r) => {
  let skippedCount = 0;

  for(const photo of r.photo) {
    const row = {};

    // strongly dependent on the order of the elements
    for(const [col, cb] of Object.entries(flickrApi2CsvMap)) {
      row[ col ] = cb(photo);
    }

    const id = `${row.id}${row.owner}`;

    if(ids.has(id)) {
      skippedCount++;
      continue;
    }

    ids.add(id);

    stringifier.write(row);
  }

  console.log(`Parsed results ${r.photo.length - skippedCount} of ${r.photo.length} for ${JSON.stringify(geoParams)}`)


  if(r.page < r.pages) {
    return flickrSearch({
      ...geoParams,
      page: r.page + 1,
    });
  }

  return true;
};


const results = fs.createWriteStream(RESULT_FILENAME, { flags: 'a', });
const stringifier = csv.stringify({
    skip_empty_lines: true,
    header: true,
    columns: Object.keys(flickrApi2CsvMap),
  })
  .on('readable', () => {
    let row;
    console.log(`Write!!!`);

    while(row = stringifier.read()){

      results.write(row);
    }
  })
  .on('error', function(err){
    console.error(err.message);
  });
