var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
mongoose= require("mongoose");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cors=require('cors')

var app = express();
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

mongoose.connect(`mongodb://127.0.0.1:27017/usersdb`,
// mongoose.connect('mongodb+srv://narkaur:tj3RiZdyXD966clL@cluster0.utw3lfq.mongodb.net/usersdb?retryWrites=true&w=majority',
{useNewUrlParser: true,
useUnifiedTopology:true
}
)
const db=mongoose.connection
db.on("error",console.error.bind(console,"connection error: "))
db.once("open",function(){
    console.log("Connected Successfully")
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
