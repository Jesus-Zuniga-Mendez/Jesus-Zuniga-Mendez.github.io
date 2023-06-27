//esta funcion realiza las simulaciones para cada caonfiguracion de cache
//variable que sirve para controlar la barra de avance
var promesasCompletadas = 0;
function simularCadaCache(verComportamiento){
  promesasCompletadas = 0
  //se crea un array con las configuraciones de cache que se desean
  var listaArchivos = document.getElementById('listaSimulaciones');
  var tablas = listaArchivos.querySelectorAll('li table');
  const cantidadConfiguraciones = tablas.length;
  console.log("Configuraciones a simular",cantidadConfiguraciones);
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
    //se construyen los objetos cache segun la configuracion
    var L1 = new Cache(configuracionL1,"L1");
    var L2 = new Cache(configuracionL2,"L2");
    var L3 = new Cache(configuracionL3,"L3");
    var arrayCaches = [L1,L2,L3];
    simularConfiguracion(verComportamiento,titulo,arrayCaches,cantidadConfiguraciones);
  });
}
//esta funcion realiza las simulaciones para cada trace
async function simularConfiguracion(verComportamiento,titulo,arrayCaches,cantidadConfiguraciones) {
  // Muestra la pantalla de carga
  //se hace un array con los tracer que se seleccionaron
  console.time('tiempo');
  document.getElementById('pantallaCarga').style.display = 'flex';
  var checkboxes = document.querySelectorAll("#listaArchivos input[type='checkbox']:checked");
  const arraydetraces = Array.from(checkboxes).map((checkbox) => checkbox.getAttribute("value"));
  const totalTraces = arraydetraces.length;
  console.log("Traces a simular para cada configuracion",totalTraces);
  const promesas = arraydetraces.map((trace) => simularTrace(verComportamiento,arrayCaches,cantidadConfiguraciones,trace,totalTraces));
  const resultados = await Promise.all(promesas);
  //cierra la pantalla de carga
  document.getElementById('pantallaCarga').style.display = 'none';
  console.log('Carga completada');
  console.timeEnd('tiempo');
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
function simularTrace(verComportamiento,arrayCaches,cantidadConfiguraciones,trace,totalTraces) {
  // Obtener referencia a la barra de carga
  const barraProgreso = document.getElementById('barraRelleno');
  // Mostrar la barra de carg
  barraProgreso.style.width = '0%';  
  //variables de control de la barra de carga
  var totalCorridas = cantidadConfiguraciones * totalTraces;
  console.log("Total simulaciones",totalCorridas);
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
          const resultado = obtenerResultado(verComportamiento,arrayCaches,trace,descomprimido);
          resolve(resultado);
          //console.log(trace);
          promesasCompletadas++;
          //console.log(promesasCompletadas);
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

function obtenerResultado(verComportamiento,arrayCaches,trace,descomprimido) {
  console.log("Resultados: ",trace, "# ", (promesasCompletadas+1));
  //variable que alcacenara todos los resultados
  var resultados = "";
  //se recorre el archivo por lineas y se combierte a binario
  var nombreTrace = trace.slice(0, -12);
  var porLineas = descomprimido.split("\n");
  var L1 = arrayCaches[0];
  var L2 = arrayCaches[1];
  var L3 = arrayCaches[2];
  // Recorrer cada línea del array
  //se recorre el archivo linea por linea
  var contadorLineas = 0;
  porLineas.forEach(function(linea) {
    //cada linea esta en formato "tipo hex" entonces se divide por el caracter espacio
    contadorLineas++;
    var infoTransaccion = linea.split(" ");
    var tamanioTransaccion = linea.length;
    var tipo = infoTransaccion[0];
    var hexadecimal = infoTransaccion[1];
    //var binario = parseInt(hexadecimal, 16).toString(2);
    var binario = parseInt(hexadecimal, 16).toString(2).padStart(64, '0');
    if (L1.valido()){
      if (tamanioTransaccion != 0){
        acceso = L1.acceder(tipo,binario);   
      }else{
        console.log("lineas leidas", contadorLineas);
        console.log("lineas procesadas", L1.totalaccesos);
        L1.limpiarCache();
      }
    }else{
      console.log("%cERROR: No existe el primer nivel de cache simulacion invalida", 'color: red;');
    }
  });
  return nombreTrace + '\n' + resultados + '\n';
}



class Cache {

  constructor(configuracion,tipo) {
    if (configuracion.length == 7){
      this.nombre = configuracion[0];
      console.log("construyendo cache ",this.nombre);
      this.capacidad = configuracion[1];
      this.asociatividad = configuracion[2];
      this.tamannioBloque = configuracion[3];
      this.politicaReemplazo = configuracion[4];
      this.hitTime = configuracion[5];
      this.missPenalty = configuracion[6];
      this.existe = true;
      //se establece un procesador de 64 bits
      this.tamaniodirecciones = 64;
      //se calcula la capacidad en kb
      var capacidadEnBytes = this.capacidad * 1024;
      //se calcula el set
      var capacidadEntreBloque = capacidadEnBytes / this.tamannioBloque;
      //se calcula el tamanio de los sets
      var sets = capacidadEntreBloque / this.asociatividad;
      //se calcula el tamanio del index
      var seguir = true;
      this.tamanioIndex = 0;
      do{
        if (Math.pow(2, this.tamanioIndex) == sets){
          seguir = false;           
        }else{
          this.tamanioIndex++;
        }
      }while(seguir); 
      //se calcula el tamanio del offset
      seguir = true;
      this.tamaniobyteOffset = 0;
      do{
        if (Math.pow(2, this.tamaniobyteOffset) == this.tamannioBloque){
          seguir = false;           
        }else{
          this.tamaniobyteOffset++;
        }
      }while(seguir);
      //se caclula el tamanio del tag
      this.tamniotag = this.tamaniodirecciones - this.tamanioIndex - this.tamaniobyteOffset;
      console.log("tag",this.tamniotag);
      console.log("tamanioIndex",this.tamanioIndex);
      console.log("tamaniobyteOffset",this.tamaniobyteOffset);
      //se hace la tabla que representará al cache
      this.filas = Math.pow(2, this.tamanioIndex); // Número de filas
      //this.filas = 3;
      // Llenar la matriz con strings
      this.espacios=["V","tag","data","LRU"];
      this.columnas = 1 + (this.espacios.length*parseInt(this.asociatividad)); // Número de columnas, se almacena 
      // Crear una matriz vacía
      this.matriz = [];
      for (let i = 0; i < this.filas; i++) { //filas
        this.matriz[i] = [];
        var way=0;
        for (let j = 0; j < this.columnas; j++) { //columnas
          if (j == 0){
            //var indexGuardar = this.completarbinario(i.toString(2),this.tamanioIndex);
            var indexGuardar = i.toString(2).padStart(this.tamanioIndex, '0');
            this.matriz[i][j] = indexGuardar; //se almacena el index
          }else{
            this.matriz[i][j] = this.espacios[way];
            if (way == (this.espacios.length - 1)){
              way = 0;
            }else{
              way++;
            }
          }          
        }
      }

      this.matrizCopia = this.matriz;
      //console.log(this.matriz);
      //se inicializan las variables de resultados
      //totales
      this.totalaccesos = 0;
      this.totalmisses = 0;
      this.totalmissrate = 0;
      //lectura
      this.totallecturas = 0;
      this.totalmisseslectura = 0;
      this.totalmissratelectura = 0;
      //escritura
      this.totalescrituras = 0;
      this.totalmissesescritura = 0;
      this.totalmissrateescritura = 0;      
      this.tiempoejecucion = 0;
    }else{
      console.log("No existe",tipo);
      this.tipo = tipo;
      this.existe = false;
    }
  }

  valido() {
      return this.existe;
  }
  
  acceder(tipo,binario) {
    this.totalaccesos++;
    var Esmiss = true;
    //se completa a 64 bits
    //binario = this.completarbinario(binario,this.tamaniodirecciones);
    //variables para encontrar el inico y final
    var inicio = 1 
    var final = this.tamniotag;
    //se saca el tag
    //var tag = this.obtenerParteBinario(binario, inicio, final);    
    //se saca el byteoffse
    inicio = final + 1;
    final = inicio + this.tamanioIndex - 1;
    //var index = this.obtenerParteBinario(binario, inicio, final);
    //se saca el inde;
    inicio = final + 1;
    final = inicio + this.tamaniobyteOffset - 1;
    //var byteOffse = this.obtenerParteBinario(binario, inicio, final);
    //se combierte el index a entero para poder ubicar la posicion de la tabla
    //var indexEntero = parseInt(index, 2);
      /*if (this.matriz[f][0] == index){
        var columnaRevisar = 1;
        for (let c = 1; c <= this.asociatividad; c++) { //ways, recorre cada uno de los tres datos por ways  
          var validAlmacenado = this.matriz[f][columnaRevisar];
          columnaRevisar++;
          var tagAlmacenado = this.matriz[f][columnaRevisar];
          columnaRevisar++;
          var dataAlmacenado = this.matriz[f][columnaRevisar];
          columnaRevisar++;
          var LRUAlmacenado = this.matriz[f][columnaRevisar];
          columnaRevisar++;  
          /*if (this.totalaccesos == 1000){
            console.log("validAlmacenado",validAlmacenado);
            console.log("tagAlmacenado",tagAlmacenado);
            console.log("dataAlmacenado",dataAlmacenado);
            console.log("LRUAlmacenado",LRUAlmacenado);
          } *//*       
          if ((tipo == "w") || (tipo == "W")){
          }else if ((tipo == "r") || (tipo == "R")){         
          }
        }
      }
    }  */     
    return Esmiss;
  }

  limpiarCache(){
    //se inicializan las variables de resultados
    //totales
    this.totalaccesos = 0;
    this.totalmisses = 0;
    this.totalmissrate = 0;
    //lectura
    this.totallecturas = 0;
    this.totalmisseslectura = 0;
    this.totalmissratelectura = 0;
    //escritura
    this.totalescrituras = 0;
    this.totalmissesescritura = 0;
    this.totalmissrateescritura = 0;        
    //se limpia la tabla
    this.matriz = this.matrizCopia;
    // Llenar la matriz con strings
    /*for (let i = 0; i < this.filas; i++) { //filas
      this.matriz[i] = [];
      var way=0;
      for (let j = 0; j < this.columnas; j++) { //columnas
        if (j == 0){
          this.matriz[i][j] = i.toString(2); //se almacena el index
        }else{
          this.matriz[i][j] = this.espacios[way];
          if (way == 2){
            way = 0;
          }else{
            way++;
          }
        }          
      }
    }*/
    console.log("se vacia el cache");
    //console.log(this.matriz);
  }

  obtenerParteBinario(binario, inicio, final){
    var resultado = binario.substring((inicio-1), final);
    return resultado;
  }

  completarbinario(binario,tamnio){
    var completado;
    var tamaniobinario = binario.length;
    var faltantes = tamnio - tamaniobinario;
    var complemento = "";
    for(let i=1; i <= faltantes; i++){
      complemento = complemento + "0";
    }
    completado = complemento + binario;
    return completado;
  }

  imprimeCaracteristicas(){
    if (this.existe){
      console.log("Tipo ",this.nombre);
      console.log("capacidad ",this.capacidad);
      console.log("asociatividad ",this.asociatividad);
      console.log("tamannioBloque ",this.tamannioBloque);
      console.log("politicaReemplazo ",this.politicaReemplazo);
      console.log("hitTime ",this.hitTime);
      console.log("missPenalty ",this.missPenalty);
      console.log("Valido ",this.existe);
    }else{
      console.log("No existe ", this.tipo);
    }
  }
  imprimirCache(){
    console.log(this.matriz);
  }
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


