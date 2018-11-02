var http = require('http')
  , static = require('node-static')
  , url = require('url')
  , twilio = require('twilio');

file = new static.Server('./public');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const ClientCapability = require('twilio').jwt.ClientCapability;

http.createServer(function (request, response) {
  request.addListener('end', function () {
    var hash = url.parse(request.url);
    if (hash.path === '/sms') {
      // var twiml = new twilio.TwimlResponse();
      // twiml.message('Hey, thanks for saying hi. Ping me anytime @CarterRabasa for questions about Twilio or awesome coffee');
      // response.writeHead(200, {'content-type': 'text/xml'});
      // response.end(twiml.toString());
      const twiml = new VoiceResponse();

      twiml.say('Hello from your pals at Twilio! Have fun.');

      response.writeHead(200, { 'Content-Type': 'text/xml' });
      response.end(twiml.toString());
    }
    else if (hash.path === '/voice') {
      var twiml = new twilio.TwimlResponse();
      twiml.dial(function () {
        this.conference('conference');
      })
      response.writeHead(200, { 'content-type': 'text/xml' });
      response.end(twiml.toString());
    }
    else if (hash.path === '/call') {
      var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      // use your Twilio number below
      client.listMessages({ 'to': '+1xxxyyyzzzz' }, function (err, res) {
        res.messages.forEach(function (message) {
          console.log(message.body);
          client.makeCall({
            'to': message.from,
            'from': '+1xxxyyyzzzz',
            'url': 'https://your.domain.com/voice'
          });
        });
      });
      response.end("OK");
    }
    else if (hash.path === '/voip') {
      const twiml = new VoiceResponse();
      const dial = twiml.dial();
      dial.client('joey');
      response.writeHead(200, { 'Content-Type': 'text/xml' });
      response.end(twiml.toString());
    }
    else if (hash.path === '/random') {
      const twiml = new VoiceResponse();    
      const dial = twiml.dial({
        callerId: '+918376975528',
      });
      dial.number('+12153726702');
      response.writeHead(200, { 'Content-Type': 'text/xml' });
      response.end(twiml.toString());
    }
    else if (hash.path === '/token') {
      const accountSid = 'AC975c33dd917924c0576f20cc6411781c';
      const authToken = '38560b2c60dac5d1b64952848d60f0a3';

      const capability = new ClientCapability({
        accountSid: accountSid,
        authToken: authToken,
      });
      capability.addScope(
        new ClientCapability.OutgoingClientScope({ applicationSid: 'AP8a8e104c52262db9355872e098612b55' })
      );
      const token = capability.toJwt();

      response.writeHead(200, { 'Content-Type': 'application/jwt' });
      response.end(token);
    }
    else {
      file.serve(request, response);
    }

  }).resume();
}).listen(process.env.PORT || 3000);

