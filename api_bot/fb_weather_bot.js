const express = require('express');
const FBBotFramework = require('fb-bot-framework');
const apiai = require('apiai');
const fetch = require('node-fetch');

// Initialization
const app = express();
const bot = new FBBotFramework({
	page_token: "EAALdLyoY5iMBAFiJLBp9ZAOxcQX0ZBtSU3Hl0JBpMGefzpE6YU8XDTK91p7HiYOf1RALdkAcOvzp7G1JeUfi2fArtxPb8YWLUZC2eBAEZColi4ZCTVghUwFXs9AmkpyI8CKlcikFan8P5TQDsh2TseTVkZANrA7xNgG37ZCKkHbvAZDZD",
  verify_token: "fbtoken"
});
const agent = apiai("291ec8ecde384312a9c7190faae3761f");

var reply = new String()
var jsonURL = new String()
var count = 0
var temperature


// Setup Express middleware for /webhook
app.use('/webhook', bot.middleware());

app.set('port', (process.env.PORT || 3000))

// Setup listener for incoming messages
bot.on('message', (userId, message) => {
  console.log('User text:', message)
  //bot.sendTextMessage(userId, "Echo Message: " + message);


  // Send text content to the right Api.ai agent
  var request = agent.textRequest(message, {
      sessionId: 'ba658112b8044f2e992d1a21f5945303'
  })

  // Reset the count each new message from the bot (in the case the bot sends several answers)
  count = 0

  // Api.ai agent answers
  request.on('response', function(response) {

    console.log('answer1:', response.result.fulfillment)

    // We scan the answers array from api.ai, just Api.ai default or Facebook responses
    while (count < response.result.fulfillment.messages.length) {

      if ( (response.result.fulfillment.messages[count].platform == undefined) ||
           (response.result.fulfillment.messages[count].platform == "facebook") ) {
        console.log('platform:', response.result.fulfillment.messages[count].platform)
        // If the answer is a custom payload (type = 4)
        if ((response.result.fulfillment.messages[count].type == 4)) {
          console.log('answer:', response.result.fulfillment.messages[count].payload)
          json = response.result.fulfillment.messages[count].payload.text

          // Retrieve the weather JSON file from the url
          fetch(json)
            .then(function(res) {
              return res.json();
            }).then(function(json) {
              console.log(json);

              // Conversion from Kelvin to Celsius
              temperature = parseFloat(json.main.temp-273.15).toFixed(0);

              // Bot answer for the weather
              reply = "Here is the weather in " + json.name + ": " + json.weather[0].description + " with a temperature of " + temperature + "°C"
              console.log("reply:", reply)
              bot.sendTextMessage(userId, reply)
            });
        }

        // If the answer is a text response (type = 0)
        else if (response.result.fulfillment.messages[count].type == 0) {

          console.log('bot text:', response.result.fulfillment.messages[count].speech)
          reply = response.result.fulfillment.messages[count].speech
          bot.sendTextMessage(userId, reply)
        }
      }

    // Next bot answer
    count++
    }
  });

  request.on('error', function(error) {
      console.log('errooor:', error);
  });

  request.end();

})

// Make Express listening
app.listen(app.get('port'), () => {
  console.log('Started on port', app.get('port'))
})
