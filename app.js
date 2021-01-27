const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
// const bodyParser = require('body-parser')
const helmet = require('helmet')
const passport = require('passport')
const rIndex = require('./routers/index')
const rAdd = require('./routers/add')
const rUsers = require('./routers/profile')
const expressValidator = require('express-validator')
const session = require('express-session')
const app = express()

 
app.use(helmet())
 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/// Setting Express Validators

app.use(require('connect-flash')())
app.use(function (req, res, next)   {
    res.locals.messages = require('express-messages')(req, res)
    next()
})

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }))


  app.use(expressValidator({
    errorFormatter : (param , msg , value) => {
        let namespace = param.split('.')
            root  = namespace.shift()
            formParam = root
        
            while(namespace.length){
                formParam += '[' + namespace.shift() + ']'
            }
            return{
                param :formParam,
                msg: msg,
                value: value
            }
    }

  }))





///  Setting mongoose
const database = require('./helper/db')
mongoose.connect(database.db, {useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true});

const db = mongoose.connection

db.on('open' , () => {
    console.log( ('MongoDb running'))
})

db.on('error' , (err) => {
    console.log( ('MongoDb error running'))
})



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname , 'public')))
app.use("/uploads", express.static(path.join(__dirname , 'uploads')))

require('./md/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())


app.get('*' , (req  , res , next) => {
    res.locals.user = req.user || null
    next()

})

app.use(rIndex)
app.use(rAdd)
app.use(rUsers)


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
