//esta funcion realiza las simulaciones para cada caonfiguracion de cache
//variable que sirve para controlar la barra de avance
var promesasCompletadas = 0;
function simularCadaCache(verComportamiento){
  promesasCompletadas = 0
  //se crea un array con las configuraciones de cache que se desean
  var listaArchivos = document.getElementById('listaSimulaciones');
  var tablas = listaArchivos.querySelectorAll('li table');
  const numeroTablas = tablas.length;
  tablas.forEach(function(tabla) {
    var titulo = "";
    const arrayFila = ["","Cap","Aso","Bloq","Reem","HitT","MisP"];
    for (let i = 1; i < tabla.rows.length; i++) {
      const fila = tabla.rows[i];
      // Recorrer todas las celdas de la fila actual
      for (let j = 0; j < fila.cells.length; j++) {
        const celda = fila.cells[j];
        // Acceder al contenido de la celda
        titulo = titulo + arrayFila[j]+ celda.innerText;
      }
    }
    simularConfiguracion(verComportamiento,titulo,tabla,numeroTablas);
  });
}
//esta funcion realiza las simulaciones para cada trace
async function simularConfiguracion(verComportamiento,titulo,tabla,numeroTablas) {
  // Muestra la pantalla de carga
  //se hace un array con los tracer que se seleccionaron
  document.getElementById('pantallaCarga').style.display = 'flex';
  var checkboxes = document.querySelectorAll("#listaArchivos input[type='checkbox']:checked");
  const arraydetraces = Array.from(checkboxes).map((checkbox) => checkbox.getAttribute("value"));
  const totalTraces = arraydetraces.length;
  const promesas = arraydetraces.map((trace) => simularTrace(verComportamiento,tabla,numeroTablas,trace,totalTraces));
  const resultados = await Promise.all(promesas);
  //cierra la pantalla de carga
  document.getElementById('pantallaCarga').style.display = 'none';
  console.log('Carga completada');
  //aqui se hace hace el proceso de descarga de los resultados de todas las simulaciones      
  // Crear un enlace de descarga
  var enlaceDescarga = document.createElement('a');
  enlaceDescarga.href = URL.createObjectURL(new Blob([resultados], { type: 'text/plain' }));
  enlaceDescarga.download = titulo + '.csv';
  //enlaceDescarga.download = archivoGz.slice(0, -3);
  // Simular el clic en el enlace de descarga
  enlaceDescarga.click();
  // Liberar recursos del enlace de descarga
  URL.revokeObjectURL(enlaceDescarga.href);
  pagina4();
}

//esta funcion descomprime cada trace y lo simula
function simularTrace(verComportamiento,tabla,numeroTablas,trace,totalTraces) {
  // Obtener referencia a la barra de carga
  const barraProgreso = document.getElementById('barraRelleno');
  // Mostrar la barra de carg
  barraProgreso.style.width = '0%';  
  //variables de control de la barra de carga
  var totalCorridas = numeroTablas * totalTraces;
  console.log(totalCorridas);
  return new Promise((resolve) => {
    // Simular un procesamiento asíncrono del archivo
    var archivoGz = trace;
    JSZip.loadAsync(archivoInput.files[0])
    .then(function (zip) {
      var archivo = zip.file(archivoGz);
      if (archivo) {
        archivo.async('uint8array')
        .then(function (contenidoGz) {
          //todo lo anterior se realiza para descomprimir los archivos gz aqui se llama a la 
          //simulacion de cada configuracion de cache almacenada en tabla
          // Utilizar pako para descomprimir el contenido del archivo .gz 
          var descomprimido = pako.inflate(contenidoGz, { to: 'string' });
          const resultado = obtenerResultado(verComportamiento,tabla,trace,descomprimido);
          resolve(resultado);
          //console.log(trace);
          promesasCompletadas++;
          console.log(promesasCompletadas);
          // Actualizar el progreso de la barra
          var progreso = Math.floor((promesasCompletadas / totalCorridas) * 100);
          barraProgreso.style.width = `${progreso}%`;          
        })
        .catch(function (error) {
          console.error('Error al descomprimir el archivo .gz:', error);
        });
      } else {
        console.error('No se encontró el archivo .gz en el ZIP');
      }
    })
    .catch(function (error) {
      console.error('Error al cargar o procesar el archivo ZIP:', error);
    });
  });
}

function obtenerResultado(verComportamiento,tabla,trace,descomprimido) {
  //variable que alcacenara todos los resultados
  var resultados = "";
  // Lógica para procesar el archivo y obtener el resultado
  //se obtiene la configuracion de los caches
  var configuracionL1 = [];
  var configuracionL2 = [];
  var configuracionL3 = [];
  //se recorre por filas empezando por L1 --> L2 --L3
  for (let i = 1; i < tabla.rows.length; i++) {
    const fila = tabla.rows[i];
    // Recorrer todas las celdas de la fila actual
    for (let j = 0; j < fila.cells.length; j++) {
      const celda = fila.cells[j];
      // Acceder al contenido de la celda
      if (i==1){
        configuracionL1[j] = celda.innerText;
      }else if (i==2){
        configuracionL2[j] = celda.innerText;
      }
      else if (i==3){
        configuracionL3[j] = celda.innerText;
      }
    }
  }
  //se recorre el archivo por lineas y se combierte a binario
  var nombreTrace = trace.slice(0, -12);
  var porLineas = descomprimido.split("\n");
  // Recorrer cada línea del array
  //se recorre el archivo linea por linea
  porLineas.forEach(function(linea) {
    //cada linea esta en formato "tipo hex" entonces se divide por el caracter espacio
    var infoTransaccion = linea.split(" ");
    var tipo = infoTransaccion[0];
    var hexadecimal = infoTransaccion[1];
    var binario = parseInt(hexadecimal, 16).toString(2);
    //se modela el cache segun las caracteristicas y la direccion binaria obtenida
  });
  return nombreTrace + '\n' + Conversionbinario + '\n';
}




    function generarGrafico() {
      var canvas = document.getElementById("grafico");
      var ctx = canvas.getContext("2d");
      
      // Obtener la instancia del gráfico existente si existe
      var existingChart = Chart.getChart(ctx);
      
      // Destruir el gráfico existente si hay uno
      if (existingChart) {
        existingChart.destroy();
      }
      
      // Borrar el contenido del canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Datos del gráfico
      var data = {
        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
        datasets: [
          {
            label: "Datos de ejemplo",
            data: [10, 20, 30, 25, 40, 35],
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true
          }
        ]
      };
      
      // Opciones del gráfico
      var options = {};
      
      // Crear y mostrar el nuevo gráfico
      var grafico = new Chart(ctx, {
        type: "line",
        data: data,
        options: options
      });
      
    }



    function generarDoble() {
      var canvas = document.getElementById("grafico");
      var ctx = canvas.getContext("2d");
      
      // Obtener la instancia del gráfico existente si existe
      var existingChart = Chart.getChart(ctx);
      
      // Destruir el gráfico existente si hay uno
      if (existingChart) {
        existingChart.destroy();
      }
      
      // Borrar el contenido del canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Datos del gráfico
      var data = {
        labels: ["16", "64", "64", "352"],
        datasets: [
          {
            label: "perlbench_s",
            data: [1.0464400,1.7340800,1.8932300,1.8932300],
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: false
          },
          {
            label: "mcf_s",
            data: [0.2344950,0.3448870,0.3825710,0.3826050],
            borderColor: "rgba(0, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: false
          },
          {
            label: "lbm_s",
            data: [0.2069150,0.2527320,0.2699440,0.2701340],
            borderColor: "rgba(50, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: false
          },
          {
            label: "exchange2_s",
            data: [,1.1334400,1.1376600,1.1376600],
            borderColor: "rgba(100, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: false
          },          
          {
            label: "roms_s",
            data: [0.5524960,0.7426300,0.8993300,0.8831910],
            borderColor: "rgba(150, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: false
          }, 
        // Agrega más datasets si es necesario
        ]
      };
      // Opciones del gráfico
      var options = {};
      
      // Crear y mostrar el nuevo gráfico
      var grafico = new Chart(ctx, {
        type: "line",
        data: data,
        options: options
      });
      
    }


