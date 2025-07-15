/////////////////////////////////----CONTROLADOR-----///////////////////////////////////////

//variables globales calibrables para la interacción
let AMP_MIN = 0.002;
let AMP_MAX = 0.035;

let FREC_MIN = 110;
let FREC_MAX = 200;

let debug =  false;

///////////////////////////////////////////////////////////////////////////////////////////


//para precargar las imagenes de los trazos
let cargaTrazos = []; //trazos del fondo

//trazos para las distintas clases/objetos
let cTrazosDer = [];
let cTrazosIzq = [];
let cTrazosCent = [];

//para guardar los objetos del trazo
let trazos = [];
let trazosDer = [];
let trazosIzq = [];
let trazosCent = [];

//cantidad de trazos pal fondo
let canT = 10;

//para limitar el tamaño de la obra
let margenAncho, margenAlto; // ni idea pq se implemento esto (discutir más tarde)
//para precargar la paleta
let paleta;
//guarda el fondo (PGraphics)
let pg;

//estos bulianos son para los cambios de estados
let haySonido = false;
let antesHabiaSonido = false; 

//variables del SONIDO !!!
let mic; // this es para cargar la entrada del AUDIO
let amp_cruda;
let amp;
let frec_cruda;
let frec;
let pitch; //objeto de ML que carga y procesa todos los datos de frecuencia
let audioContext;
const pichModel = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let gestorSenial; //gestor de señal para amortitguar, suavizar o filtrar la señal de amplitud
let gestorFrec; //lo mismo para la frecuencia

//precarga para que el programa funcione
function preload(){

  //para que se pueda usar desde el principio
  paleta = new Paleta ('data/paleta0.jpg');

  //el nombre lo dice to (solo quiero menos ruido visual)
  precargarTrazos();
}


function setup() {
  //para que se renderize
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(userStartAudio);
  
  //arma el pgraphics (para el fondo)
  pg = createGraphics(width,height);

  //para que limpie la pantalla
  background(255);

  //para que la imagen se mueva desde el centro
  imageMode(CENTER);
  //para que paleta funcione
  colorMode(RGB);

  /*crea un margen para algo
  margenAncho = windowWidth; //-150
  margenAlto = windowHeight;
  */

  //---------------- AUDIO----------------
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  //parametro funcion startPitch es de ML5
  mic.start(startPitch);
  userStartAudio();

  gestorAmp =  new GestorSenial(AMP_MIN, AMP_MAX);
  gestorFrec =  new GestorSenial(FREC_MIN, FREC_MAX);

  //--------------- ARMADO DE FONDO Y TRAZOS----------------
  fondo();
  dibujarTrazos();

}

function draw() {

  background (255);

  ////////////////////////------- apartado de  AUDIO ------//////////////////////////
  amp_cruda = mic.getLevel(); // el MICROFONO recibe la señal DIRECTA 
  gestorAmp.actualizar(amp_cruda); // el gestor PROCESA esa señal directa
  
  //luego de esto CARGAMOS la señal FILTRADA ya procesada por el gestor (linea 120)
  amp = gestorAmp.filtrada;
  frec = gestorAmp.filtrada;


  //////////////////////////////----- apartado de RENDERIZADO -----/////////////////////////////
  renderizado();

  /////////////////////////--------FUNCIÓN para la INTERACCIÓN---------/////////////////////////////
  interacciónActiva();

  //DEBUG
  if(debug){
    informacion();
  }


}


function interacciónActiva(){

  let tam = map(amp, 0, 1, 2, 100);
  let vel = map(frec, 0, 1, 0, 15); 


  //hace true el boolean que verifica si HAY sonido con un valor de amplitud
  haySonido = amp > 0.01;

  //el sonido empieza si antes NO habia sonido Y ahora si 
  let empezoElSonido = !antesHabiaSonido && haySonido;

  //el sonido termina si antes SI habia sonido Y ahora NO 
  let terminoElSonido = !haySonido && antesHabiaSonido; //--> no usamos esto todavía

//reinicio de la obra

if(empezoElSonido){
  renderizado();
  console.log("empecho el chonidooo");
}

if(terminoElSonido){
  
  //arma el pgraphics (para el fondo)
  pg = createGraphics(width, height);

  //para que limpie la pantalla
  background(255);

  //GENERA UN FONDO Y TRAZOS NUEVOSSSSSS
  fondo();
  dibujarTrazos();
  console.log("telmino el chonido");

}


///////////////////////<<<<<------TRAZOS FONDO----->>>>//////////////////////////

//queda ajustar la condicional del audio, comprobe que funciona bien de todas formas
if(amp > 0.1){//sonido agudo
  console.log("Fondo_sonido detectado")
  for(let i = 0; i < 27; i++){
    push();
    pg.tint(paleta.darUnColor());
    pg.image(cargaTrazos[int(random(0,9))],0,0);
    pop();
  }
}else{
  console.log("Fondo_sonido acabo");
}



///////////////////////<<<<<------TRAZOS DERECHA----->>>>//////////////////////////
if(haySonido){
  for(let d = 0; d < trazosDer.length; d++){
      if((amp > AMP_MAX) && (d%2 == 0)){
        trazosDer[d].moverDerecha();
      }
  }
}

///////////////////////<<<<<------TRAZOS IZQUIERDA----->>>>//////////////////////////
if(haySonido){
  for(let i = 0; i < trazosIzq.length; i++){
    if(amp > AMP_MAX){
    trazosIzq[i].moverIzquierda();
  }
}
}


///////////////////////<<<<<------TRAZOS CENTRO----->>>>//////////////////////////
if(haySonido){
  for(let c = 0; c < trazosCent.length; c++){
    trazosCent[c].rotar();

  }

}


antesHabiaSonido = haySonido; //guarda el estado anterior de "haySonido" en mi variable "antesHabiaSonido"

}

//FUNCTION para renderizar el fondo y las imagenes (draw)
function renderizado(){
  
  //RENDERIZA el fondo
  image(pg,width/2 ,height/2);
  
  // RENDERIZA los trazos
  for(let d = 0; d<16; d++){
    trazosDer[d].dibujar();
  }
  for(let i = 0; i<15; i++){
    trazosIzq[i].dibujar();
  }
  for(let c = 0; c<23; c++){
    trazosCent[c].dibujar();
  }

}


//para poder usarlo en el pgraphics
function fondo(){
  pg.scale(0.7);
  for(let i = 0; i < 27; i++){
    push();
    pg.tint(paleta.darUnColor());
    pg.image(cargaTrazos[int(random(0,9))],0,0);
    pop();
  }
}

function dibujarTrazos(){

  //Crea los trazos(fondo)
  for(let i=0; i<canT; i++){
    let x = random(150, width);
    let y = random(0, height);
    trazos[i] = new TrazosFondo(x,y,cargaTrazos[i],paleta.darUnColor());
  }

  //crea los TRAZOS (der, izq, cent)
  for(let i = 0; i<16; i++){
    let x = random(150, width);
    let y = random(0, height);
    trazosDer[i] = new TrazosDer(x, y, cTrazosDer[i]);
  }
  for(let i = 0; i<15; i++){
    let x = random(150, width);
    let y = random(0, height);
    trazosIzq[i] = new TrazosIzq(x, y, cTrazosIzq[i]);
  }
  for(let i = 0; i<23; i++){
    let x = random(150, width);
    let y = random(0, height);
    trazosCent[i] = new TrazosCent(x, y, cTrazosCent[i], null);
  }
}

function precargarTrazos(){
  for(let i=0; i<canT; i++){
    cargaTrazos[i] = loadImage('data/trazos/fondo/trazo'+ i +'.png' ); //cargamos una por una los trazos al sketch
    //muestra el proceso de cuales de estos trazos han sido cargados
    console.log(`cargando trazos ${i} de ${canT} FONDO`);
  }
  
  for(let i = 0; i<16; i++){  
    cTrazosDer[i] = loadImage('data/trazos/der/trazo'+ i +'.png' );
    console.log(`cargando trazos ${i} de ${15} DERECHA`);
  }
  
  for(let i = 0; i<15; i++){  
    cTrazosIzq[i] = loadImage('data/trazos/izq/trazo'+ i +'.png' ); 
    console.log(`cargando trazos ${i} de ${14} IZQUIERDA`);
  }
  
  for(let i = 0; i<23; i++){  
    cTrazosCent[i] = loadImage('data/trazos/cent/trazo'+ i +'.png' );
    console.log(`cargando trazos ${i} de ${22} CENTRO`);
  }
}

//resetea la obra para evitar tener que hacerlo por reload
function keyPressed(){

}

function informacion(){
  background(0);
  push();
  textSize(20);
  fill(255);
  let texto = "Amplitud Cruda: " + amp_cruda;
  text(texto, 50, 50);

  texto = "Frecuencia Cruda: " + frec_cruda;
  text(texto, 50, 100);

  noStroke();
  fill(255, 0, 0);
  let posY = map(amp_cruda, AMP_MIN, AMP_MAX, height, 0  );
  ellipse(width/2 - 50, posY, 50, 50 );

  fill(0, 255, 0);
  posY = map(amp, 0, 1, height, 0  );
  ellipse(width/2 +  50, posY, 50, 50 );

  gestorAmp.dibujar(50, 150);
  gestorFrec.dibujar(50, 300);

  pop();


}
// --- Modelo para detectar el pitch (frecuencia) de la librería ML5 (versión 0.12.2)
function startPitch() {
  pitch = ml5.pitchDetection(pichModel, audioContext , mic.stream, modelLoaded); // inicializa el modelo entrenado
}

function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    if (frequency) {
      frec_cruda = frequency; // cargo la respuesta del análisis (frequency) en mi variablel frecCruda;
      gestorFrec.actualizar(frec_cruda); // proceso la señal directa de frecuencia por el gestor
    } else {
    }
    getPitch();
  })
}
