//dimensiones del tablero de juego
var altoTablero = 0;
var anchoTablero = 0;
var gameIsPlaying = 0;
//genera el responsive de la pantalla
function reEscalar(){
    var ancho = window.innerWidth - 20;
    var alto = window.innerHeight - 20;
    reEscalarContainer(ancho,alto);
    reEscalarContenedor(ancho,alto);
    reEscalarLineas();
}
function reEscalarContainer(ancho,alto){
    const container = document.getElementById('container');
    container.style.width = ancho + "px";
    container.style.height = alto + "px";
    container.style.alignItems = "center";
    container.style.display = "flex";
}
//genera el ancho adecuado para dispositivos moviles con aspect ratio 18:9
function reEscalarContenedor(ancho,alto){
    ancho = alto/2;
    const contenedor = document.getElementById('contenedor');
    contenedor.style.width = (ancho - (0.025*ancho)) + "px";
    contenedor.style.height = (alto - (0.05*alto)) + "px";
    altoTablero = (alto - (0.05*alto));
    anchoTablero = (ancho - (0.025*ancho));
}
function reEscalarLineas(){
    var anchoLinea = 0.03*anchoTablero;
    var altoLinea = altoTablero;
    const lineaIzquierda = document.getElementById('lineaIzquierda');
    const lineaDerecha = document.getElementById('lineaDerecha');
    lineaIzquierda.style.width = anchoLinea + "px";
    lineaIzquierda.style.height = altoLinea + "px";
    lineaDerecha.style.width = anchoLinea + "px";
    lineaDerecha.style.height = altoLinea + "px";
    lineaIzquierda.style.left = 0 + 'px'
    lineaIzquierda.style.bottom = 0 + 'px'
    lineaDerecha.style.left = (anchoTablero - anchoLinea) + 'px'
    lineaDerecha.style.bottom = 0 + 'px'
}
function pantallaInicio(){
    const contenedor = document.getElementById('contenedor');
    
    var button = document.createElement('input');
    contenedor.appendChild(button);
    button.type = 'button';
    button.id = 'BotonPlay';
    button.value = 'Play';
    button.className = 'BotonPlay';
    button.onclick = function() {
    // …
    };
    const boton = document.getElementById('BotonPlay');
    boton.style.width =  (anchoTablero - (anchoTablero*0.4)) + "px";
    boton.style.height = (altoTablero / 4) + "px";
    boton.style.left = (anchoTablero - (anchoTablero*0.4))/2 - ((anchoTablero - (anchoTablero*0.4))/4) + "px";
    //juego();
}

//funcion que controla los estados del juego
function beginGame(){
    if (gameIsPlaying == 0){
        //llama a las funciones de inicio de pantalla
        gameIsPlaying = 1;
        reEscalar();
        pantallaInicio();
    }else{
        //llama a las funciones de reiniciar juego
        gameIsPlaying = 0;
        return;
    }
}



function juego(){


const contenedor = document.querySelector('.contenedor');


//definicion de medidas
const altoBloque = 20
const anchoBloque = 100
//definir posicion del usuario
const posicionInicialUsuario = [230,10]
let posicionActualUsuario = posicionInicialUsuario
//definir la posicion de la bola
const posicionInicialBola = [270,40]
const posicionActualBola = posicionInicialBola
//definicion particularidad de la bola
let xDireccionBola = 5
let yDireccionBola = 5
let diametro = 20
//definir el timer
let timerID
//definicion clase bloque 
class Bloque{
    constructor(ejeX, ejeY){
        this.bottomLeft = [ejeX, ejeY]
        this.bottomRigth = [ejeX + anchoBloque, ejeY]
        this.topLeft = [ejeX, ejeY + altoBloque]
        this.topRigth = [ejeX + anchoBloque, ejeY + altoBloque]
    }
}
//definir todos los bloques
const bloques = [
    new Bloque(10, 250),
    new Bloque(120, 250),
    new Bloque(230, 250),
    new Bloque(340, 250),
    new Bloque(450, 250),
    new Bloque(10, 220),
    new Bloque(120, 220),
    new Bloque(230, 220),
    new Bloque(340, 220),
    new Bloque(450, 220),
    new Bloque(10, 190),
    new Bloque(120, 190),
    new Bloque(230, 190),
    new Bloque(340, 190),
    new Bloque(450, 190),
]
//Funcion de añadir bloques
function addBloques(){
    for(let i = 0; i < bloques.length; i++){
        const bloque = document.createElement('div')
        bloque.classList.add('bloque')
        bloque.style.left = bloques[i].bottomLeft[0] + 'px'
        bloque.style.bottom = bloques[i].bottomLeft[1] + 'px'
        contenedor.appendChild(bloque)
    }
}
//añadir bloques al juego
addBloques()
//definir usuario
function dibujarUsuario(){
    usuario.style.left = posicionActualUsuario[0] + 'px'
    usuario.style.bottom = posicionActualUsuario[1] + 'px'
}
//añadir usuario
const usuario = document.createElement('div')
usuario.classList.add('usuario')
contenedor.appendChild(usuario)
dibujarUsuario()
//mover al usuario por el tablero
function moverUsuario(e){
    switch(e.key){
        case 'ArrowLeft':
            if (posicionActualUsuario[0] > 0){
                posicionActualUsuario[0] -= 40
                dibujarUsuario()
            }
            break
        case 'ArrowRight':
            if (posicionActualUsuario[0] < (anchoTablero-anchoBloque)){
                posicionActualUsuario[0] += 40
                dibujarUsuario()
            }
    }
}
//añadir evento escuchador para el documento
document.addEventListener('keydown', moverUsuario)
//dibujar la bola
function dibujarBola(){
    bola.style.left = posicionActualBola[0] + 'px'
    bola.style.bottom = posicionActualBola[1] + 'px'
}
const bola = document.createElement('div')
bola.classList.add('bola')
contenedor.appendChild(bola)
dibujarBola()
//mueve la bola
function moverBola(){
    posicionActualBola[0] += xDireccionBola
    posicionActualBola[1] += yDireccionBola
    dibujarBola()
    revisarColisiones()
    gameOver()
}
timerID = setInterval(moverBola, 20)
function revisarColisiones(){
    //Colision con bloques
    for (let i = 0; i < bloques.length; i++){
        if( (posicionActualBola[0] > bloques[i].bottomLeft[0] && posicionActualBola[0] < bloques[i].bottomRigth[0]) &&
            ((posicionActualBola[1]  + diametro) > bloques[i].bottomLeft[1] && posicionActualBola[1] < bloques[i].topLeft[1])
        ){
            const todosLosBloques = Array.from(document.querySelectorAll('.bloque'))
            todosLosBloques[i].classList.remove('bloque')
            bloques.splice(i,1)
            cambiarDireccion()
        }
    }
    //Colisiones con las paredes
    if(
        posicionActualBola[0] >= (anchoTablero - diametro) ||
        posicionActualBola[1] >= (altoTablero - diametro) ||
        posicionActualBola[0] <= 0 ||
        posicionActualBola[1] <= 0
    ){
        cambiarDireccion()
    }
    //revision colision con usuario
    if((posicionActualBola[0] > posicionActualUsuario[0] && posicionActualBola[0] < posicionActualUsuario[0] + anchoBloque) && 
    (posicionActualBola[1] > posicionActualUsuario[1] && posicionActualBola[1] < posicionActualUsuario[1] + altoBloque)
    ){
        cambiarDireccion()
    }
}
//funcion que termina el juego si la bola toca suelo.
function gameOver(){
    if(posicionActualBola[1] <= 0){
        clearInterval(timerID)
        //puntuacion.innerHTML = 'mamo'
        document.removeEventListener('keydown',moverUsuario)
    }
}
//Funcion de cambiar la dirección.
function cambiarDireccion(){
    if(xDireccionBola === 5 && yDireccionBola === 5){
        yDireccionBola = -5
        return
    }
    if(xDireccionBola === 5 && yDireccionBola === -5){
        xDireccionBola = -5
        return
    }
    if(xDireccionBola === -5 && yDireccionBola === -5){
        yDireccionBola = 5
        return
    }
    if(xDireccionBola === -5 && yDireccionBola === 5){
        xDireccionBola = 5
        return
    }
}
}