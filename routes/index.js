var express = require('express');
var router = express.Router();

var path = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(process.cwd() + "/public/README.html", { title: 'RESTaurant API Readme' });
});

module.exports = router;
