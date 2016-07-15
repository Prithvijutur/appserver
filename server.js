var express = require('express');
var app = express();


//middleware
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// parameter middleware that will run before the next routes
app.param('name', function(req, res, next, name) {
    req.name = name;
    next();
});


// Routes
app.get('/', function (req, res) {
  res.send('Welcome to my appserver!');
});

app.listen(process.env.OPENSHIFT_NODEJS_PORT || 80, process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1", function () {
  console.log('My app server listening on port 80!');
});

app.post('/api/v1/rsvp/:name', function(req, res) {
    var email = req.body.email;
    var name = req.name;
    res.send(req.name + ' ' + email);
});