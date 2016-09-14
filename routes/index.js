'use strict';

const express = require('express');
const finder = require('../lib/finder');
const router = express.Router();

router.get('/', function (req, res) {
  res.render('index', { title: 'Where Should I Eat?' });
});

router.get('/eat', function (req, res) {
  finder.findRestaurant(req).then((restaurant) => {
      if (req.query.format === 'json') {
        res.json(restaurant);
      } else {
        res.render('eat', {data: restaurant, url: req.originalUrl});
      }
    }).catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
