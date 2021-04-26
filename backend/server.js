const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const usersRouter = require('./routes/users');
const groupsRouter = require('./routes/groups');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const {auth} = require('./config/passport');
var session = require( "express-session" );

const app = express();
dotenv.config();

//activate body parser
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'database-1.c7md5anch9xu.us-east-2.rds.amazonaws.com'];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true
}
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
app.use(
  session( {
      key: 'user_sid',
      secret: "cmpe_273_lab2",
      resave: false,
      saveUninitialized: false,
      cookie: {
          expires: 6000000
      }
  } )
);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// pass(link) requests to routes
app.use('/users', usersRouter);
app.use('/groups', groupsRouter);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

// connect to MongoDB
mongoose.connect(process.env.DATABASE_ACCESS,  {useNewUrlParser: true, useUnifiedTopology: true}, () =>{
  console.log("MongoDB connected");
})

// passport
app.use(passport.initialize())
app.use(passport.session())
auth();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server is running on PORT: ' + PORT);
});