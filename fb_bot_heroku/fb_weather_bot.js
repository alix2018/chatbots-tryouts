const express = require('express');
const FBBotFramework = require('fb-bot-framework');
const apiai = require('apiai');
const fetch = require('node-fetch');
const path = require('path');
//var engines = require('consolidate');


// Initialization
const app = express();
const bot = new FBBotFramework({
	page_token: "EAALdLyoY5iMBAFiJLBp9ZAOxcQX0ZBtSU3Hl0JBpMGefzpE6YU8XDTK91p7HiYOf1RALdkAcOvzp7G1JeUfi2fArtxPb8YWLUZC2eBAEZColi4ZCTVghUwFXs9AmkpyI8CKlcikFan8P5TQDsh2TseTVkZANrA7xNgG37ZCKkHbvAZDZD",
  verify_token: "fbtoken"
});
const agent = apiai("291ec8ecde384312a9c7190faae3761f");

var reply = new String()
var jsonURL = new String()
var botAnswer = new String()
var count = 0
var temperature, latitude, longitude
var ngrok = "https://539dc36d.ngrok.io"

// Setup Express middleware for /webhook

//app.use('/webhook', bot.middleware());


app.get("/webhook", function(req, res) {
	console.log("token:",req.query["hub.verify_token"])
    if (req.query["hub.verify_token"] === "fbtoken") {
        res.send(req.query["hub.challenge"]);
    } else {
        res.send("Error, wrong validation token");
    }
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/webview.html'));
});

app.set('port', (process.env.PORT || 3000));


app.use(express.static(__dirname + '/views'));

app.get('/webview', function(req, res) {
    res.sendFile(path.join(__dirname + '/webview.html'));
});

/*
app.get('/weather', function(req, res) {
    res.sendFile(path.join(__dirname + '/weather_pictures/0.png'));
});
*/

var weatherIcons = {
	"01d": ngrok + "/weather/32.png",
	"02d": ngrok + "/weather/30.png",
	"03d": ngrok + "/weather/26.png",
	"04d": ngrok + "/weather/25.png",
	"09d": ngrok + "/weather/11.png",
	"10d": ngrok + "/weather/39.png",
	"11d": ngrok + "/weather/0.png",
	"13d": ngrok + "/weather/13.png",
	"50d": ngrok + "/weather/20.png"
}

var weatherCard = [
  {
    "title": "Weather",
    "image_url": "http://imgh.us/32_15.pn",
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

var menuButtons = [
    {
        "type":"web_url",
				"title":"Test",
        "url": ngrok + "/views/webview.html",
				"messenger_extensions": true,
				"webview_height_ratio": "tall",
				"fallback_url": ngrok + "/views/webview.html"
    }
];


// Path for a weather picture: /weather/picture.png
app.use('/weather', express.static(__dirname + '/weather_pictures'));
// Path for a weather picture: /views/file.html
app.use('/views', express.static(__dirname + '/views'));

// Setup listener for incoming messages
bot.on('message', (userId, message) => {

	console.log('User text:', message)

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

			botAnswer = response.result.fulfillment.messages[count]

      if ( (botAnswer.platform == undefined) ||
           (botAnswer.platform == "facebook") ) {
        console.log('platform:', botAnswer.platform)
        // If the answer is a custom payload (type = 4)
        if ((botAnswer.type == 4)) {
          console.log('answer:', botAnswer.payload)
          json = botAnswer.payload.facebook.attachment.payload.text

          jsonToCard(userId, json)
        }

        // If the answer is a text response (type = 0)
        else if (botAnswer.type == 0) {

          console.log('bot text:', botAnswer.speech)

					// Ask for the city and send a location button
					if (botAnswer.speech == "In which city?") {
						bot.sendLocationRequest(userId, botAnswer.speech)
					}

					// All other answers from the bot
					else {
	          reply = botAnswer.speech
	          //bot.sendTextMessage(userId, reply)

						//bot.sendListMessage(userId, elements)
						//console.log('elements:', elements)
						var text = "text"
						console.log('menuButtons:', menuButtons)
						bot.sendButtonMessage(userId, text, menuButtons);

						//bot.sendListMessage(userId, elements, function(){console.log("ARGS ", arguments)})

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
/*
// viewed at http://localhost:3000
app.get('/', function(req, res) {
	console.log('res:', res)
  //res.sendFile(path.join(__dirname + '/webview.html'));
});
*/

// Make Express listening
app.listen(app.get('port'), () => {
  console.log('Started on port', app.get('port'))
})

// Function to retrieve a json from an URL and return a weather card with all the information
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
      weatherCard[0].title = "Weather in " + json.name
      weatherCard[0].image_url = weatherIcons[json.weather[0].icon]
      weatherCard[0].subtitle = json.weather[0].description + " with a temperature of " + temperature + "°C"
      weatherCard[0].buttons[0].url = "http://openweathermap.org/city/" + json.id

			console.log('weatherCard:', weatherCard)

      // Send a card with a picture, details and website link
      bot.sendGenericMessage(userId, weatherCard);
    })
}
