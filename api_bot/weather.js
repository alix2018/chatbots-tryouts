const apiai = require('apiai');
const Telegraf = require('../telegraf_bot/node_modules/telegraf')
var fetch = require('node-fetch');


const app = apiai("291ec8ecde384312a9c7190faae3761f");
const bot = new Telegraf("329701042:AAH42GHypX8HNbhYN_PVWtsyzHE_AO2M-Hs")
var reply = new String()
var jsonURL = new String()
var temperature

// When the user writes a message
bot.on('message', (ctx) => {

  // Retrieve text content
  console.log('user text:', ctx.update.message.text)
  var text = ctx.update.message.text

  // Send text content to the Api.ai agent
  var request = app.textRequest(text, {
      sessionId: 'ba658112b8044f2e992d1a21f5945303'
  })

  // Api.ai bot agent answer
  request.on('response', function(response) {
    console.log('answer:', response.result.fulfillment)

    if (response.result.fulfillment.messages[0].type == 4) {
      console.log('answer:', response.result.fulfillment.messages[0].payload.telegram.text)
      json = response.result.fulfillment.messages[0].payload.telegram.text

      fetch(json)
        .then(function(res) {
          return res.json();
        }).then(function(json) {
          console.log(json);
          temperature = parseFloat(json.main.temp-267).toFixed(0); 
          reply = "Here is the weather in " + json.name + ": " + json.weather[0].description + " with a temperature of " + temperature + "°C"
          console.log("reply:", reply)
          ctx.reply(reply)
        });
    }

    else if (response.result.fulfillment.messages[0].type == 0) {

      console.log('bot text:', response.result.fulfillment.speech)
      reply = response.result.fulfillment.speech
      ctx.reply(reply)
    }

    //Answer the user on Telegram
    //ctx.reply(reply)


  });

  request.on('error', function(error) {
      console.log('errooor:', error);
  });

  request.end();

})

bot.startPolling()
