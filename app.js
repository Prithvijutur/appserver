var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Welcome to my appserver!');
});

app.listen(process.env.OPENSHIFT_NODEJS_PORT || 80, process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1", function () {
  console.log('My app server listening on port 80!');
});