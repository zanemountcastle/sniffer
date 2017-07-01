var mdns = require('multicast-dns')()
var say = require('say');

mdns.on('response', function(response) {
  console.log('got a response packet:', response)
  say.speak("Response " + service.name);
})

mdns.on('query', function(query) {
  console.log('got a query packet:', query)
  say.speak("Query " + service.name);
})

// lets query for an A record for 'brunhilde.local'
mdns.query({
  questions:[{
    name: 'Zanes-Iphone.local',
    type: 'AAAA'
  }]
})
