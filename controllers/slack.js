
var request = require('request');

// Set the headers
var headers = { 'Content-Type': 'application/data-urlencode' }

var options = {
    url: process.env.SLACK_URL,
    method: 'POST',
    headers: headers
}

exports.message = function(req, res) {
  if (req.body.token != process.env.SLACK_COMMANDS_TOKEN) {
   res.status(400).json({"error" : "build allowed only for iOS team"});
   return
  }

  if (req.body.channel_id != process.env.SLACK_CHANNEL_ID) {
    res.status(400).json({"error" : "build allowed only for iOS team"});
    return
  }

  var payload = { "text": req.body.text }
  options.body = JSON.stringify(payload);
  request(options, function (error, response, body) {
      if(error) res.status(400).json({"error" : error});
      else res.status(200).json({"branch" : req.body.text});
  })
}
