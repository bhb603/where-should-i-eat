'use strict';

const express = require('express');
const finder = require('../lib/finder');
const router = express.Router();
const url = require('url');

router.get('/', function (req, res) {
  let savedParams = req.cookies.wsie_params;
  res.render('index', {savedParams: savedParams});
});

router.get('/eat', function (req, res) {
  finder.findRestaurant(req).then((data) => {
    if (req.query.save === 'true') {
     res.cookie('wsie_params', {
       location: req.query.location,
       radius: req.query.radius,
       search: req.query.search
     }, {
       maxAge: 2592000000 // 30 days
     });
    } else {
      res.clearCookie('wsie_params');
    }

    if (req.query.format === 'json') {
      return res.json(data || {});
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
