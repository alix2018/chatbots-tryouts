const express = require('express');
const apiai = require('apiai');
const Telegraf = require('telegraf')
const fetch = require('node-fetch');
var botmetrics = require('node-botmetrics')('fB4Enxgf64nvFf1RiguuLCZX');
var schedule = require('node-schedule');



const app = apiai("291ec8ecde384312a9c7190faae3761f");
const bot = new Telegraf("329701042:AAH42GHypX8HNbhYN_PVWtsyzHE_AO2M-Hs")
const exp = express();
const { Extra, Markup } = Telegraf

var reply = new String()
var jsonURL = new String()
var widgetURL = new String()
var cardURL = new String()
var photoURL = new String()
var dataJson = {}
var count = 0
var temperature
var botAnswer
var lastAnswer
var notify
var jobJson = {}

var url = "https://guarded-shore-50472.herokuapp.com"


// Display weather pictures
var weatherIcons = {
	"01d": url + "/public/images/32.png",
	"02d": url + "/public/images/30.png",
	"03d": url + "/public/images/26.png",
	"04d": url + "/public/images/25.png",
	"09d": url + "/public/images/11.png",
	"10d": url + "/public/images/39.png",
	"11d": url + "/public/images/0.png",
	"13d": url + "/public/images/13.png",
	"50d": url + "/public/images/20.png"
}


// Set the right port
exp.set('port', (process.env.PORT || 5000));

exp.use(express.static(__dirname));

exp.set('views', './views');
exp.set('view engine', 'pug');

// Welcome page
exp.get('/', function(req, res) {
  res.send("Welcome")
});


// When the user writes a message, the event "message" is triggered
bot.on('message', (ctx) => {

	// For scheduled message
	lastAnswer = ctx.update.message.date
	// 120 seconds later
	var newAnswer = new Date((ctx.update.message.date + 3600*24) * 1000)
	newAnswer = newAnswer.toUTCString()

	if (jobJson[ctx.update.message.from.id] != undefined) {
		jobJson[ctx.update.message.from.id].cancel();
	}
	jobJson[ctx.update.message.from.id] = schedule.scheduleJob(newAnswer, function(){
		ctx.reply("We don't talk the last 24 hours")
	})
	console.log('json', jobJson)

	//For bot stats
	botmetrics.track({
	    text: ctx.update.message.from.first_name + ' sent a message',
	    message_type: 'outgoing',
	    user_id: ctx.update.message.from.id,
	    platform: 'telegram'
	});

  // Retrieve text content
  console.log('user text:', ctx.update.message.text)
  var text = ctx.update.message.text

  // Send text content to the right Api.ai agent
  var request = app.textRequest(text, {
      sessionId: 'ba658112b8044f2e992d1a21f5945303'
  })

  // Reset the count each new message from the bot (in the case the bot sends several answers)
  count = 0

  // Api.ai agent answers
  request.on('response', (response) => {
		console.log('notify:', notify)
    console.log('answer1:', response.result.fulfillment)

    // We scan the answers array from api.ai, just Api.ai default or telegram responses
    while (count < response.result.fulfillment.messages.length) {
      botAnswer = response.result.fulfillment.messages[count]

      if ( (botAnswer.platform == undefined) ||
           (botAnswer.platform == "telegram") ) {
        console.log('platform:', botAnswer.platform)
        // If the answer is a custom payload (type = 4)
        if ((botAnswer.type == 4)) {
          console.log('answer:', botAnswer.payload.telegram.text)
          json = botAnswer.payload.telegram.text

          // Retrieve the weather JSON file from the url
          fetch(json)
            .then( (res) => {
              return res.json();
            })
						.then( (json) => {
              console.log(json);

							dataJson = json

              // Conversion from Kelvin to Celsius
              temperature = parseFloat(json.main.temp-273.15).toFixed(0);

              // Bot answer for the weather
              photoURL = weatherIcons[json.weather[0].icon]
							detailsURL = "http://openweathermap.org/city/" + json.id
							widgetURL = url + "/views/webview.html"
							cardURL = url + "/views/card"

              reply = "Here is the weather in " + json.name + ": " + json.weather[0].description + " with a temperature of " + temperature + "°C"
              console.log("reply:", reply)

              ctx.replyWithPhoto({ url: photoURL})
              ctx.reply(reply)
							ctx.reply('Click on one of the following buttons:', Extra.HTML().markup((m) =>
					        m.inlineKeyboard([
					            m.urlButton('More details', detailsURL),
					            m.urlButton('Widget', widgetURL),
											m.urlButton('Card', cardURL)
					        ])));


            });
        }

        // If the answer is a text response (type = 0)
        else if (botAnswer.type == 0) {

          console.log('bot text:', botAnswer.speech)
          reply = botAnswer.speech
          ctx.reply(reply)
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

bot.startPolling()

exp.get('/datajson', function(req, res) {
		//console.log('datajson', json)
		res.send(dataJson)
});

exp.get('/views/card', function (req, res) {
  res.render('card', { id: "http://openweathermap.org/city/"+dataJson.id, city: dataJson.name, country: dataJson.sys.country,weather: dataJson.weather[0].main, details: dataJson.weather[0].description, temperature: parseFloat(dataJson.main.temp-273.15).toFixed(0), image: weatherIcons[dataJson.weather[0].icon] });
});

// Make Express listening
exp.listen(exp.get('port'), () => {
  console.log('Started on port', exp.get('port'))
})
