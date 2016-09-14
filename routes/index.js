'use strict';

const express = require('express');
const router = express.Router();

const finder = require('../lib/finder');

router.get('/', function (req, res) {
  res.render('index', { title: 'Where Should I Eat?' });
});

router.get('/eat', function (req, res) {
  finder.findRestaurant(req).then((restaurant) => {
      res.render('eat', {restaurant: restaurant});
    }).catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
