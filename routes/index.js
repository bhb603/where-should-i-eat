'use str';

const express = require('express');
const fsqClient = require('../lib/fsq-client');
const router = express.Router();
const url = require('url');

const COOKIE_NAME = 'wsie_params';
const COOKIE_AGE = 30*24*60*60*1000; // 30 days


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
  fsqClient.explore(req).then((data) => {
    if (req.query.save === 'true') {
     res.cookie(COOKIE_NAME, {
       location: req.query.location,
       radius: req.query.radius,
       search: req.query.search,
       price: req.query.price,
       open: req.query.open
     }, {
       maxAge: COOKIE_AGE
     });
    } else {
      res.clearCookie(COOKIE_NAME);
    }

    let mapUrl = '';
    let fsqUrl = '';
    let pricePoint = '';
    if (data) {
      mapUrl =
        ('https://www.google.com/maps?q=' +
        data.venue.location.address +
        data.venue.location.city + ', ' +
        data.venue.location.state + ' ' +
        data.venue.location.postalCode).replace(/\s+/g, '+');
      fsqUrl = 'http://foursquare.com/v/' + data.venue.id + '?ref=' + process.env.FSQ_CLIENT_ID;
      if (data.venue.price) {
        switch (data.venue.price.tier) {
          case 1:
            pricePoint = '$<span class="greyed">$$$</span>';
            break;
          case 2:
            pricePoint = '$$<span class="greyed">$$</span>';
            break;
          case 3:
            pricePoint = '$$$<span class="greyed">$</span>';
            break;
          case 4:
            pricePoint = '$$$$';
            break;
        }
      }
    }

    let response = {
      data: data,
      requestUrl: req.originalUrl,
      mapUrl: mapUrl,
      fsqUrl: fsqUrl,
      pricePoint: pricePoint
    }
    if (req.query.format === 'json') {
      res.json(response);
    } else {
      res.render('eat', response);
    }
  }).catch((err) => {
    if (err.code === 400) {
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
