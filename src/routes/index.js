const express = require('express');
const router = express.Router();
const passport = require('passport');

const callbackDB = require('../models/callbacks');

router.get('/',(req, res, next) =>{
    res.redirect('/login');
});

/*------------------  REGISTRO ------------------*/
/*
router.get('/signup',(req, res, next) =>{
    res.render('signup');
}); // lee peticion get y manda la pagina signup

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/panel',
    failureRedirect: '/signup',
    passReqToCallback: true
}));
*/

/*-------------------  ACCESO ------------------*/
router.get('/login',(req, res) =>{
    res.render('login');
});

router.post('/login',passport.authenticate('local-login',{
    successRedirect: '/panel',
    failureRedirect: '/login',
    passReqToCallback: true
}));
/*------------------  CALLBACKS ------------------*/
router.post('/api/panel',  async(req, res) =>{
    var io = req.app.get('socketio');
    const callbackResponse = req.body;
    var rhX = parseFloat(callbackResponse.siteRH);
    rhX = rhX*0.10;
    callbackResponse.siteRH = rhX.toFixed(2).toString(10);
    
    switch (parseInt(callbackResponse.generalStatus)) {
        case 0:
            callbackResponse.estadoPuerta = 'Cerrada';
            callbackResponse.estadoEnergia = 'Inactivo';
            break;
        case 1:
            callbackResponse.estadoPuerta = 'Cerrada';
            callbackResponse.estadoEnergia = 'Activo'; 
            break;
        case 16: 
            callbackResponse.estadoPuerta = 'Abierta';
            callbackResponse.estadoEnergia = 'Inactivo';
            break;
        case 17:
            callbackResponse.estadoPuerta = 'Abierta';
            callbackResponse.estadoEnergia = 'Activo';
            break;
        default: 
            callbackResponse.estadoPuerta = 'Cerrada';
            callbackResponse.estadoEnergia = 'Inactivo';
    }

    //callbackResponse.fecha = Date();
    
    const callbackData =  new callbackDB(callbackResponse);
    await callbackData.save();

    const emergentCallback =  await callbackDB.find().sort({$natural:-1}).limit(8);
    io.emit('emergent_callback', emergentCallback);
    
    res.end();
});

router.get('/api/panel', (req, res, next) =>{
    res.send('Error: This function is not avialable');
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/login');
});

router.get('/panel', checkAuthentication, async (req, res, next) =>{
    const dashVars =  await callbackDB.find().sort({$natural:-1}).limit(8);
    res.render('panel', {
        dashVars
      });
});

function checkAuthentication(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect('/');
    }
}

module.exports = router;