var express = require('express');
var bodyParser = require('body-parser');

var slack = require('./controllers/slack');
var travis = require('./controllers/travis');

const port = process.env.PORT || 5000;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, function () {
  console.log('#### server started http://localhost:' + port);
});

app.get("/", (req,res) => {
    res.status(200).json({"status" : "ok"});
});

app.get("/status", (req,res) => {
    res.status(200).json({"status" : "ok"});
});

app.post("/slack", slack.message);
app.post("/travis/release", travis.release);

module.exports = app;
