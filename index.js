// TODO: Add more dynamic greetings
// TODO: Make greetings creepier ("That's a nice iPhone you have, Zane")
// TODO: Support more platforms than iOS/MacOS (Android, Windows, Linux, etc.)

var mdns = require('multicast-dns')()
var say = require('say');

mdns.on('response', function(response) {
  for (i = 0; i<response.answers.length; i++) {
    console.log("[Response] << " + response.answers[i].name);
    parse_and_speak(response.answers[i].name);
  }
})

mdns.on('query', function(query) {
  for (i = 0; i<query.questions.length; i++) {
    console.log("[Query] >> " + query.questions[i].name);
    parse_and_speak(query.questions[i].name);
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

function parse_and_speak(device_name) {
  var regex = new RegExp('(.*?)s-(?:IPhone.*|MacBook.*)', 'i');
  // Fits format "<Name>s-Iphone.local" or "<Name>s-MacBook-Pro.local"
  if (regex.test(device_name)) {
    // Parse device names for names (i.e. "Zanes-Iphone.local" -> "Zane")
    device_name = regex.exec(device_name)[1];
    say.speak("Hello " + device_name);
    console.log("[HUMAN] : " + device_name);
  } else {
    console.log("[NOT HUMAN] : " + device_name);
  }
}
