var apiai = require('apiai');

var app = apiai("1dd8971f2aaf40239a55ea08253aba90");

var request = app.textRequest('Hi', {
    sessionId: '70218555-8635-4e70-b757-1241220afbe6'
});

request.on('response', function(response) {
    console.log('answer:',response);
});

request.on('error', function(error) {
    console.log('error:', error);
});

request.end();
