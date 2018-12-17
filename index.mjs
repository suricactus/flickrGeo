import Twitter from 'twitter';


const client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

const params = {
	q: 'filter:images lion',
	// geocode: '0.9671982,35.2320336,40km'
};

const emptyArr = (arr) => {
	if(Array.isArray(arr)) {
		return arr.length ? false : true;
	}

	return true;
};

client.get('search/tweets', params, (error, tweets, response) => {
  if (!error) {
  	const statuses = tweets.statuses.filter(s => !emptyArr(s.entities.media) || !emptyArr(s.entities.urls));

  	statuses.forEach(s => delete s.user)

  	console.log(statuses)
    // console.log(tweets.statuses[1].entities.media);
  }

  console.error(error)
});