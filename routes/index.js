var _ = require('underscore');
var express = require('express');
var router = express.Router();
var redis = require("redis"),
    client = redis.createClient();

/* GET home page. */
router.get('/', function (req, res, next) {
  var redisVal = client.get('test_key', function (err, replay) {
    res.render('index', {title: 'Express', redis_val: replay});
  });
});

router.get('/redis', function (req, res) {
  res.status(200).send('hello');
});

router.post('/redis', function (req, res) {
  console.log(req.body);
  if (!_.isEmpty(req.body.data)) {
    client.set('test_key', req.body.data, redis.print);
  }
  res.status(200).send(req.body.data);
});

module.exports = router;
