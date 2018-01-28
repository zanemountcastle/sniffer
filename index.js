// TODO: Add more dynamic greetings
// TODO: Make greetings creepier (ex. "That's a nice iPhone you have, Zane")
// TODO: Support more platforms than iOS/MacOS (Android, Windows, Linux, etc.)

// TODO: Add support for "Name-PC.local"

var mdns = require('multicast-dns')()
var say = require('say');
var dhcp = require('dhcp');
var dhcpServer = dhcp.createBroadcastHandler();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// Set up MongoDB and "users" collection
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbase = db.db("sniffer"); // See MongoDB 3.0 changelog
  dbase.createCollection("users", function(err, res) {
    if (err) throw err;
  })
});

mdns.on('response', function(response) {
  for (i = 0; i<response.answers.length; i++) {
    // console.log("[Response] << " + response.answers[i].name);
    var clientName = parse(response.answers[i].name);

    if (clientName) { // Let's add this human name to our DB
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var newClient = { name: clientName, macAddress: "6C-8D-C1-90-F3-CA"}
        var dbase = db.db("sniffer"); // See MongoDB 3.0 changelog

        dbase.collection("users").update({
          macAddress: "6C-8D-C1-90-F3-CA"},
          newClient, { upsert: true}, function(err, res) {
            if (err) throw err;
            console.log(clientName + " inserted");
          });
      });
    }
  }
})

process.on("SIGINT", () => {
  mdns.destroy();
  console.log("Caught SIGINT. Exiting...");
  process.exit(0);
});

dhcpServer.on('message', function (data) {
  console.log("[DHCP MESSAGE] : " + JSON.stringify(data));
  if (data.chaddr === '6C-8D-C1-90-F3-CA') {
    console.log('Welcome home!');
  }
});

dhcpServer.listen();

// Returns human device name or `false` if not human name
function parse(device_name) {
  var regex = new RegExp('(.*?)s-(?:IPhone.*|MacBook.local|MacBook.*|iPhone.*|Air.local)|(.*?)-(?:IPhone.*|MacBook.local|MacBook.*|iPhone.*|Air.local)', 'i');
  if (regex.test(device_name)) {  // If device name its format "<Name>s-Iphone.local" or "<Name>s-MacBook-Pro.local"
    return (regex.exec(device_name)[1]); // Parse device names for names (i.e. "Zanes-Iphone.local" -> "Zane")
  }
  return false; // Not a human name
}
