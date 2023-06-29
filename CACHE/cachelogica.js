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
    var arrayConfiguraciones = [configuracionL1,configuracionL2,configuracionL3];
    simularConfiguracion(verComportamiento,titulo,cantidadConfiguraciones,arrayConfiguraciones);
  });
}
//esta funcion realiza las simulaciones para cada trace
async function simularConfiguracion(verComportamiento,titulo,cantidadConfiguraciones,arrayConfiguraciones) {
  // Muestra la pantalla de carga
  //se hace un array con los tracer que se seleccionaron
  document.getElementById('pantallaCarga').style.display = 'flex';
  var checkboxes = document.querySelectorAll("#listaArchivos input[type='checkbox']:checked");
  const arraydetraces = Array.from(checkboxes).map((checkbox) => checkbox.getAttribute("value"));
  const totalTraces = arraydetraces.length;
  console.log("Traces a simular para cada configuracion",totalTraces);
  console.time('tiempo');
  const promesas = arraydetraces.map((trace) => simularTrace(verComportamiento,cantidadConfiguraciones,trace,totalTraces,arrayConfiguraciones));
  const resultados = await Promise.all(promesas);
  console.timeEnd('tiempo');
  //cierra la pantalla de carga
  document.getElementById('pantallaCarga').style.display = 'none';
  console.log('Carga completada');
  //aqui se hace hace el proceso de descarga de los resultados de todas las simulaciones      
  // Crear un enlace de descarga
  var ArchivoDescargar = "Trace,Misses,MissRate,MissesLectura,MissRateLectura,MissesEscritura,MissRateEscritura\n";
  for (let i = 0; i < resultados.length; i++){
    ArchivoDescargar = ArchivoDescargar + resultados[i];
  }

  mediaGeometricaTotal = Math.pow(mediaGeometricaTotal, 1 / resultadosAlmacenados);
  mediageometricaMissrateTotal = Math.pow(mediageometricaMissrateTotal, 1 / resultadosAlmacenados);
  mediaGeomeLectura = Math.pow(mediaGeomeLectura, 1 / resultadosAlmacenados);
  mediageometricaMissrateLectura = Math.pow(mediageometricaMissrateLectura, 1 / resultadosAlmacenados);
  mediaGeometricaEscritura = Math.pow(mediaGeometricaEscritura, 1 / resultadosAlmacenados);
  mediageometricaMissrateEscritura = Math.pow(mediageometricaMissrateEscritura, 1 / resultadosAlmacenados);
  var lineaFinal = "MediaGeometrica,"+mediaGeometricaTotal+","+mediageometricaMissrateTotal+","+mediaGeomeLectura+","+mediageometricaMissrateLectura+","+mediaGeometricaEscritura+","+mediageometricaMissrateEscritura;
  mediaGeometricaTotal = 1;
  mediageometricaMissrateTotal = 1;
  mediaGeomeLectura = 1;
  mediageometricaMissrateLectura = 1;
  mediaGeometricaEscritura = 1;
  mediageometricaMissrateEscritura = 1;
  resultadosAlmacenados = 0; 
  ArchivoDescargar = ArchivoDescargar + lineaFinal;  
  var enlaceDescarga = document.createElement('a');
  enlaceDescarga.href = URL.createObjectURL(new Blob([ArchivoDescargar], { type: 'text/plain' }));
  enlaceDescarga.download = titulo + '.csv';
  //enlaceDescarga.download = archivoGz.slice(0, -3);
  // Simular el clic en el enlace de descarga
  enlaceDescarga.click();
  // Liberar recursos del enlace de descarga
  URL.revokeObjectURL(enlaceDescarga.href);
  pagina4(ArchivoDescargar);
}

//esta funcion descomprime cada trace y lo simula
function simularTrace(verComportamiento,cantidadConfiguraciones,trace,totalTraces,arrayConfiguraciones) {
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
          const resultado = obtenerResultado(verComportamiento,trace,descomprimido,arrayConfiguraciones);      
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

var mediaGeometricaTotal = 1;
var mediageometricaMissrateTotal = 1;
var mediaGeomeLectura = 1;
var mediageometricaMissrateLectura = 1;
var mediaGeometricaEscritura = 1;
var mediageometricaMissrateEscritura = 1;
var resultadosAlmacenados = 0;
function obtenerResultado(verComportamiento,trace,descomprimido,arrayConfiguraciones) {
  console.log("%c Resultados: ", 'color: red;' ,trace, "# ", (promesasCompletadas+1));
  //variable que alcacenara todos los resultados
  var resultado = "";
  var caclulo = 0;
  //se recorre el archivo por lineas y se combierte a binario
  var nombreTrace = trace.slice(0, -12);
  var porLineas = descomprimido.split("\n");
  /*var L1 = arrayCaches[0];
  var L2 = arrayCaches[1];
  var L3 = arrayCaches[2];*/
  //console.log("se hacen los cache");
  let L1 = new Cache(arrayConfiguraciones[0],"L1");
  let L2 = new Cache(arrayConfiguraciones[1],"L2");
  let L3 = new Cache(arrayConfiguraciones[2],"L3");
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
        //console.log("lineas leidas", contadorLineas);
        //console.log("lineas procesadas", L1.totalaccesos);
      }
    }else{
      console.log("%cERROR: No existe el primer nivel de cache simulacion invalida", 'color: red;');
    }
  });
  resultado = resultado + nombreTrace + ",";
  resultado = resultado + L1.totalmisses + ",";
  resultado = resultado + ((L1.totalmisses * 100) / L1.totalaccesos) + ",";
  resultado = resultado + L1.totalmisseslectura + ",";
  resultado = resultado + ((L1.totalmisseslectura * 100) / L1.totallecturas) + ",";
  resultado = resultado + L1.totalmissesescritura + ",";
  resultado = resultado + ((L1.totalmissesescritura * 100) / L1.totalescrituras) + "\n";  
  mediaGeometricaTotal = mediaGeometricaTotal * L1.totalmisses;
  mediageometricaMissrateTotal = mediageometricaMissrateTotal * ((L1.totalmisses * 100) / L1.totalaccesos);
  mediaGeomeLectura = mediaGeomeLectura *L1.totalmisseslectura;
  mediageometricaMissrateLectura = mediageometricaMissrateLectura * ((L1.totalmisseslectura * 100) / L1.totallecturas);
  mediaGeometricaEscritura = mediaGeometricaEscritura * L1.totalmissesescritura;
  mediageometricaMissrateEscritura = mediageometricaMissrateEscritura * ((L1.totalmissesescritura * 100) / L1.totalescrituras);
  resultadosAlmacenados++;
  //console.log(L1.matriz);
  //L1.limpiarCache();
  return resultado;
}



class Cache {

  constructor(configuracion,tipo) {
    if (configuracion.length == 7){
      this.nombre = configuracion[0];
      //console.log("construyendo cache ",this.nombre);
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
      //console.log("tag",this.tamniotag);
      //console.log("tamanioIndex",this.tamanioIndex);
      //console.log("tamaniobyteOffset",this.tamaniobyteOffset);
      //se hace la tabla que representará al cache
      this.filas = Math.pow(2, this.tamanioIndex); // Número de filas
      //this.filas = 3;
      // Llenar la matriz con strings
      this.espacios=["Idefecto","tagdefecto","datadefecto",1];
      this.columnas = 1 + (this.espacios.length*parseInt(this.asociatividad)); // Número de columnas, se almacena 
      // Crear una matriz vacía
      this.matriz = [];
      for (let i = 0; i < this.filas; i++) { //filas
        this.matriz[i] = [];
        var way=0;
        var contadorReemplazo = 1;
        for (let j = 0; j < this.columnas; j++) { //columnas
          if (j == 0){
            //var indexGuardar = this.completarbinario(i.toString(2),this.tamanioIndex);
            var indexGuardar = i.toString(2).padStart(this.tamanioIndex, '0');
            this.matriz[i][j] = indexGuardar; //se almacena el index
          }else{
            if (way == (this.espacios.length - 1)){
              this.matriz[i][j] = contadorReemplazo;
              way = 0;
              contadorReemplazo++;
            }else{
              this.matriz[i][j] = this.espacios[way];
              way++;
            }
          }          
        }
      }
      //console.log("matriz en cero ",this.matriz[0].toString());
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
    }else{
      //console.log("No existe",tipo);
      this.tipo = tipo;
      this.existe = false;
    }
  }
  valido() {
      return this.existe;
  }
  
  acceder(tipo,binario) {
    var Esmiss = true;
    //variables para encontrar el inico y final
    var inicio = 1;
    var final = this.tamniotag;
    //se saca el tag
    var tag = binario.substring((inicio-1), final);
    //se saca el index
    inicio = final + 1;
    final = inicio + this.tamanioIndex - 1;
    var index = binario.substring((inicio-1), final);
    //se saca el byteoffset;
    inicio = final + 1;
    final = inicio + this.tamaniobyteOffset - 1;
    var byteOffse = binario.substring((inicio-1), final);
    //se combierte el index a entero para poder ubicar la posicion de la tabla
    var indexEntero = parseInt(index, 2);
    //se hace una comprobacion de el index versus el de la tabla
    if (this.matriz[indexEntero][0] == index){
      //se rqgistra el acceso que se realizaraá
      this.totalaccesos++;
      var imprimir = false;
      var inferiormuestreoHits = 995000;
      var inicioInstruccionesImprimir = 50000;
      var finInstruccionesImprimir = 50005;
      if ((this.totalaccesos >= inicioInstruccionesImprimir) && (this.totalaccesos <= finInstruccionesImprimir)){
        //imprimir = true;
        if (imprimir){
          console.log('%c acceso ','color: blue', this.totalaccesos.toString());
        }
      }else{
        imprimir = false;
      }      
      if (imprimir){
        console.log("matriz sin tratar ");
        console.log(this.matriz[indexEntero].toString());
        console.log("datos de acceso");
        console.log("tipo",tipo.toString());
        console.log("binario",binario.toString());
        console.log("index",index.toString());
        console.log("tag",tag.toString());
        console.log("byteofsst",byteOffse.toString());
      }
      if ((tipo == "w") || (tipo == "W")){
        this.totalescrituras++;
        if (imprimir){
          console.log("escritura suma");
          console.log(this.totalescrituras.toString());
        }
      }else if ((tipo == "r") || (tipo == "R")){   
        this.totallecturas++;
        if (imprimir){
          console.log("lecturas suma");
          console.log(this.totallecturas.toString());
        }        
      }else{
        console.log("Este es el else de la suma de lecturas y escrituras no deberia de salir")        
      }
      //esta variable permite controlar el retiro de datoss de cada way
      var columnaRevisar = 1;
      //se asume que este acceso va a ser un  miss
      var miss = true;
      //esta variable guarda los reemplazoa almacenados
      var validAlmacenado ="";
      var tagAlmacenado ="";
      var dataAlmacenado ="";
      var reemplazoAlmacenado =0;
      var columnaDondeEstaReemplazo =0; 
      //se recorren todos los ways para determinar si es un hit o un miss
      for (let c = 1; c <= this.asociatividad; c++) {
        //se retiran los datos de cada way
        validAlmacenado = this.matriz[indexEntero][columnaRevisar];
        tagAlmacenado = this.matriz[indexEntero][columnaRevisar+1];
        dataAlmacenado = this.matriz[indexEntero][columnaRevisar+2];
        reemplazoAlmacenado = this.matriz[indexEntero][columnaRevisar+3];
        columnaDondeEstaReemplazo = columnaRevisar+3;
        columnaRevisar = columnaRevisar + 4;
        /*if (this.totalaccesos == 1000){
          console.log("validAlmacenado",validAlmacenado);
          console.log("tagAlmacenado",tagAlmacenado);
          console.log("dataAlmacenado",dataAlmacenado);
          console.log("LRUAlmacenado",ReemplazoAlmacenado);
        }*/
        if (tagAlmacenado == tag){
          if (this.totalaccesos> inferiormuestreoHits){
            //imprimir = true;
            if (imprimir){
              console.log('%c acceso ','color: yellow', this.totalaccesos.toString());
            }
          }
          if (imprimir){
            console.log("fue hit");
            console.log(tagAlmacenado.toString());
            console.log(tag.toString());
            console.log(tipo);
            console.log("actualizamos reemplazo");
            console.log(this.matriz[indexEntero].toString());
          } 
          //si esta, el dato en algun way comprobando el tag quiere decir que no es un miss
          miss = false;
          //se registra en cual tag se encontro ya que si se encontro es el 
          //way que se utilizo mas recientemente
          //se actualiza el indice de reempazo
          this.actualizarReemplazo(indexEntero,reemplazoAlmacenado, columnaDondeEstaReemplazo);
          //como se encontro se detiene el ciclo
          if (imprimir){
            console.log("reemplazo actualizado");
            console.log(this.matriz[indexEntero].toString());
          } 
          break;
        }
      }
      //se verifica el estado de la variable miss, si es un miss se comprueba que tipo de acceso era
      //y se suma el contador correspondiente 
      if (miss == true){
        if (this.totalaccesos> inferiormuestreoHits){
          //imprimir = true;
          if (imprimir){
            console.log('%c acceso ','color: green', this.totalaccesos.toString());
          }
        }
        if ((tipo == "w") || (tipo == "W")){
          //si es un miss y era escritura se suman los contadores
          this.totalmisses++;
          this.totalmissesescritura++; 
          if (imprimir){
            console.log("fue mis");
            console.log(tagAlmacenado.toString());
            console.log(tag.toString());
            console.log(tipo);
            console.log("escribimos");
            console.log(this.matriz[indexEntero].toString());
          }  
          //como es un miss hay que escribir en cache
          this.escribir(indexEntero,"V",tag,binario);
          if (imprimir){
            console.log("escrito");
            console.log(this.matriz[indexEntero].toString());
          }  
        }else if ((tipo == "r") || (tipo == "R")){   
          //si es un miss y era lectura se suman los contadores
          this.totalmisses++;
          this.totalmisseslectura++; 
          if (imprimir){
            console.log("fue mis con ");
            console.log(tagAlmacenado);
            console.log(tag.toString());
            console.log(tipo);
            console.log("leemos no hacemos nada");
            console.log(this.matriz[indexEntero].toString());
          }  
          this.escribir(indexEntero,"V",tag,binario);
          if (imprimir){
            console.log("no se hizo nada");
            console.log(this.matriz[indexEntero].toString());
          } 
        }else{
          console.log("Este es el else de las lecturas y escrituras no deberia de salir")        
        }
      }
    }else{
      console.log("Este es el if del index no deberia de salir");
    }              
    return Esmiss;
  }

  //funcion que escribe en el cache
  escribir(indexEntero,valid,tag,binario) {
    if (this.politicaReemplazo == "LRU"){
      var columnaRevisar = 4;
      var valorMinimo = 1;
      var reemplazoAlmacenado =0;
      for (let c = 1; c <= this.asociatividad; c++) {
        if (this.matriz[indexEntero][columnaRevisar] == valorMinimo){
          this.matriz[indexEntero][columnaRevisar-3] = valid;
          this.matriz[indexEntero][columnaRevisar-2] = tag;
          this.matriz[indexEntero][columnaRevisar-1] = binario;
          this.actualizarReemplazo(indexEntero,valorMinimo, columnaRevisar);      
          break;
        }
        columnaRevisar = columnaRevisar + 4;
      }
    }else if (this.politicaReemplazo == "Aleatorio"){
      const min = 1;
      const max = this.asociatividad;
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      var columnainicio = ((randomNum -1)*4)+1;
      /*if (this.totalaccesos>999900){
        console.log("vlid",valid);
        console.log("tag",tag);
        console.log("binario",binario);
        console.log("matriz sin modificar");
        console.log(this.matriz[indexEntero].toString());
        console.log("random generado");
        console.log(randomNum);
        console.log("columna a modificar",columnainicio);
      }*/
      this.matriz[indexEntero][columnainicio] = valid;
      this.matriz[indexEntero][columnainicio+1] = tag;
      this.matriz[indexEntero][columnainicio+2] = binario;
      /*if (this.totalaccesos>999900){
        console.log("matriz modificada");
        console.log(this.matriz[indexEntero].toString());
      }*/     
    }else{
      console.log("else del actualizarreemplazo no deberia de salir");
    }
  }
  //funcion que actualiza cual es el way mas recientemente utilizado
  actualizarReemplazo(indexEntero,reemplazoAlmacenado, columnaDondeEstaReemplazo){
    //si el reemplazo es LRU coloca en la casilla del index,way el valor que indica mas reciente  
    if (this.politicaReemplazo == "LRU"){
      var valorMaximo = +this.asociatividad;
      var valorMinimo = 1;
      var columnaRevisar = 4;
      for (let c = 1; c <= this.asociatividad; c++) {
        if (this.matriz[indexEntero][columnaRevisar]>reemplazoAlmacenado){
          this.matriz[indexEntero][columnaRevisar] = this.matriz[indexEntero][columnaRevisar] - 1;
          if ((this.matriz[indexEntero][columnaRevisar]) < valorMinimo){
            console.log("el errorsote");
          }
        }
        columnaRevisar = columnaRevisar + 4;
      }
      this.matriz[indexEntero][columnaDondeEstaReemplazo] = valorMaximo;
    }else if (this.politicaReemplazo == "Aleatorio"){
      //codigo de aleatoio
    }else{
      console.log("else del actualizarreemplazo no deberia de salir");
    }
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
    for (let i = 0; i < this.filas; i++) { //filas
      var way=0;
      for (let j = 0; j < this.columnas; j++) { //columnas
        if (j == 0){
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





/*
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

*/

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
      
      // Ajustar la resolución del gráfico
      var devicePixelRatio = window.devicePixelRatio || 1; // Obtener el valor de resolución del dispositivo
      myChart.canvas.style.width = (myChart.canvas.width / devicePixelRatio) + 'px';
      myChart.canvas.style.height = (myChart.canvas.height / devicePixelRatio) + 'px';
      myChart.canvas.width *= devicePixelRatio;
      myChart.canvas.height *= devicePixelRatio;
    }


