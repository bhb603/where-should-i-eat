'use strict';

/**
 * Dependencies
 */
const memoryCache = require('memory-cache');
const requestify = require('requestify');
const winston = require('winston');


/**
 * Constants
 */
const EXPLORE_URL = 'https://api.foursquare.com/v2/venues/explore';
const DEFAULT_SECTION = 'food';
const MIN_RADIUS = 200;
const MAX_RADIUS = 40000;
const DEFAULT_RADIUS = 1600;
const LIMIT = 50;
const VERSION = '20160918';

const CACHE_TTL = 6*60*60*1000; // 6 hours

let cacheTransporter = {
  get: function (url, callback) {
    winston.debug('Getting cached results for url:', url);
    callback(null, memoryCache.get(url));
  },

  set: function (url, response, callback) {
    winston.debug('caching results for url:', url);
    memoryCache.put(url, response, CACHE_TTL);
    callback();
  },

  purge: function (url, callback) {
    memoryCache.del(url);
    callback();
  }
};

requestify.cacheTransporter(cacheTransporter);

function explore(req) {
  let params = {
    client_id: process.env.FSQ_CLIENT_ID,
    client_secret: process.env.FSQ_CLIENT_SECRET,
    near: req.query.location,
    radius: _getSearchRadius(req.query.radius),
    limit: LIMIT,
    v: VERSION,
    openNow: 1
  };

  if (req.query.prices) {
    params.price = req.query.prices;
  }

  if (req.query.search) {
    params.query = req.query.search;
  } else {
    params.section = DEFAULT_SECTION;
  }

  return requestify.get(EXPLORE_URL, {
    params: params,
    cache: {cache: true, expires: CACHE_TTL}
  }).then((response) => {
    return _pickRandomRestaurant(response.getBody());
  }).catch((err) => {
    winston.error('Error in fsq response:', err);
    throw err;
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
    return DEFAULT_RADIUS;
  }
  if (meters <= MIN_RADIUS) {
    return MIN_RADIUS;
  }
  if (meters >= MAX_RADIUS) {
    return MAX_RADIUS;
  }
  return meters;
}

function _pickRandomRestaurant(data) {
  let venues = [];
  if (data &&
      data.response &&
      data.response.groups &&
      data.response.groups[0] &&
      data.response.groups[0].items) {
    venues = data.response.groups[0].items;
  }

  let l = venues.length;
  let i = _getRandomInt(0, l);
  winston.debug('Random restaurant picked.', {total: l, pick: i});
  return venues[i];
}

function _getRandomInt(min, max) {
  return Math.floor(Math.random()*(max - min)) + min;
}

module.exports = {
  explore: explore
};
