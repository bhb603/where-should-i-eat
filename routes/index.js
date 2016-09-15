'use strict';

const express = require('express');
const finder = require('../lib/finder');
const router = express.Router();
const url = require('url');

router.get('/', function (req, res) {
  res.render('index', { title: 'Where Should I Eat?' });
});

router.get('/eat', function (req, res) {
  finder.findRestaurant(req).then((restaurant) => {
      if (req.query.format === 'json') {
        res.json(restaurant);
      } else {
        let fullUrl = req.originalUrl;
        let url = `/eat?location=${req.query.location}&radius=${req.query.radius}`;
        let mapUrl =
          'https://www.google.com/maps?q=' +
          restaurant.location.address.join(' ') +
          restaurant.location.city + ', ' +
          restaurant.location.state_code + ' ' +
          restaurant.location.postal_code;
        mapUrl = mapUrl.replace(/\s+/g, '+');
        res.render('eat', {data: restaurant, fullUrl: fullUrl, url: url, mapUrl: mapUrl});
      }
    }).catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
