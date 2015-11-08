var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Investly' });
});

router.get('/search',function(req, res, next) {
	vm = {
		title: 'Search Investly',
		location: req.query.location
	}
	res.render('search',vm);
})

module.exports = router;