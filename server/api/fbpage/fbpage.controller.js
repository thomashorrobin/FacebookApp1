'use strict';

var _ = require('lodash');
var Fbpage = require('./fbpage.model');

// Get list of fbpages
exports.index = function(req, res) {
  Fbpage.find(function (err, fbpages) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(fbpages);
  });
};

// Get a single fbpage
exports.show = function(req, res) {
  Fbpage.findById(req.params.id, function (err, fbpage) {
    if(err) { return handleError(res, err); }
    if(!fbpage) { return res.status(404).send('Not Found'); }
    return res.json(fbpage);
  });
};

// Creates a new fbpage in the DB.
exports.create = function(req, res) {
  var regex = /com[/](\w+)/
  var result = req.body.url.match(regex);
  var FB = require('fb');
  FB.setAccessToken('CAACEdEose0cBAFHTYdaROivIVtcDtubNtiSa8LnZAtqSb3QycHQ6g2JSHGZAOfAc5rxQ45esccFDyVJiqLtLoOufS1Poy5TjQ3GJTvsZBRF2ZAsMG7P2FnZCzvHiCpJ0C1ReQxp6YSDrJgfhT2RvZBKjtWT4XrV4ZA4hxCMBj2kCEuLX1RGpHzJe1NcmN6QHuelPw0azYSZC3AZDZD');
  FB.api(result[1], function(data){
    console.log(data.likes);
  });
  console.log(result);
  req.body.name = result[1];
  Fbpage.create(req.body, function(err, fbpage) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(fbpage);
  });
};

// Updates an existing fbpage in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Fbpage.findById(req.params.id, function (err, fbpage) {
    if (err) { return handleError(res, err); }
    if(!fbpage) { return res.status(404).send('Not Found'); }
    var updated = _.merge(fbpage, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(fbpage);
    });
  });
};

// Deletes a fbpage from the DB.
exports.destroy = function(req, res) {
  Fbpage.findById(req.params.id, function (err, fbpage) {
    if(err) { return handleError(res, err); }
    if(!fbpage) { return res.status(404).send('Not Found'); }
    fbpage.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

exports.run = function(req, res) {
  var FB = require('fb');
  FB.setAccessToken('CAACEdEose0cBAFHTYdaROivIVtcDtubNtiSa8LnZAtqSb3QycHQ6g2JSHGZAOfAc5rxQ45esccFDyVJiqLtLoOufS1Poy5TjQ3GJTvsZBRF2ZAsMG7P2FnZCzvHiCpJ0C1ReQxp6YSDrJgfhT2RvZBKjtWT4XrV4ZA4hxCMBj2kCEuLX1RGpHzJe1NcmN6QHuelPw0azYSZC3AZDZD');
  Fbpage.find(function (err, fbpages) {
    if(err) { return handleError(res, err); }
    fbpages.forEach(function (fbpage, index) {
      if (fbpage.name) {
        console.log(fbpage.name);
        FB.api(fbpage.name, function (data) {
          fbpage.likes.push({ date: Date.now(), likes: data.likes });
          fbpage.save();
        })
      }
    });
    return res.status(200).json('all good');
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
