const getFlickrUrl = (photo) => `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;

const map = {
  id: (r) => r.id,
  owner: (r) => r.owner,
  lon: (r) => r.longitude,
  lat: (r) => r.latitude,
  place_id: (r) => r.place_id,
  url_t: (r) => r.url_t,
  url_o: (r) => r.url_o,
  url_flickr: (r) => getFlickrUrl(r),
  width: (r) => r.width_o,
  height: (r) => r.height_o,
  descr: (r) => r.description && r.description._content ? r.description._content : null,
  title: (r) => r.title,
  accuracy: (r) => r.accuracy,
  datetaken: (r) => r.datetaken,
  tags: (r) => r.tags,
  machine_tags: (r) => r.machine_tags,
  media: (r) => r.media,
};

export default map;