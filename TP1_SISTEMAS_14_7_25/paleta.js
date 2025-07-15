class Paleta {

    constructor(obra){

        this.imagen = loadImage(obra);

    }

    darUnColor(){
        let x = int(random (this.imagen.width));
        let y = int(random (this.imagen.heigth));
        return this.imagen.get(x , y);
    }
}