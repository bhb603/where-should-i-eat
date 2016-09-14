'use strict';

/**
 * Dependencies
 */
const cache = require('memory-cache');
const Yelp = require('yelp');
const winston = require('winston');

/**
 * Yelp search constants
 */
const YELP_MIN_SEARCH_RADIUS = 200;
const YELP_MAX_SEARCH_RADIUS = 40000;
const YELP_DEFAULT_SEARCH_RADIUS = 1600;
const YELP_CATEGORY_RESTAURANTS = 'restaurants';
const YELP_SORT_BEST_MATCH = 0;
const YELP_SORT_DISTANCE = 1;
const YELP_SORT_RATING = 2;

/**
 * Cache TTL: 24 hours
 */
const CACHE_TTL = 24*60*60*1000;

/**
 * Find a random restaurant based on location and radius.
 * @param {Object} Express request object
 * @return {Promise}
 */
function findRestaurant(req) {

  let location = req.query.location;
  let radius = _getSearchRadius(req.query.radius);
  let cacheKey = `${location}:${radius}`;

  if (cache.get(cacheKey)) {
    winston.debug('Using cached Yelp results.', {cacheKey: cacheKey});
    return Promise.resolve(_getRandomRestaurant(cache.get(cacheKey)));
  }

  let yelp = new Yelp({
    consumer_key: process.env.YELP_CONSUMER_KEY,
    consumer_secret: process.env.YELP_CONSUMER_SECRET,
    token: process.env.YELP_TOKEN,
    token_secret: process.env.YELP_TOKEN_SECRET
  });

  let searchOptions = {
    location: location,
    sort: YELP_SORT_RATING,
    category_filter: YELP_CATEGORY_RESTAURANTS,
    radius_filter: radius
  };

  return yelp.search(searchOptions)
    .then((data) => {
      winston.debug('Caching Yelp results.', {cacheKey: cacheKey});
      cache.put(cacheKey, data, CACHE_TTL);
      return _getRandomRestaurant(data);
    });
}

/**
 * Converts search radius from miles to meters,
 * and handles min and max restrictions.
 * @param {Float} miles
 * @return {Float}
 */
function _getSearchRadius(miles) {
  let meters = parseFloat(miles) * 1609;
  if (isNaN(meters)) {
    return YELP_DEFAULT_SEARCH_RADIUS;
  }
  if (meters <= YELP_MIN_SEARCH_RADIUS) {
    return YELP_MIN_SEARCH_RADIUS;
  }
  if (meters >= YELP_MAX_SEARCH_RADIUS) {
    return YELP_MAX_SEARCH_RADIUS;
  }
  return meters;
}

function _getRandomRestaurant(data) {
  let l = data.businesses.length;
  let i = _getRandomInt(0, l);
  winston.debug('Random restaurant picked.', {total: l, pick: i});
  return data.businesses[i];
}

function _getRandomInt(min, max) {
  return Math.floor(Math.random()*(max - min)) + min;
}

module.exports = {
  findRestaurant: findRestaurant
};
