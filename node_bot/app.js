var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
//console.log("env:", process.env.port)
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

//server.listen("385941265:AAH8Q__WEUAG-BiPPHABmw2pLJAdYY7cq-U")

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "a6def656-d6ea-43b5-8084-8019cc690520",
    appPassword: "vkAbr4zcgGySoiTT1fBS0rF"
});

// Listen for messages from users
// endpoint : https://3e1e78ac.ngrok.io
server.post('https://25142bdc.ngrok.io/api/messages', connector.listen());
//server.post("https://api.telegram.org/bot385941265:AAH8Q__WEUAG-BiPPHABmw2pLJAdYY7cq-U/getUpdates", connector.listen())


// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    //console.log("message:", session.message)
    session.send("You said: %s", session.message.text);
});
