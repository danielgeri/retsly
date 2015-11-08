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
	client.sendMessage({

    to:'+18184566420', // Any number Twilio can deliver to
    from: '+18056259188', // A number you bought from Twilio and can use for outbound communication
    body: 'Very interested in this property!' // body of the SMS message

	}, function(err, responseData) { //this function is executed when a response is received from Twilio

	    if (!err) { // "err" is an error received during the request, if any

	        // "responseData" is a JavaScript object containing data received from Twilio.
	        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
	        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

	        console.log(responseData.from); // outputs "+14506667788"
	        console.log(responseData.body); // outputs "word to your mother."

	    }
	});
});

module.exports = router;