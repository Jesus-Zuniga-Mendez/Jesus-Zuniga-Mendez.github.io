var testPosRaton = document.getElementById("testPosRaton");
var output = document.getElementById("output");

testPosRaton.addEventListener("mousemove", function(evt) {
  var mousePos = oMousePos(testPosRaton, evt);
  marcarCoords(output, mousePos.x, mousePos.y)
}, false);

testPosDedo.addEventListener("touchstart", function(evt) {
  var mousePos = oMousePos(testPosRaton, evt);
  marcarCoords(output, mousePos.x, mousePos.y)
}, false);

testPosDezlizar.addEventListener("touchmove", function(evt) {
  var mousePos = oMousePos(testPosRaton, evt);
  marcarCoords(output, mousePos.x, mousePos.y)
}, false);

testPosRaton.addEventListener("mouseout", function(evt) {
  limpiarCoords(output);
}, false);

function marcarCoords(output, x, y) {
  output.innerHTML = ("x: " + x + ", y: " + y);
  var cssString = "";
  // http://www.quirksmode.org/dom/w3c_css.html#t30
  cssString += "top:" + (y + 10) + "px;";
  cssString += "left:" + (x + 10) + "px;";
  cssString += "visibility:visible;";
  output.style.cssText = cssString;

  testPosRaton.style.cursor = "pointer";
}

function limpiarCoords(output) {
  output.style.cssText = "";
  testPosRaton.style.cursor = "default";
}

function oMousePos(element, evt) {
  var ClientRect = element.getBoundingClientRect();
  return { //objeto
    x: Math.round(evt.clientX - ClientRect.left),
    y: Math.round(evt.clientY - ClientRect.top)
  }
}

