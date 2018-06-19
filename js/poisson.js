function verValores() {
  var n = document.getElementById('n').value;
  if (n === "") return false;
  var lambda = document.getElementById('lambda').value;
  if (lambda === "") return false;
  var muestra = calcularPoisson(n, lambda);
  insertarGraficoFrecuencias(muestra);
  var varianza1 = varianza(muestra, "varianza1");
  var media1 = media(muestra, "media1");
  var tcl = calcularTCL(muestra, varianza1, media1);
  insertarGraficoTCL(tcl);
  var varianza2 = varianza(tcl, "varianza2");
  var media2 = media(tcl, "media2");
  return true;
}

function calcularTCL(muestra, varianza, media) {
  var tcl = [];
  for (var i = 0; i < muestra.length; i++) {
    tcl.push((muestra[i] - media) / Math.sqrt(varianza));
  }
  return tcl;
}

function insertarGraficoTCL(tcl) {
  var header = document.getElementById("h1_tcl");
  header.classList.remove("d-none");
  var trace = {
    x: tcl,
    type: 'histogram',
  };
  var data = [trace];
  Plotly.newPlot('tcl', data);
}

function calcularValorPoisson(lambda) {
  var L = Math.exp(-lambda);
  var p = 1.0;
  var k = 0;

  do {
    k++;
    p *= Math.random();
  } while (p > L);

  return k - 1;
}

function calcularPoisson(n, lambda) {
  var muestra = [];
  for (i = 0; i <= n; i++) {
    muestra.push(calcularValorPoisson(lambda));
  }
  muestra.sort((a, b) => a - b);
  return muestra;
}

function insertarGraficoFrecuencias(muestra) {
  var trace = {
    x: muestra,
    type: 'histogram',
  };

  var data = [trace];
  Plotly.newPlot('frecuencias', data);
}

function media(array, id) {
  var avg = arr.mean(array);
  if (id === 'media2') document.getElementById(id).innerHTML = "x&#x0304; = " + Math.abs(avg.toFixed(2));
  else document.getElementById(id).innerHTML = "x&#x0304; = " + avg.toFixed(2);
  return avg;
}

function varianza(array, id) {
  var varianza = arr.variance(array);
  document.getElementById(id).innerHTML = "S<sup>2</sup>= " + varianza.toFixed(2);
  return varianza;
}