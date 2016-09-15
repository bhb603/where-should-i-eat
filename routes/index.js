'use strict';

const express = require('express');
const finder = require('../lib/finder');
const router = express.Router();
const url = require('url');

router.get('/', function (req, res) {
  res.render('index', { title: 'Where Should I Eat?' });
});

router.get('/eat', function (req, res) {
  finder.findRestaurant(req).then((data) => {
      if (req.query.format === 'json') {
        return res.json(data);
      }

      let mapUrl = '';
      if (data) {
        mapUrl =
          'https://www.google.com/maps?q=' +
          data.location.address.join(' ') +
          data.location.city + ', ' +
          data.location.state_code + ' ' +
          data.location.postal_code.replace(/\s+/g, '+');
      }

      let fullUrl = req.originalUrl;
      let url = `/eat?location=${req.query.location}&radius=${req.query.radius}`;
      res.render('eat', {data: data, fullUrl: fullUrl, url: url, mapUrl: mapUrl});
    }).catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
