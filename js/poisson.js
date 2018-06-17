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
  var frecuenciasOrdenadas = foo(tcl);
  var colores = generarColores(frecuenciasOrdenadas[0].length);
  var ctx = document.getElementById("tcl");
  var myChart;
  if (ctx.classList.contains('d-none')) {
    document.getElementById("tcl").className = "d-block";
    myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: frecuenciasOrdenadas[0],
        datasets: [{
          label: 'Frecuencias',
          data: frecuenciasOrdenadas[1],
          backgroundColor: colores,
          borderColor: colores,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

  } else {
    removeData(myChart);
    addData(myChart, frecuenciasOrdenadas[0], frecuenciasOrdenadas[1]);
  }
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
  var frecuenciasOrdenadas = foo(muestra);
  var colores = generarColores(frecuenciasOrdenadas[0].length);
  var ctx = document.getElementById("frecuencias");
  var myChart;
  if (ctx.classList.contains('d-none')) {
    document.getElementById("frecuencias").className = "d-block";
    myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: frecuenciasOrdenadas[0],
        datasets: [{
          label: 'Frecuencias',
          data: frecuenciasOrdenadas[1],
          backgroundColor: colores,
          borderColor: colores,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

  } else {
    removeData(myChart);
    addData(myChart, frecuenciasOrdenadas[0], frecuenciasOrdenadas[1]);
  }
}

function color() {
  var r = Math.round(Math.random() * 255);
  var g = Math.round(Math.random() * 255);
  var b = Math.round(Math.random() * 255);
  var a = 1; //transparencia entre 0 a 1
  return this.rgba = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
}

function generarColores(tamaño) {
  var colores = [];
  for (var i = 0; i < tamaño; i++) {
    colores.push(color());
  }
  return colores;
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

  return [a, b];
}

function addData(chart, label, data) {
  chart.data.dataset[0].labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}

function media(array, id) {
  var avg = arr.mean(array);
  document.getElementById(id).innerHTML = "La media de la muestra es " + avg.toFixed(2);
  return avg;
}

function varianza(array, id) {
  var varianza = arr.variance(array);
  document.getElementById(id).innerHTML = "La varianza de la muestra es " + varianza.toFixed(2);
  return varianza;
}

