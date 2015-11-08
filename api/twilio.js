var client = require('twilio')('ACCOUNT_SID', 'AUTH_TOKEN');
//Place a phone call, and respond with TwiML instructions from the given URL
client.makeCall({

    to:'+18184566420', // Any number Twilio can call
    from: '+18056259188', // A number you bought from Twilio and can use for outbound communication
    url: 'http://demo.twilio.com/welcome/voice/' // A URL that produces an XML document (TwiML) which contains instructions for the call

}, function(err, responseData) {

    //executed when the call has been initiated.
    console.log(responseData.from); // outputs "+14506667788"

});