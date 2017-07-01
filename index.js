var mdns = require('multicast-dns')()
var say = require('say');

mdns.on('response', function(response) {
  // console.log('got a response packet:', response)
  for (i = 0; i<response.answers.length; i++) {
    // say.speak("Response " + response.answers[i].data);
    console.log("[Response] << " + response.answers[i].name);
  }
})

mdns.on('query', function(query) {
  // console.log('got a query packet:', query);
  for (i = 0; i<query.questions.length; i++) {
    // say.speak("Query " + query.questions[i].name);
    console.log("[Query] >> " + query.questions[i].name);
  }
})

// lets query for an A record for 'brunhilde.local'
mdns.query({
  questions:[{
    name: 'Zanes-Iphone.local',
    type: 'AAAA'
  }]
})

process.on("SIGINT", () => {
  mdns.destroy();
  console.log("Caught SIGINT. Exiting...");
});
