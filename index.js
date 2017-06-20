var mdns = require('mdns');
var say = require('say');

// advertise a http server on port 4321
var ad = mdns.createAdvertisement(mdns.tcp('http'), 4321);
ad.start();

// watch all http servers
var browser = mdns.createBrowser(mdns.tcp('http'));
browser.on('serviceUp', function(service) {
  console.log("service up: ", service);
  say.speak("Hello " + service.name);
});


browser.on('serviceDown', function(service) {
  console.log("service down: ", service);
});

browser.start();

// discover all available service types
var all_the_types = mdns.browseThemAll(); // all_the_types is just another browser...
