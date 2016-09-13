var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index', { title: 'Where Should I Eat?' });
});

router.get('/eat', function (req, res) {
  console.log(req.query);
  res.json('ok');
});


module.exports = router;
