const http = require('http');
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flashMessaging = require('connect-flash'); 
const SocketIO = require('socket.io');

// ------------- Initializations --------------
const app = express();
const server = http.createServer(app);
const io = SocketIO.listen(server);


require('./database/authDatabase');
require('./passport/local-auth');


//------------------- Settings -----------------------
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('socketio', io);
app.set('port', process.env.PORT || 3000 );

//---------------- Middlewares---------------
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'continuidad_culhuacan',
    resave: false,
    saveUninitialized: false
}));
app.use(flashMessaging());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.signupFlashMessage = req.flash('signupMessage');
    app.locals.loginFlashMessage = req.flash('loginMessage');
    app.locals.socketMessage = req.flash('updateCallback');
    next();
});

// --------------- Routes ----------------------------
app.use('/', require('./routes/index'));


// ----------- Static Files -----------------------
app.use('/public', express.static(path.join(__dirname, 'public')));

// ------------ Starting The Server ---------------
server.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
