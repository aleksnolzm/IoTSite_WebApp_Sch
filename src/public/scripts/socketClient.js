var socket = io.connect('https://radio-xhipn.herokuapp.com:443/');
//var socket = io.connect('http://localhost:3000');

const updateTempTxValue = document.getElementById('tempTxValue');
const updateTempSiteValue = document.getElementById('tempSiteValue');
const updateHumSiteValue = document.getElementById('humSiteValue');




var updateFecha = [document.getElementById('fecha0'), 
  document.getElementById('fecha1'), 
  document.getElementById('fecha2'), 
  document.getElementById('fecha3'), 
  document.getElementById('fecha4'), 
  document.getElementById('fecha5'), 
  document.getElementById('fecha6'), 
  document.getElementById('fecha7')];

var updatePuerta = [document.getElementById('puerta0'), 
  document.getElementById('puerta1'), 
  document.getElementById('puerta2'), 
  document.getElementById('puerta3'), 
  document.getElementById('puerta4'), 
  document.getElementById('puerta5'), 
  document.getElementById('puerta6'), 
  document.getElementById('puerta7')];

var updateEnergia = [document.getElementById('energia0'), 
  document.getElementById('energia1'), 
  document.getElementById('energia2'), 
  document.getElementById('energia3'), 
  document.getElementById('energia4'), 
  document.getElementById('energia5'), 
  document.getElementById('energia6'), 
  document.getElementById('energia7')];


socket.on('emergent_callback', function (callback) {

  updateTempTxValue.innerHTML = `${callback[0].txTemp}<span class="symbol">ºC</span>`;
  updateTempSiteValue.innerHTML = `${callback[0].siteTemp}<span class="symbol">ºC</span>`;
  updateHumSiteValue.innerHTML = `${callback[0].siteRH}<span class="symbol">%HR</span>`;

  if( callback[0].txTemp >= 45){
    updateTempTxValue.className = 'numberWarning';
  }else{
    updateTempTxValue.className = 'number';
  }

  if(callback[0].siteTemp >= 45){
    updateTempSiteValue.className = 'numberWarning';
  }else{
    updateTempSiteValue.className = 'number';
  }

  if(callback[0].siteRH >=80){
    updateHumSiteValue.className = 'numberWarning';
  }else{
    updateHumSiteValue.className = 'number';
  }

  for(var i = 0; i<8 ; i++)
  {
    updateFecha[i].innerHTML = callback[i].fecha;
    updatePuerta[i].innerHTML = callback[i].estadoPuerta;
    updateEnergia[i].innerHTML = callback[i].estadoEnergia;
  }
});