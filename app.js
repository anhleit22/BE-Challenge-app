var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var loginRouter = require('./routes/login');
var saveRouter  = require('./routes/save-post');
var saveIdeaRouter  = require('./routes/save-idea');
var unSaveRouter = require('./routes/unsave');
var ideasRouter  = require('./routes/post-ideas');
var getContentRouter  = require('./routes/get-content');
var ideasPostRouter  = require('./routes/generation-ideas');

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

app.use('/api/login', loginRouter);
app.use('/api/save', saveRouter);
app.use('/api/save-ideas', saveIdeaRouter);
app.use('/api/unsave', unSaveRouter);
app.use('/api/post-ideas', ideasRouter);
app.use('/api/get-content', getContentRouter);
app.use('/api/generate-list-ideas', ideasPostRouter);
app.use('/api/generate-post-captions', generationRoute);


module.exports = app;
