var express = require('express');
var app = express();
var mongojs = require('mongojs');


// db layer
// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/appserver';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

var db = mongojs(connection_string, ['rsvp']);

db.rsvp.find({}).forEach(function(err, doc) {
  if (err) throw err;
  if (doc) { console.dir('Attendent - ', doc); }
});


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

app.get('/api/vi/invites', function(req, res) {
    db.rsvp.find({}).forEach(function(err, doc) {
      if (err) throw err;
      if (doc) {res.send(doc); }
    });
  
})

app.listen(process.env.OPENSHIFT_NODEJS_PORT || 80, process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1", function () {
  console.log('My app server listening on port 80!');
});

app.post('/api/v1/rsvp/:name', function(req, res) {
    var email = req.body.email;
    var name = req.name;
    db.rsvp.insert({'name' : req.name,
                    'email': email
    });
    res.send(req.name + ' ' + email);
});