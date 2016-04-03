/**
 * Created by feixiao on 16-4-3.
 */
var _ = require('underscore');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var redis = require('redis'),
    client = redis.createClient();
var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var userData = [
  {username: 'user1', password: 'test1', role: 'user'},
  {username: 'user2', password: 'test1', role: 'user'},
  {username: 'user3', password: 'test1', role: 'user'},
  {username: 'user4', password: 'test1', role: 'user'},
];

passport.use(new LocalStrategy(
    function (username, password, done) {
      var user = _.find(userData, {username: username});
      if (user) {
        if (user.password == password) {
          crypto.randomBytes(12, function (err, buffer) {
            var token = buffer.toString('hex');
            console.log(token);
            user.token = token;
            return done(null, user);
          });
        } else {
          return done(null, false);
        }
      } else {
        return done(null, false);
      }
    }
));

passport.serializeUser(function (user, done) {
  client.set('user:' + user.token, JSON.stringify(user), redis.print);
  done(null, user.token);
});

passport.deserializeUser(function (tk, done) {
  console.log("deserialze user", tk);
  client.get('user:' + tk, function (err, replay) {
    console.log(replay);
    done(err, JSON.parse(replay));
  })
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/',
  failureFlash: true
}), function (req, res, next) {
  res.redirect('/');
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
