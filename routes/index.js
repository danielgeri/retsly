var express = require('express');
var router = express.Router();
var client = require('twilio')('ACd1b4bed635f1d1ebae2e87533e8d9e06', 'cfee6b78681347dd0005df519530cf78');

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

router.get('/call-agent',function(req,res,next) {
//Place a phone call, and respond with TwiML instructions from the given URL
	client.makeCall({
	    to:'+18184566420', // Any number Twilio can call
	    from: '+18056259188', // A number you bought from Twilio and can use for outbound communication
	    url: 'http://demo.twilio.com/welcome/voice/' // A URL that produces an XML document (TwiML) which contains instructions for the call

	}, function(err, responseData) {
	    //executed when the call has been initiated.
	    console.log(responseData)
	    res.send(responseData); // outputs "+14506667788"
	});

module.exports = router;