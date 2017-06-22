const apiai = require('apiai');
const Telegraf = require('telegraf')

const app = apiai("291ec8ecde384312a9c7190faae3761f");
const bot = new Telegraf("329701042:AAH42GHypX8HNbhYN_PVWtsyzHE_AO2M-Hs")

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
      console.log('answer:', response)
      console.log('bot text:', response.result.fulfillment.speech)
      var reply = response.result.fulfillment.speech

      //Answer the user on Telegram
      ctx.reply(reply)
  });

  request.on('error', function(error) {
      console.log('error:', error);
  });

  request.end();

})

bot.startPolling()
