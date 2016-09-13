'use strict';

const express = require('express');
const router = express.Router();
const Yelp = require('yelp');

router.get('/', function (req, res) {
  res.render('index', { title: 'Where Should I Eat?' });
});

router.get('/eat', function (req, res) {
  let yelp = new Yelp({
    consumer_key: process.env.YELP_CONSUMER_KEY,
    consumer_secret: process.env.YELP_CONSUMER_SECRET,
    token: process.env.YELP_TOKEN,
    token_secret: process.env.YELP_TOKEN_SECRET
  });

  yelp.search({
    location: req.query.location,
    sort: 2, // 2 = rating
    limit: 20
  }).then((data) => {
    res.json(data);
  }).catch((err) => {
    res.status(500).json(err);
  });
});

module.exports = router;
