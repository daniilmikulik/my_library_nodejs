const express = require('express');
const path = require('path');
const router = require('./routes/router');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = 8080;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('logic', path.join(__dirname, 'logic'))


//app.use(express.static('views'));
app.use(express.static('logic'))

app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies
//app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());

//require(path.join(__dirname, 'authentication')).init(app);

app.use(session({secret : "keyboard cat",
                        resave: false,
                        saveUninitialized: false
}));

//app.use(passport.initialize());
//app.use(passport.session());


app.use('/', router);

app.listen(port);

module.exports = app;


