'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FbpageSchema = new Schema({
  name: String,
  url: String,
  pageid: String,
  likes: Array
});

module.exports = mongoose.model('Fbpage', FbpageSchema);
