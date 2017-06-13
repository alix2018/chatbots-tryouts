const apiai = require('apiai');
const Telegraf = require('../telegraf_bot/node_modules/telegraf')

const app = apiai("291ec8ecde384312a9c7190faae3761f");
const bot = new Telegraf("329701042:AAHTHfBD_CHiXStfc8RicqU3TJH4z0tMQDM")

bot.on('message', (ctx) => {
  console.log('text:', ctx.update.message.text)
  var text = ctx.update.message.text

  var request = app.textRequest(text, {
      sessionId: 'ba658112b8044f2e992d1a21f5945303'
  })

  request.on('response', function(response) {
      console.log('answer:', response.result.fulfillment.speech)
      var reply = response.result.fulfillment.speech
      ctx.reply(reply)
  });

  request.on('error', function(error) {
      console.log('error:', error);
  });

  request.end();

})

bot.startPolling()
