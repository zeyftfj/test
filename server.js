const express = require('express')
// const session = require('express-session')
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const compression = require('compression');
const path = require('path')
const app = express()
const port = 3000;
const dbURI = "mongodb+srv://zayaty:9H3jdMZ3ntLDcowq@cluster0.33tbygn.mongodb.net/test?retryWrites=true&w=majority"
const index_router = require('./routes/index.js');
const admin_router = require ( "./routes/admin.js");

// Set Mongoose options to address the strictQuery deprecation warning
mongoose.set('strictQuery', false);

mongoose.connect(dbURI)
    .then(() => console.log(`[MONGO] Connected to MongoDB`))
    .catch((err) => console.log(`[MONGO] Error connecting to MongoDB: ${err}`));

    app.use(session({
      secret: "xa",
      saveUninitialized: false,
      resave: false,
      store:  MongoStore.create({ 
        mongoUrl: dbURI}),
      Cookie: { maxAge: 180 * 60 * 1000 }
      // 180min in cookies
    } ));

    app.use(compression({
      level: 6, // Compression level (0-9)
      threshold: 1024 // Minimum response size in bytes to compress
    }));
    

//setup json middleware
app.use(express.json());
app.use(compression()); // Enable gzip compression
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
//setup static folder for serving static files in Express
app.use(express.static(path.join(__dirname, "public")));

//use ejs filesystem 
app.set("view engine", "ejs");



// view engine setup
app.set("views", path.join(__dirname, "views"));

//setup routes
app.use("/"  , index_router);
app.use("/admin",admin_router);

app.all('*',(req, res, next) => {
  res.status(404).render('pages/404');
});
// Handling other errors
app.use((err, req, res, next) => 
{
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
  
// Server startup message if everything is fine
const server = app.listen(port, () => 
{
    console.log('Happy coding, engineer!');
    console.log(`Server is running at http://localhost:${port}`);
});
  
// Handling errors during server startup
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    switch (error.code) {
      case 'EACCES':
        console.error(`Port ${port} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`Port ${port} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
});
