//esta funcion permite seleccionar y deseleccionar todas las casillas del check box
function seleccionarTodos() {
  var checkboxes = document.querySelectorAll("#listaArchivos input[type='checkbox']");
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = true;
  });
}
function NOseleccionarTodos() {
  var checkboxes = document.querySelectorAll("#listaArchivos input[type='checkbox']");
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = false;
  });
}
//esta funcion procesa el archovo seleccionado
function procesarArchivo() {
  //se carga el contenedor
  var contenedor = document.getElementById('contenedor2'); 
  //se eliminan los hios
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
  //crea botones seleccionar todo y deselecconar todo
  var boton = document.createElement('button');
  boton.type = 'button';
  boton.textContent = 'Seleccionar Todo';
  boton.onclick = seleccionarTodos;
  contenedor.appendChild(boton);
  var boton = document.createElement('button');
  boton.type = 'button';
  boton.textContent = 'Desseleccionar Todo';
  boton.onclick = NOseleccionarTodos;
  contenedor.appendChild(boton);
    //agrega el boton calcular
    var boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = 'Procesar';
    boton.onclick = verContenido;
    contenedor.appendChild(boton); 
  // agrega la lista de archivos
  var ul = document.createElement('ul');
  ul.id="listaArchivos";
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
          li.appendChild(checkbox);
          li.appendChild(document.createTextNode(archivo));
          listaArchivos.appendChild(li);
        });
      })
      .catch(function (error) {
        console.error('Error al cargar o procesar el archivo ZIP:', error);
      });
  };
  lector.readAsArrayBuffer(archivo);
}
//esta funcion procesa el contenido de los gz
function verContenido() {
  var checkboxes = document.querySelectorAll("#listaArchivos input[type='checkbox']:checked");
  checkboxes.forEach(function (checkbox) {
    var archivoGz = checkbox.value;
    JSZip.loadAsync(archivoInput.files[0])
      .then(function (zip) {
        var archivo = zip.file(archivoGz);
        if (archivo) {
          archivo.async('uint8array')
            .then(function (contenidoGz) {
              // Utilizar pako para descomprimir el contenido del archivo .gz
              var contenidoDescomprimido = pako.inflate(contenidoGz, { to: 'string' });
              console.log(contenidoDescomprimido);
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