var muestra = [];
var lambda;
var n;
function verValores() {
  n = document.getElementById('n').value;
  if (n === "") return false;
  lambda = document.getElementById('lambda').value;
  if (lambda === "") return false;
  muestra = calcularPoisson(n, lambda);
  insertarGraficoFrecuencias(muestra);
  var varianza1 = varianza(muestra, "varianza1");
  var media1 = media(muestra, "media1");
  var tcl = calcularTCL(muestra, varianza1, media1);
  insertarGraficoTCL(tcl);
  var varianza2 = varianza(tcl, "varianza2");
  var media2 = media(tcl, "media2");
  var prob = document.getElementById("prob");
  prob.classList.remove("d-none");
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
  var muestra = foo(tcl);
  var header = document.getElementById("h1_tcl");
  header.classList.remove("d-none");
  var trace = {
    x: tcl,
    type: 'histogram',
  };
  var trace1 = {
    x: muestra[0],
    y: muestra[1],
    type: 'line'
  };
  var data = [trace, trace1];
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

function probIntervalo(valor) {
  var a = document.getElementById('a').value;
  if (a === "") return false;
  console.log(parseInt(a));
  var b = document.getElementById('b').value;
  if (b === "") return false;
  console.log(parseInt(b));
  if (b < a) {
    document.getElementById('error').innerHTML = "Intervalo incorrecto";
    return true;
  }
  var pIntervalo = calcularProbIntervalMuestra(parseInt(a), parseInt(b), valor);
  var pReal = calcularProbIntervaloReal(parseInt(a), parseInt(b), valor);
  var error = calcularError(pIntervalo, pReal);
  return true;
}

function foo(array) {
  var a = [], b = [], prev;

  for (var i = 0; i < array.length; i++) {
    if (array[i] !== prev) {
      a.push(array[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = array[i];
  }
  console.log(a);
  console.log(b);
  return [a, b];
}

function calcularProbIntervalMuestra(a, b, valor) {
  var frecuencias = foo(muestra);
  switch (valor) {
    case 1:
      // intervalo (a,b)
      var prob = calcularProbMuestra(a + 1, b - 1, frecuencias);
      document.getElementById('probmuestra').innerHTML = "Probabilidad en la muestra: " + prob.toFixed(4) * 100 + "%";
      return prob;
    case 2:
      // intervalo [a,b)
      var prob = calcularProbMuestra(a, b - 1, frecuencias);
      document.getElementById('probmuestra').innerHTML = "Probabilidad en la muestra: " + prob.toFixed(4) * 100 + "%";
      return prob;
    case 3:
      // intervalo (a,b]
      var prob = calcularProbMuestra(a + 1, b, frecuencias);
      document.getElementById('probmuestra').innerHTML = "Probabilidad en la muestra: " + prob.toFixed(4) * 100 + "%";
      return prob;
    case 4:
      // intervalo [a,b]
      var prob = calcularProbMuestra(a, b, frecuencias);
      document.getElementById('probmuestra').innerHTML = "Probabilidad en la muestra: " + prob.toFixed(4) * 100 + "%";
      return prob;
  }
}

function calcularProbIntervaloReal(a, b, valor) {
  switch (valor) {
    case 1:
      // intervalo (a,b)
      var prob = calcularProbReal(a + 1, b - 1);
      document.getElementById('probreal').innerHTML = "Probabilidad Poisson: " + prob.toFixed(8) * 100 + "%";
      return prob;
    case 2:
      // intervalo [a,b)
      var prob = calcularProbReal(a, b - 1);
      document.getElementById('probreal').innerHTML = "Probabilidad Poisson: " + prob.toFixed(8) * 100 + "%";
      return prob;
    case 3:
      // intervalo (a,b]
      var prob = calcularProbReal(a + 1, b);
      document.getElementById('probreal').innerHTML = "Probabilidad Poisson: " + prob.toFixed(8) * 100 + "%";
      return prob;
    case 4:
      // intervalo [a,b]
      var prob = calcularProbReal(a, b);
      document.getElementById('probreal').innerHTML = "Probabilidad Poisson: " + prob.toFixed(8) * 100 + "%";
      return prob;
  }
}

function calcularProbReal(a, b) {
  var probabilidad = 0;
  for (var i = parseInt(a); i <= parseInt(b); i++) {
    var poisson = (Math.exp(-(n * i)) * Math.pow((n * i), i) / fact(i));
    console.log('Poisson ' + i + ' :' + poisson);
    probabilidad += poisson;
    console.log('Probabilidad Real ' + i + ':' + probabilidad);
  }
  console.log('Probabilidad Real:' + probabilidad);
  return probabilidad;
}

function fact(num) {
  var rval = 1;
  for (var i = 2; i <= num; i++)
    rval = rval * i;
  return rval;
}

function calcularError(pIntervalo, pReal) {
  document.getElementById('error').innerHTML = "Error cometido: " + (Math.abs(pIntervalo - pReal).toFixed(4) * 100) + "%";
}

function calcularProbMuestra(a, b, frecuencias) {
  var probabilidad = 0;
  var frec0 = frecuencias[0];
  var frec1 = frecuencias[1];
  var indexa = frec0.indexOf(a);
  console.log('Indice A: ' + indexa);
  var indexb = frec0.indexOf(b);
  console.log('Indice B: ' + indexb);

  if (indexa == indexb) {
    return frec1[indexa] / muestra.length;
  }

  for (var i = indexa; i <= indexb; i++) {
    probabilidad += frec1[i];
    console.log('Suma Frecuencias: ' + probabilidad);
  }
  return probabilidad / muestra.length;
}

// Standard Normal variate using Box-Muller transform.
function randn_bm() {
  var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
  var v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}