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
