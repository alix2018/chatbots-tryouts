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

var weather_icons = {
  "clear sky": "http://openweathermap.org/img/w/01d.png",
  "few clouds": "http://openweathermap.org/img/w/02d.png",
  "scattered clouds": "http://openweathermap.org/img/w/03d.png",
  "broken clouds": "http://openweathermap.org/img/w/04d.png",
  "shower rain": "http://openweathermap.org/img/w/09d.png",
  "rain": "http://openweathermap.org/img/w/10d.png",
  "thunderstorm": "http://openweathermap.org/img/w/11d.png",
  "snow": "http://openweathermap.org/img/w/13d.png",
  "mist": "http://openweathermap.org/img/w/50d.png"
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
          reply = response.result.fulfillment.messages[count].speech
          bot.sendTextMessage(userId, reply)

          // TODO
          //bot.sendLocationRequest(userId, "Where are you?")

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

bot.on('attachment', function(userId, attachment) {
  console.log('latitude:', attachment[0].payload.coordinates.lat)
  console.log('longitude:', attachment[0].payload.coordinates.long)
  latitude = attachment[0].payload.coordinates.lat;
  longitude = attachment[0].payload.coordinates.long;

  json = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=9393e4c87b6070958c8611b9f5211c48"
  jsonToCard(userId, json)

})

// Make Express listening
app.listen(app.get('port'), () => {
  console.log('Started on port', app.get('port'))
})


function jsonToCard(userId, json) {
  // Retrieve the weather JSON file from the url
  fetch(json)
    .then( (res) => {
      return res.json();
    }).then( (json) => {
      console.log(json);

      // Conversion from Kelvin to Celsius
      temperature = parseFloat(json.main.temp-273.15).toFixed(0);

      // Bot answer for the weather
      elements[0].title = "Weather in " + json.name
      elements[0].image_url = weather_icons[json.weather[0].description]
      elements[0].subtitle = json.weather[0].description + " with a temperature of " + temperature + "°C"
      elements[0].buttons[0].url = "http://openweathermap.org/city/" + json.id

      // Send a card with a picture, details and website link
      bot.sendGenericMessage(userId, elements);
    })
}
