var express = require('express');
var router = express.Router();
var logger = require('../log/logConfig').logger
/* GET home page. */
router.get('/', function(req, res, next) {
	logger.debug('here')
	res.redirect('/reserve/reserve/meeting')
  	//res.render('index', { title: 'Express' });
});

module.exports = router;
