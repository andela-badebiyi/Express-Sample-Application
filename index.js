var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert("sample-key.json"),
  databaseURL: "https://sample-project-d3888.firebaseio.com"
});
// helps you get form data passed in request
app.use(bodyParser.urlencoded({extended: true}));

// configures express with ejs template engine
app.set('view engine', 'ejs');

// get reference to users node in firebase
var ref = admin.database().ref('/users');

app.get('/signup', function (req, res) {
  res.render('signup');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    ref.child(username).on('value', function(data) {
        var user = data.val();
        if (user === null) {
            res.send("this user does not exist");
        } else {
            if (password === user.password) {
                // if (user.role == "admin") {
                //     res.render('adminDashboard')
                // } else {
                //     res.render('requesterDashboard')
                // }
                res.render("home", {
                    username: username,
                    password: password
                });
            } else {
                res.send("invalid password");
            }
        }
    });
});

app.post('/signup', function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    ref.child(username).set({
        'email': email,
        'username': username,
        'password': password
    });
    res.render('home', {username: username});
});


app.get('/home', function(req, res) {
    res.render('home', {name: 'bodunde'});
    // res.sendFile('./home.html');
});

app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});