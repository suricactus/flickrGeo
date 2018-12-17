import Flickr from 'flickr-sdk';

const flickr = new Flickr('');

flickr.photos.search({
  // text: 'doggo',
  lat: 0.9671982,
  lon: 35.2320336,
  radius: 32,
  radius_units: 'km',
  extras: 'geo,date_taken',
}).then(function (res) {
  console.log('yay!', res.body.photos);
}).catch(function (err) {
  console.error('bonk', err);
});