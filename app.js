var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var saveRouter  = require('./routes/save-post');
var generationRoute = require('./routes/generation');
var app = express();
const corsOptions = {
  origin: true, // FE của bạn
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.listen(4000, () => console.log('Server started on port 4000'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/login', loginRouter);
app.use('/api/save', saveRouter);
app.use('/api/generate-post-captions', generationRoute);


module.exports = app;
