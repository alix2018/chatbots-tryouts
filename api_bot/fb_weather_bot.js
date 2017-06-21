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
var temperature, latitude, longitude
var ngrok = "https://a2c7e523.ngrok.io"

var weather_icons = {
  "01d": "http://imgh.us/32_15.png",
  "20d": "http://imgh.us/30_18.png",
  "03d": "http://imgh.us/26_16.png",
  "04d": "http://imgh.us/25_16.png",
  "09d": "http://imgh.us/11_130.png",
  "10d": "http://imgh.us/39_12.png",
  "11d": "http://imgh.us/0_50.png",
  "13d": "http://imgh.us/13_64.png",
  "50d": "http://imgh.us/20_20.png"
}

var elements = [
    {
        "title": "Weather",
        "image_url": "http://openweathermap.org/img/w/01d.png",
        "subtitle": "Details about the weather",
        "buttons": [
            {
                "type":"web_url",
                "url":"http://openweathermap.org/city/",
                "title":"More details"
            }
        ]
    }
];


// Setup Express middleware for /webhook
app.use('/webhook', bot.middleware());

app.set('port', (process.env.PORT || 3000))


// Setup listener for incoming messages
bot.on('message', (userId, message) => {
  console.log('User text:', message)
  //bot.sendTextMessage(userId, "Echo Message: " + message);
  //bot.sendLocationRequest(userId, "Where are you?")


  // Send text content to the right Api.ai agent
  var request = agent.textRequest(message, {
      sessionId: 'ba658112b8044f2e992d1a21f5945303'
  })

  // Reset the count each new message from the bot (in the case the bot sends several answers)
  count = 0

  // Api.ai agent answers
  request.on('response', (response) => {

    console.log('answer1:', response.result.fulfillment)

    // We scan the answers array from api.ai, just Api.ai default or Facebook responses
    while (count < response.result.fulfillment.messages.length) {

      if ( (response.result.fulfillment.messages[count].platform == undefined) ||
           (response.result.fulfillment.messages[count].platform == "facebook") ) {
        console.log('platform:', response.result.fulfillment.messages[count].platform)
        // If the answer is a custom payload (type = 4)
        if ((response.result.fulfillment.messages[count].type == 4)) {
          console.log('answer:', response.result.fulfillment.messages[count].payload)
          json = response.result.fulfillment.messages[count].payload.facebook.attachment.payload.text

          jsonToCard(userId, json)
        }

        // If the answer is a text response (type = 0)
        else if (response.result.fulfillment.messages[count].type == 0) {

          console.log('bot text:', response.result.fulfillment.messages[count].speech)

					// Ask for the city and send a location button
					if (response.result.fulfillment.messages[count].speech == "In which city?") {
						bot.sendLocationRequest(userId, response.result.fulfillment.messages[count].speech)
					}

					// All other answers from the bot
					else {
	          reply = response.result.fulfillment.messages[count].speech
	          bot.sendTextMessage(userId, reply)
					}

        }
      }

    // Next bot answer
    count++
    }
  });

  request.on('error', (error) => {
      console.log('errooor:', error);
  });

  request.end();

})

// When the user send his location
bot.on('attachment', function(userId, attachment) {
	console.log('attachment:', attachment)

	if (attachment[0].type == "location") {
	  latitude = attachment[0].payload.coordinates.lat;
	  longitude = attachment[0].payload.coordinates.long;

	  json = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=9393e4c87b6070958c8611b9f5211c48"
	  jsonToCard(userId, json)
	}

})

// Make Express listening
app.listen(app.get('port'), () => {
  console.log('Started on port', app.get('port'))
})

// Fonction to retrieve a json from an URL and return a weather card with all the information
function jsonToCard(userId, json) {

  // Retrieve the weather JSON file from the url
  fetch(json)
    .then( (res) => {
      return res.json();
    }).then( (json) => {
      console.log(json);

      // Conversion from Kelvin to Celsius
      temperature = parseFloat(json.main.temp-273.15).toFixed(0);
			//app.use(express.static(__dirname + '/weather_pictures'));
			//app.use("/static", express.static("/weather_pictures"))

      // Bot answer about the weather
      elements[0].title = "Weather in " + json.name
      elements[0].image_url = weather_icons[json.weather[0].icon]
      elements[0].subtitle = json.weather[0].description + " with a temperature of " + temperature + "°C"
      elements[0].buttons[0].url = "http://openweathermap.org/city/" + json.id

      // Send a card with a picture, details and website link
      bot.sendGenericMessage(userId, elements);
    })
}
