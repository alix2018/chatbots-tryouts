const express = require('express');
const apiai = require('apiai');
const Telegraf = require('telegraf')
const fetch = require('node-fetch');

const app = apiai("291ec8ecde384312a9c7190faae3761f");
const bot = new Telegraf("329701042:AAH42GHypX8HNbhYN_PVWtsyzHE_AO2M-Hs")
const exp = express();

var reply = new String()
var jsonURL = new String()
var count = 0
var temperature
var botAnswer


// Set the right port
exp.set('port', (process.env.PORT || 5000));

exp.use(express.static(__dirname));

// Welcome page
exp.get('/', function(req, res) {
  res.send("Welcome")
});

// When the user writes a message, the event "message" is triggered
bot.on('message', (ctx) => {

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

    console.log('answer1:', response.result.fulfillment)

    // We scan the answers array from api.ai, just Api.ai default or telegram responses
    while (count < response.result.fulfillment.messages.length) {
      botAnswer = response.result.fulfillment.messages[count]

      if ( (botAnswer.platform == undefined) ||
           (botAnswer.platform == "telegram") ) {
        console.log('platform:', response.result.fulfillment.messages[count].platform)
        // If the answer is a custom payload (type = 4)
        if ((botAnswer.type == 4)) {
          console.log('answer:', botAnswer.payload.telegram.text)
          json = botAnswer.payload.telegram.text

          // Retrieve the weather JSON file from the url
          fetch(json)
            .then( (res) => {
              return res.json();
            }).then( (json) => {
              console.log(json);

              // Conversion from Kelvin to Celsius
              temperature = parseFloat(json.main.temp-273.15).toFixed(0);

              // Bot answer for the weather
              reply = "Here is the weather in " + json.name + ": " + json.weather[0].description + " with a temperature of " + temperature + "°C"
              console.log("reply:", reply)
              ctx.reply(reply)
            });
        }

        // If the answer is a text response (type = 0)
        else if (botAnswer.type == 0) {

          console.log('bot text:', botAnswer.speech)
          reply = botAnswer.speech
          ctx.reply(reply)
          ctx.replyWithPhoto({ url: 'https://www.google.nl/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwifttCc4P7UAhWhAJoKHVnTCzoQjRwIBw&url=http%3A%2F%2Ffr.freepik.com%2Ficones-gratuites%2Flogo&psig=AFQjCNF-fNN0wczSEYDmOQ6KebVxc0ev1w&ust=1499777369327503'})

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

// Make Express listening
exp.listen(exp.get('port'), () => {
  console.log('Started on port', exp.get('port'))
})
