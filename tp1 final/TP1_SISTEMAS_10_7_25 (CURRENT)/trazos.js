class TrazosFondo {

    constructor(x,y,obra,tinte,scale){
        this.x = x;
        this.y = y;
        this.imagen = obra;
        this.color = tinte;
        this.scale = scale
        this.velocidad = 20;

    }

    dibujar() {
        push();
            tint(this.color);
            translate(this.x,this.y);
            scale(this.scale);
            image(this.imagen,0,0);
        pop();
    }

}

class TrazosDer{

    constructor(x, y, obra, escala){
        this.x = x;
        this.y = y;
        this.img = obra;
        this.escala = escala;

        //para las interacciones
        this.velocidad = 20;

    }

    dibujar(){
        push();
            translate(this.x,this.y);
            scale(this.scale);
            image(this.img,0,0);
        pop();
    }

//-------------------------INTERACCIONES----------------------------
    moverDerecha(){
        this.x += this.velocidad;
        if (this.x > width) {
          this.x = -600; // reinicia fuera de pantalla a la izquierda
        }
    }
    
    moverArriba(){
        this.y += this.velocidad;
        if(this.y > height){
        this.y = -100;
        }
    }
}

class TrazosIzq{

    constructor(x, y, obra, escala){
        this.x = x;
        this.y = y;
        this.img = obra;
        this.escala = escala;
        this.velocidad = 20;

    }

    dibujar(){
        push();
            translate(this.x,this.y);
            scale(this.scale);
            image(this.img,0,0);
        pop();
    }

//-------------------------INTERACCIONES----------------------------

    moverIzquierda(){
        this.x -= this.velocidad;
        if (this.x < 0) {
          this.x = windowWidth + 40;
        }
    }


}

class TrazosCent{

    constructor(x, y, obra, tamaño){
        this.x = x;
        this.y = y;
        this.img = obra;
        this.tam = tamaño;
        this.ang = frameCount * 0.01;
    }

    dibujar(){
        push();
            translate(this.x,this.y);
            scale(this.scale);
            image(this.img,0,0);
        pop();
    }

//-------------------------INTERACCIONES----------------------------
    cambiarTamaño(tamNuevo){
        this.tam = tamNuevo;
    }

    rotar(){
        push();
        rotate(this.ang);
        pop();
    }

}
