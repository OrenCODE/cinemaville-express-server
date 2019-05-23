var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

var app = express();

const notFoundPage = (path) => {
    return (req, res, next) => {
        res.sendFile(path);
    }
};

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.use(notFoundPage(path.join(__dirname, 'public', '404.html')));


module.exports = app;
