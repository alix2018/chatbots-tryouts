var apiai = require('apiai');

var app = apiai("291ec8ecde384312a9c7190faae3761f");

var request = app.textRequest('weather in Paris today in Celsius please', {
    sessionId: '329701042:AAH42GHypX8HNbhYN_PVWtsyzHE_AO2M-Hs'
});

request.on('response', function(response) {
    console.log(response);
});

request.on('error', function(error) {
    console.log(error);
});

request.end();
