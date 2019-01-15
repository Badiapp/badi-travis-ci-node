
var request = require('request');

// Set the headers
var headers = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Travis-API-Version": "3",
  "Authorization": "token " + process.env.GITHUB_ACCESS_TOKEN
}

var options = {
    url: 'https://api.travis-ci.com/repo/Badiapp%2Fbadi-ios/requests',
    method: 'POST',
    headers: headers
}

var body= { "request": { "branch":"master" } }

var config = {
  "merge_mode": "replace",
  "os": "osx",
  "cache": "cocoapods",
  "script": [
    "cd Badi",
    "travis_wait $BUILD_TIMEOUT fastlane --env store release"
  ],
  "language": "objective-c",
  "osx_image": "xcode10.1",
  "before_script": [
    "gem update fastlane",
    "gem install slather",
    "brew install sourcery",
    "export FASTLANE_XCODEBUILD_SETTINGS_TIMEOUT=100"
  ],
  "before_install": [
    "echo -e \"machine github.com\\n login $CI_USER_TOKEN\" >> ~/.netrc"
  ]
}

exports.release = function(req, res) {
  console.log(req.body);

  if (req.body.token != process.env.SLACK_COMMANDS_TOKEN) {
   res.status(400).json({"error" : "build allowed only for iOS team"});
   return
  }

  if (req.body.channel_id != process.env.SLACK_CHANNEL_ID) {
    res.status(400).json({"error" : "build allowed only for iOS team"});
    return
  }

  body.request.branch = req.body.text;
  body.request.config = config;
  options.body = JSON.stringify(body);
  request(options, function (error, response, body) {
    if(error) res.status(400).json({"error" : error});
    else res.status(200).json({"branch" : req.body.text});
  })
}
