class TrazosFondo {
  constructor(x, y, obra, tinte, scale = 1) {
    this.x = x;
    this.y = y;
    this.imagen = obra;
    this.color = tinte;
    this.scale = scale;
    this.velocidad = 2;
    this.colorOriginal = tinte;
  }

  dibujar() {
    push();
    tint(this.color);
    translate(this.x, this.y);
    scale(this.scale);
    image(this.imagen, 0, 0);
    pop();
  }
}

class TrazosDer {
    constructor(x, y, obra, escala = 1){
        this.x = x;
        this.y = y;
        this.img = obra;
        this.escala = escala;
        this.velocidad = 20;
 }

    dibujar(){
        push();
        translate(this.x,this.y);
        scale(this.escala);
        image(this.img,0,0);
        pop();
    }

    moverDerecha() {
    this.x += 5;
    if (this.x > width + 100) { // si se sale de la pantalla
    this.x = -100; // vuelve por la izquierda
    this.y = random(0, height);
  }
 }
}

class TrazosIzq {
    constructor(x, y, obra, escala = 1){
        this.x = x;
        this.y = y;
        this.img = obra;
        this.escala = escala;
        this.velocidad = 20;
    }

    dibujar(){
        push();
        translate(this.x,this.y);
        scale(this.escala);
        image(this.img,0,0);
        pop();
    }

   moverIzquierda() {
  this.x -= 5;
  if (this.x < -100) { // si se sale de la izquierda
    this.x = width + 100; // reaparece a la derecha
    this.y = random(0, height);
        }
    }
}

class TrazosCent {
    constructor(x, y, obra, escala = 1){
        this.x = x;
        this.y = y;
        this.img = obra;
        this.escala = escala;
        this.ang = 0;
    }

    dibujar(){
        push();
        translate(this.x,this.y);
        rotate(this.ang);
        scale(this.escala);
        image(this.img,0,0);
        pop();
    }

    cambiarTamaño(tamNuevo){
        this.escala = tamNuevo;
    }

    rotar(velocidad = 0.01){
        this.ang += velocidad;
    }
}
