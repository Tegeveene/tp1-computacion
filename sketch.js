// variables globales 
let AMP_MIN = 0.002;
let AMP_MAX = 0.035;

let FREC_MIN = 50;  
let FREC_MAX = 90;  
let debug = false;

let umbralGolpe = 0.010;         // amplitud mínima para detectar golpe
let frecuenciaMaxGolpe = 200;   // frecuencia máxima para considerar ruido 
let esperaGolpe = 400;          
let ultiGolpe = 0;

let cargaTrazos = []; 

let cTrazosDer = [];
let cTrazosIzq = [];
let cTrazosCent = [];

let trazos = [];
let trazosDer = [];
let trazosIzq = [];
let trazosCent = [];

// cantidad de trazos para el fondo
let canT = 10;

// precargar la paleta
let paleta;
let pg;

// variables del sonido
let haySonido = false;
let antesHabiaSonido = false; 
let mic;
let amp_cruda;
let amp;
let frec_cruda;
let frec;
let pitch;
let audioContext;
let gestorAmp;
let gestorFrec;
const pichModel = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';


function preload(){
  paleta = new Paleta ('data/paleta0.jpg');
  precargarTrazos();
}

function setup() {
  let alto = windowHeight * 0.9;
  let ancho = alto * 1.1;
  createCanvas(ancho, alto).mousePressed(userStartAudio);
  pg = createGraphics(width, height);
  pg.clear();
  fondo();

  background(255);
  imageMode(CENTER);
  colorMode(RGB);

  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch);
  userStartAudio();

  gestorAmp = new GestorSenial(AMP_MIN, AMP_MAX);
  gestorFrec = new GestorSenial(FREC_MIN, FREC_MAX);

  dibujarTrazos();
}

function draw() {
  background(255);

  amp_cruda = mic.getLevel();
  gestorAmp.actualizar(amp_cruda);
  amp = gestorAmp.filtrada;
  frec = gestorFrec.filtrada;

  renderizado();
  interacciónActiva();

  if(debug){
    informacion();
  }
}

function fondo() {
  pg.clear();
  for (let i = 0; i < canT; i++) {
    let x = random(50, width - 50);
    let y = random(50, height - 50);
    pg.tint(paleta.darUnColor());
    pg.image(cargaTrazos[i % cargaTrazos.length], x, y);
  }
}


function interacciónActiva() {
  let haySonido = amp > 0.02;
  let empezoElSonido = !antesHabiaSonido && haySonido;
  let terminoElSonido = !haySonido && antesHabiaSonido; //--> no usamos esto todavía

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
  trazos = [];
  dibujarTrazos();
  console.log("telmino el chonido");

}

  if (haySonido && frec_cruda != null) {
    // grave: mueve a la izquierda
    if (frec_cruda >= 20 && frec_cruda <= 100) {
      for (let i = 0; i < trazosIzq.length; i++) {
        trazosIzq[i].moverIzquierda();
      }
    }
    // aguda: mueve a la derecha (silbido)
    if (frec_cruda > 300) {
      for (let i = 0; i < trazosDer.length; i++) {
        trazosDer[i].moverDerecha();
      }
    }
    // rota los trazos del centro
    for (let i = 0; i < trazosCent.length; i++) {
      trazosCent[i].rotar(0.2);
    }
  }

//vibracion y la concha de tu hermana

  //sonido corto y fuerte - detección de aplauso

  const max_trazos_fondo = 30;

  if (haySonido && amp > umbralGolpe && (frec_cruda < frecuenciaMaxGolpe || !amp_cruda) && (millis() - ultiGolpe > esperaGolpe)) {
    ultiGolpe = millis();
    let x = random(10, width);
    let y = random(0, height);
    trazos.push(new TrazosFondo(x, y, random(cargaTrazos), paleta.darUnColor()));

    console.log("trazos: "+trazos.length);
    //para q no se trabe llamamos a la función 'shift()' para q no se acumulen objetos en el array y no se sobrecargue
    if(trazos.length > max_trazos_fondo){
      trazos.shift();
      x = random(150, width);
      y = random(0, height);
    }
  }

  antesHabiaSonido = haySonido;
}

function renderizado(){
  image(pg, width / 2, height / 2);

  for (let f = 0; f < trazos.length; f++) {
    trazos[f].dibujar();
  }

  for (let d = 0; d < trazosDer.length; d++) {
    trazosDer[d].dibujar();
  }

  for (let i = 0; i < trazosIzq.length; i++) {
    trazosIzq[i].dibujar();
  }

  for (let c = 0; c < trazosCent.length; c++) {
    trazosCent[c].dibujar();
  }
}

function dibujarTrazos(){
  for(let i = 0; i < canT; i++){
    let x = random(150, width - 150);
    let y = random(0, height);
    trazos[i] = new TrazosFondo(x, y, cargaTrazos[i], paleta.darUnColor());
  }

  for(let i = 0; i < 16; i++){
    let x = random(150, width - 150);
    let y = random(0, height);
    trazosDer[i] = new TrazosDer(x, y, cTrazosDer[i]);
  }
  for(let i = 0; i < 15; i++){
    let x = random(150, width - 150);
    let y = random(0, height);
    trazosIzq[i] = new TrazosIzq(x, y, cTrazosIzq[i]);
  }
  for(let i = 0; i < 23; i++){
    let x = random(150, width - 150);
    let y = random(0, height);
    trazosCent[i] = new TrazosCent(x, y, cTrazosCent[i], null);
  }
}

function precargarTrazos(){
  for(let i = 0; i < canT; i++){
    cargaTrazos[i] = loadImage('data/trazos/fondo/trazo'+ i +'.png');
  }
  
  for(let i = 0; i < 16; i++){  
    cTrazosDer[i] = loadImage('data/trazos/der/trazo'+ i +'.png');
  }
  
  for(let i = 0; i < 15; i++){  
    cTrazosIzq[i] = loadImage('data/trazos/izq/trazo'+ i +'.png'); 
  }
  
  for(let i = 0; i < 23; i++){  
    cTrazosCent[i] = loadImage('data/trazos/cent/trazo'+ i +'.png');
  }
}

function informacion(){
  push();
  fill(0);
  textSize(16);
  textAlign(LEFT);

  text("Amplitud Cruda: " + nf(amp_cruda, 0, 4), 20, 40);
  text("Amplitud Filtrada: " + nf(amp, 0, 4), 20, 70);

  text("Frecuencia Cruda: " + (frec_cruda ? nf(frec_cruda, 0, 2) : "null"), 20, 110);
  text("Frecuencia Filtrada: " + nf(frec, 0, 2), 20, 140);

  text("¿Hay sonido? " + (amp > 0.02 ? "Sí" : "No"), 20, 180);
  pop();
}

function startPitch() {
  pitch = ml5.pitchDetection(pichModel, audioContext , mic.stream, modelLoaded);
}

function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    if (frequency) {
      frec_cruda = frequency;
      gestorFrec.actualizar(frec_cruda);
    }
    getPitch();
  });
}
