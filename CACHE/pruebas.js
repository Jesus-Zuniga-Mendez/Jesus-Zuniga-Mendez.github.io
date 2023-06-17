function genera_tabla() {
    // Obtener la referencia del elemento body
    var body = document.getElementsByTagName("body")[0];
    // Crea un elemento <table> y un elemento <tbody>
    var tabla   = document.createElement("table");
    var tblBody = document.createElement("tbody");
    // Crea las celdas
    for (var i = 1; i < 5; i++) {
      // Crea las hileras de la tabla
      var hilera = document.createElement("tr");
      for (var j = 1; j < 6; j++) {
        // Crea un elemento <td> y un nodo de texto, haz que el nodo de
        // texto sea el contenido de <td>, ubica el elemento <td> al final
        // de la hilera de la tabla
        var celda = document.createElement("td");
        var textoCelda = document.createTextNode("celda en la hilera "+i+", columna "+j);
        celda.appendChild(textoCelda);
        hilera.appendChild(celda);
      }
      // agrega la hilera al final de la tabla (al final del elemento tblbody)
      tblBody.appendChild(hilera);
    }
    // posiciona el <tbody> debajo del elemento <table>
    tabla.appendChild(tblBody);
    // appends <table> into <body>
    body.appendChild(tabla);
    // modifica el atributo "border" de la tabla y lo fija a "2";
    tabla.setAttribute("border", "2");
  }
  

  function set_background() {
    // get a list of all the body elements (there will only be one),
    // and then select the zeroth (or first) such element
    myBody = document.getElementsByTagName("body")[0];
  
    // now, get all the p elements that are descendants of the body
    myBodyElements = myBody.getElementsByTagName("p");
  
    // get the second item of the list of p elements
    myP = myBodyElements[1];
    myP.style.background = "rgb(255,0,0)";
  }

// leeeeerarchivo
  function leerArchivo(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
      return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
      var contenido = e.target.result;
      mostrarContenido(contenido);
    };
    lector.readAsText(archivo);
  }
  
  function mostrarContenido(contenido) {
    var elemento = document.getElementById('contenido-archivo');
    elemento.innerHTML = contenido;
  }
  
  document.getElementById('file-input')
    .addEventListener('change', leerArchivo, false);

    //hasta aqui leer archiv´


  function elzip(){
    var archivoInput = document.getElementById("inputArchivo");

    archivoInput.addEventListener("change", function(evento) {
      var archivo = evento.target.files[0];
    
      var lector = new FileReader();
    
      lector.onload = function(eventoLector) {
        var contenidoArchivo = eventoLector.target.result;
    
        JSZip.loadAsync(contenidoArchivo)
          .then(function(zip) {
            // Acceder al contenido del archivo ZIP
            zip.file("archivo.txt").async("text")
              .then(function(content) {
                console.log(content); // Mostrar el contenido del archivo
              });
          });
      };
    
      lector.readAsArrayBuffer(archivo);
    });
  }



function lafuncion(e){
    const targz = require('targz');
    console.log("estoy aqui");
    var archivo = e.target.files[0];
    targz.decompress({
        src: 'archivo.tar.gz',
        dest: 'ruta' //ruta donde se realiza la descompresión ...
    }, function(err){
        if(err) {
            console.log(err);
        } else {
            console.log("Done!");
        }
    });
}
document.getElementById('file-input')
.addEventListener('change', lafuncion, false);
  