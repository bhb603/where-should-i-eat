'use strict';

const Yelp = require('yelp');

const YELP_MIN_SEARCH_RADIUS = 200;
const YELP_MAX_SEARCH_RADIUS = 40000;
const YELP_CATEGORY_RESTAURANTS = 'restaurants';
const YELP_SORT_BEST_MATCH = 0;
const YELP_SORT_DISTANCE = 1;
const YELP_SORT_RATING = 2;

function findRestaurant(req) {
  let yelp = new Yelp({
    consumer_key: process.env.YELP_CONSUMER_KEY,
    consumer_secret: process.env.YELP_CONSUMER_SECRET,
    token: process.env.YELP_TOKEN,
    token_secret: process.env.YELP_TOKEN_SECRET
  });

  let searchOptions = {
    location: req.query.location,
    sort: YELP_SORT_RATING,
    category_filter: YELP_CATEGORY_RESTAURANTS
  };

  if (req.query.radius) {
    searchOptions.radius_filter = _getSearchRadiusFromMiles(req.query.radius);
  }

  return yelp.search(searchOptions)
    .then((data) => {
      return data.businesses[_getRandomInt(0, data.businesses.length)];
    });
}

function _getSearchRadiusFromMiles(miles) {
  let meters = parseFloat(miles) * 1609;

  if (meters <= YELP_MIN_SEARCH_RADIUS) {
    return YELP_MIN_SEARCH_RADIUS;
  }
  if (meters >= YELP_MAX_SEARCH_RADIUS) {
    return YELP_MAX_SEARCH_RADIUS;
  }
  return meters;
}

function _getRandomInt(min, max) {
  return Math.floor(Math.random()*(max - min)) + min;
}

module.exports = {
  findRestaurant: findRestaurant
};
