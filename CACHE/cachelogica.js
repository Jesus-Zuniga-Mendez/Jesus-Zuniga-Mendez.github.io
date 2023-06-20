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
                // Utilizar pako para descomprimir el contenido del archivo .gz y verlo en consola
                // var contenidoDescomprimido = pako.inflate(contenidoGz, { to: 'string' });
                //console.log(contenidoDescomprimido);
                // Descomprimir el archivo GZ
                var descomprimido = pako.inflate(contenidoGz, { to: 'string' });
                // Crear un enlace de descarga
                var enlaceDescarga = document.createElement('a');
                enlaceDescarga.href = URL.createObjectURL(new Blob([descomprimido], { type: 'text/plain' }));
                enlaceDescarga.download = 'archivo.txt';
                enlaceDescarga.download = archivoGz.slice(0, -3);
                // Simular el clic en el enlace de descarga
                enlaceDescarga.click();
                // Liberar recursos del enlace de descarga
                URL.revokeObjectURL(enlaceDescarga.href);
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