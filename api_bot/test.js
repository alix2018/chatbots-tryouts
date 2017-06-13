var apiai = require('apiai');

var app = apiai("291ec8ecde384312a9c7190faae3761f");

var request = app.textRequest('weather in Paris today in Celsius please', {
    sessionId: 'ba658112b8044f2e992d1a21f5945303'
});

request.on('response', function(response) {
    console.log(response);
});

request.on('error', function(error) {
    console.log(error);
});

request.end();
