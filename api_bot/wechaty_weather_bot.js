const { Wechaty, MediaMessage } = require('wechaty')
const apiai = require('apiai')
const fetch = require('node-fetch')
const QRcode = require('qrcode-terminal')
//const mp = require('wechat-mp')("gh_40e5934726cd")
const exp = require('express')()

const bot = Wechaty.instance()
const app = apiai("291ec8ecde384312a9c7190faae3761f");

var reply = new String()
var weatherURL = new String()
var jsonURL = new String()
var count = 0
var temperature
var botuser

///wechat/webhooks/595a3bfafce0d25100d2324f
/*
exp.use('/wechat/webhooks/595a3bfafce0d25100d2324f', mp.start())
exp.post('/wechat/webhooks/595a3bfafce0d25100d2324f', function(req, res, next) {

  console.log(req.body)

  res.body = {
    msgType: 'text',
    content: 'Hi.'
  }

  next()
}, mp.end())
*/

bot.on('scan', (url, code) => {
  let loginUrl = url.replace('qrcode', 'l')
  QRcode.generate(loginUrl)
  console.log(url)
})

bot.on('login', (user) => {
  console.log(`User ${user} logined`)
  botUser = user
})

bot.on('message', (m) => {
    console.log('message:', m)
    const contact = m.from()
    const content = m.content()
    console.log(`Contact: ${contact.name()} Content: ${content}`)

    // Send text content to the right Api.ai agent
    var request = app.textRequest(content, {
        sessionId: 'ba658112b8044f2e992d1a21f5945303'
    })

    // Reset the count each new message from the bot (in the case the bot sends several answers)
    count = 0


    /*
    if (m == "Hi") {
        m.say("Hello! How are you?")
    }
    */


    if (contact != botUser) {

      // Api.ai agent answers
      request.on('response', (response) => {

        console.log('answer1:', response.result.fulfillment)

        // We scan the answers array from api.ai, just Api.ai default or telegram responses
        while (count < response.result.fulfillment.messages.length) {

          var botAnswer = response.result.fulfillment.messages[count]

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
                }).then( (json) => {
                  console.log(json);

                  // Conversion from Kelvin to Celsius
                  temperature = parseFloat(json.main.temp-273.15).toFixed(0);

                  // Bot answer for the weather
                  reply = "Here is the weather in " + json.name + ": " + json.weather[0].description + " with a temperature of " + temperature + "°C"
                  console.log("reply:", reply)
                  m.say(reply)
                });
            }

            // If the answer is a text response (type = 0)
            else if (botAnswer.type == 0) {

              console.log('bot text:', botAnswer.speech)

              if (content == "image") {
                m.say(new MediaMessage('donuts.png'))
              }

              else {
                reply = botAnswer.speech
                m.say(reply)
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

    }
})

bot.init()
