'use strict';

const express = require('express');
const finder = require('../lib/finder');
const router = express.Router();
const url = require('url');

const COOKIE_NAME = 'wsie_params';

router.get('/', function (req, res) {
  let savedParams = null;
  if (req.query.clear === 'true') {
    res.clearCookie(COOKIE_NAME);
  } else {
    savedParams = req.cookies[COOKIE_NAME];
  }
  res.render('index', {savedParams: savedParams});
});

router.get('/eat', function (req, res, next) {
  finder.findRestaurant(req).then((data) => {
    if (req.query.save === 'true') {
     res.cookie(COOKIE_NAME, {
       location: req.query.location,
       radius: req.query.radius,
       search: req.query.search
     }, {
       maxAge: 2592000000 // 30 days
     });
    } else {
      res.clearCookie(COOKIE_NAME);
    }

    if (req.query.format === 'json') {
      return res.json(data || {});
    }

    let mapUrl = '';
    if (data) {
      mapUrl =
        ('https://www.google.com/maps?q=' +
        data.location.address.join(' ') +
        data.location.city + ', ' +
        data.location.state_code + ' ' +
        data.location.postal_code).replace(/\s+/g, '+');
    }

    let fullUrl = req.originalUrl;
    let url = `/eat?location=${req.query.location}&radius=${req.query.radius}`;
    res.render('eat', {data: data, fullUrl: fullUrl, url: url, mapUrl: mapUrl});
  }).catch((err) => {

    if (err.statusCode === 400) {
      (req.query.format === 'json') ?
        res.status(400).json({error: 'invalid location'}) :
        res.status(400).render('invalid');
      return;
    }

    let error = new Error('Something went wrong');
    error.stack = err.data;
    error.status = 500;
    next(error);
  });
});

module.exports = router;
