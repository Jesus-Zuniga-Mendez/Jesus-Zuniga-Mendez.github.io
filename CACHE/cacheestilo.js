//funcion de control de eventos de formulario
function ajustarCaracteristicas(){
  //habilita el div de la pagina 1
  var ocultar = document.getElementById("pagina1");
  ocultar.classList.add("disabled");
  ocultar.classList.remove("disabled");
  ocultar.scrollIntoView();
  //deshabilita el div de la pagina 2
  var ocultar = document.getElementById("pagina2");
  ocultar.classList.add("disabled"); // Para deshabilitar el div
  //deshabilita el div de la pagina 3
  var ocultar = document.getElementById("pagina3");
  ocultar.classList.add("disabled"); // Para deshabilitar el div
  //para desabilitar el boton next de la pagina 1
  var elboton = document.getElementById("Next1");
  elboton.disabled = false;
  elboton.style.pointerEvents = "none";
  elboton.style.opacity = 0.6;
  //para desabilitar el boton next de la pagina 2
  var elboton = document.getElementById("Next2");
  elboton.disabled = false;
  elboton.style.pointerEvents = "none";
  elboton.style.opacity = 0.6;
  //llena la tabla de la pagina 2
  llenarTabla();
  bloquearTabla();
}
//esta funcion llena la tabla dinamicamente
function llenarTabla(){
  //se hace referencia a la tabla
  var laTabla = document.getElementById("tabla");
  //variable de control de resultados 
  var contador = 0;
  //ciclos anidados que permiten recorrer la tabla como matriz
  for (let i = 1; i <= 6; i++) {
    for (let j = 1; j <= 3; j++) {
      // Crea un nuevo elemento <select>
      var combobox = document.createElement('select');
      //variables que definen el inicio y fin de los contadores del ciclo que llena los combos
      var inicio = 0;
      var fin = 7;
      //filtro que permite llenar los combos a necesidad
      if (i == 1) {
        inicio = 3;
        fin = 7;
      }else if(i == 2){
        inicio = 0;
        fin = 4;        
      }else if(i == 3){
        inicio = 4;
        fin = 7;        
      }else if (i == 4){
        inicio = 0;
        fin = 1;                
      }else if (i >= 5){
        inicio = 1;
        fin = 2;                
      }
      //ciclo que llena los combos con items 
      for (let k = inicio; k<=fin;k++){
        var opcion = document.createElement('option');
        //filtro que ajusta los calculos a calcular
        if ((i == 4) && (k == 0)){
          contador = "LRU";
        }else if ((i == 4) && (k == 1)){
          contador = "Aleatorio";
        }else if (i == 5){
          var multiplo = 0;
          if (j == 1){
            multiplo = 1;
          }else if(j ==2){
            multiplo = 3;
          }else{
            multiplo = 15;
          }
          contador = k * 4 * multiplo;
        }else if(i == 6){
          contador = 500 * k;
        }else{
          contador = 2**k;
        }
        //se llenan los dato del combo
        opcion.value = contador;
        opcion.textContent = contador;
        combobox.appendChild(opcion);
      }
      //se llena la celda con el combo
      var celda = laTabla.rows[i].cells[j];
      celda.appendChild(combobox);
    }
  }
}
//esta funcion bloque las columnas de las tablas en funcion del cambio en el combo box
function bloquearTabla(){
  //para bloquear o desbloquear las columnas
  //esta variable indica la columna a partir de la cual se va a deshabilitar o no
  var indiceHabilitar = 0;
  //esta variable selecciona el check mas alto en gerarquia
  var check = document.getElementById("checkSgteNivelL1");
  //se revisa si esta seleccionado
  //si esta seleccionado se revisa el siguiente nivel
  //si no esta seleccionado se debe deshabilitar desde el indice 2
  if (check.checked) {
    var check = document.getElementById("checkSgteNivelL2");
    //si esta seleccionado no se desabilita nada , se fuerza que el for no sea ejecutado
    //si no esta seleccionado quiere decir que que hay que bloquear la columna de l3, es decir el index 3
    if (check.checked){
      indiceHabilitar = 3;
    }else{
      indiceHabilitar = 2;
    }
  }else{
    indiceHabilitar = 1;
    var check = document.getElementById("checkSgteNivelL2");
    check.checked = false;
  }
  //se deshabilitan y habilitan las columnas segun lo definido anteriormente
  var tabla = document.getElementById("tabla");
  for (indice = 0; indice <= 3; indice++){
    var celdas = tabla.querySelectorAll("tr td:nth-child(" + (indice + 1) + ")");
    for (i = 0; i < celdas.length; i++) {
      var celda = celdas[i];
      var input = celda.querySelector("input");
      var select = celda.querySelector("select");
      if (input) {
        input.disabled = true;
        if (indice <= indiceHabilitar){
          input.disabled = false;
        }
      }
      if (select) {
        select.disabled = true;
        if (indice <= indiceHabilitar){
          select.disabled = false;
        }
      }
    }
  }
}
//estas funciones permiten seleccionar y deseleccionar todas las casillas del check box
function seleccionarTodos() {
  var checkboxes = document.querySelectorAll("#listaArchivos input[type='checkbox']");
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = true;
  });
  verificarSeleccion();
}
function NOseleccionarTodos() {
  var checkboxes = document.querySelectorAll("#listaArchivos input[type='checkbox']");
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = false;
  });
  verificarSeleccion();
}
//esta funcion despliega los datos del zip seleccionado
function procesarArchivo() {
  //se carga el contenedor
  var contenedor = document.getElementById('datosDelZip'); 
  //se eliminan los hijos
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
  //crea botones seleccionar todo y deselecconar todo y desplegar
  var boton = document.createElement('button');
  boton.type = 'button';
  boton.textContent = 'All';
  boton.classList.add('botonNormal');
  boton.onclick = seleccionarTodos;
  contenedor.appendChild(boton);
  var boton = document.createElement('button');
  boton.type = 'button';
  boton.textContent = 'None';
  boton.classList.add('botonNormal');
  boton.onclick = NOseleccionarTodos;
  contenedor.appendChild(boton);
  var boton = document.createElement('button');
  boton.type = 'button';
  boton.textContent = 'Ocultar';
  boton.id = 'mostrarOcultar';
  boton.classList.add('botonNormal');
  boton.onclick = mostrarOcultar;
  contenedor.appendChild(boton);
  // agrega la lista de archivos
  var ul = document.createElement('ul');
  ul.id="listaArchivos";
  ul.classList.add('lista-desplegable');
  contenedor.appendChild(ul);
  //se abre el zip
  var archivoInput = document.getElementById('archivoInput');
  var archivo = archivoInput.files[0];
  var lector = new FileReader();
  lector.onload = function(evento) {
    var contenido = evento.target.result;
    // Utilizar JSZip para leer el contenido del archivo ZIP
    JSZip.loadAsync(contenido)
      .then(function (zip) {
        // Obtener la lista de nombres de archivos en el ZIP
        var nombresArchivos = Object.keys(zip.files);
        // Filtrar solo los archivos .gz
        var archivosGz = nombresArchivos.filter(function (nombre) {
          return nombre.endsWith('.gz');
        });
        // Generar los elementos de la lista con casillas de verificación
        var listaArchivos = document.getElementById('listaArchivos');
        listaArchivos.innerHTML = ''; // Limpiar la lista antes de agregar elementos nuevos
        archivosGz.forEach(function (archivo) {
          var li = document.createElement('li');
          var checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = archivo;
          checkbox.checked = true;
          checkbox.addEventListener("click", verificarSeleccion);
          li.appendChild(checkbox);
          li.appendChild(document.createTextNode(archivo));
          listaArchivos.appendChild(li);
          verificarSeleccion();
        });
      })
      .catch(function (error) {
        console.error('Error al cargar o procesar el archivo ZIP:', error);
      });
  };
  lector.readAsArrayBuffer(archivo);
}
//esta funcion muestra o oculta la lista de traces
function mostrarOcultar(){
  // Obtener una referencia a la lista
  var boton = document.getElementById("mostrarOcultar");
  if (boton.textContent == "Ocultar") {
    boton.textContent = 'Mostrar';
  }else{
    boton.textContent = 'Ocultar';
  }
  var listaDesplegable = document.getElementById("listaArchivos");
  //Se hace el cambio
  listaDesplegable.classList.toggle("desplegado");
}
// funcion que revisa si se selecciona al menos una traza para habilitar el boton next
function verificarSeleccion() {
  var lista = document.getElementById("listaArchivos");
  var checkboxes = lista.getElementsByTagName("input");
  var seleccionado = false;

  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      seleccionado = true;
      break;
    }
  }

  if (seleccionado) {
    var elboton = document.getElementById("Next1");
    elboton.disabled = false;
    elboton.style.pointerEvents = "auto";
    elboton.style.opacity = 1;
  } else {
    var elboton = document.getElementById("Next1");
    elboton.disabled = false;
    elboton.style.pointerEvents = "none";
    elboton.style.opacity = 0.6;
  }
}
//estas funciones llenan la tabla de las caracteristicas del cache
function pagina2(){
  //para oculatar el div de seleccion de archivos
  var ocultar = document.getElementById("pagina1");
  ocultar.classList.add("disabled");
  //para ocultar la lista
  var boton = document.getElementById("mostrarOcultar");
  if (boton.textContent == "Ocultar") {
    mostrarOcultar();
  }
  //para habilitar el div de ajustes de cache
  var ocultar = document.getElementById("pagina2");
  ocultar.classList.remove("disabled");
  ocultar.scrollIntoView();
}

//esta funcion habilita la pagina 3 que es donde se simulara el cache
function pagina3(){
  //para oculatar el div de seleccion de archivos
  var ocultar = document.getElementById("pagina2");
  ocultar.classList.add("disabled");
  //para habilitar el div simulacion de cache
  var ocultar = document.getElementById("pagina3");
  ocultar.classList.remove("disabled");
  ocultar.scrollIntoView();
}

//esta funcion toma los datos de la tabla caracterirsticas y los almacena en la tabla de simulacion
function addToLis(){
  //se obtiene la referencia a la lista
  var listaArchivos = document.getElementById('listaSimulaciones');
  //se inicializa la variable que contendra los datos
  var datosL1 = "L1 \t";
  var datosL2 = "L2 \t";
  var datosL3 = "L3 \t";
  //se comprueba los niveles de cache que agrego el usuario
  var numeroColumnas = 1;
  var check = document.getElementById("checkSgteNivelL1");
  if (check.checked) {
    numeroColumnas = 2;
  }
  var check = document.getElementById("checkSgteNivelL2");
  if (check.checked) {
    numeroColumnas = 3;
  }   
  // Se recorre la tabla por filas y despues por celdas
  for (var i = 1; i < (tabla.rows.length - 1); i++) {
    //se obtiene la fila
    var fila = tabla.rows[i];
    //Se recorre celda por celda
    //var cantidadCeldas = fila.cells.length;
    for (var j = 1; j <= numeroColumnas; j++) {
      //se obtiene la celda
      var celda = fila.cells[j]; // Obtener la referencia a la celda
      //se obtiene el combobox
      var combobox = celda.querySelector("select");
      //se obtiene el valor seleccionado del combobox
      var valorSeleccionado = combobox.value;
      //se agrega el valor al string
      if (j == 1){
        datosL1 += valorSeleccionado + "\t";
      }else if (j == 2){
        datosL2 += valorSeleccionado + "\t";
      }else if (j == 3){
        datosL3 += valorSeleccionado + "\t";
      }
    }
    verificarLista();
}
var textoAlmacenar = datosL1 + "\n" + datosL2 + "\n" + datosL3 ;
//listaArchivos.innerHTML = ''; // Limpiar la lista antes de agregar elementos nuevos
var li = document.createElement('li');
var boton = document.createElement('button');
//boton,classList,add("botonNormal");
boton.textContent = "Eliminar \t";
boton.classList.add("eliminar");
boton.addEventListener("click", borrarLineaLista);
li.appendChild(boton);
li.appendChild(document.createTextNode(textoAlmacenar));
listaArchivos.appendChild(li);
}

function borrarLineaLista(){
   // Obtener todos los botones con la clase "eliminar"
  var botonesEliminar = document.getElementsByClassName("eliminar");
  // Recorrer los botones y agregar el evento onclick
  for (var i = 0; i < botonesEliminar.length; i++) {
    var boton = botonesEliminar[i];
    boton.onclick = function() {
      // Obtener el elemento padre del botón, que es la línea de la lista
      var linea = this.parentNode;
      linea.remove(); // Eliminar la línea de la lista
    };
  }
  verificarLista();
}
// funcion que revisa si existen elementos en la lista de simulaciones
function verificarLista() {
  //hace referencia a la lista
  var lista = document.getElementById("listaSimulaciones");
  // Seleccionar todos los elementos <li> dentro de la lista
  var elementos = lista.querySelectorAll("li"); 
  // Obtener la cantidad de elementos
  var cantidadElementos = elementos.length;
  console.log("La lista tiene " + cantidadElementos + " elementos.");
  if (cantidadElementos < 0){
    var elboton = document.getElementById("Next2");
    elboton.disabled = false;
    elboton.style.pointerEvents = "none";
    elboton.style.opacity = 0.6;
  }else{
    var elboton = document.getElementById("Next2");
    elboton.disabled = false;
    elboton.style.pointerEvents = "auto";
    elboton.style.opacity = 1;
  }
}