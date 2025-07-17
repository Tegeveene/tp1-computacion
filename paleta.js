class Paleta {
  constructor(imgPath) {
    this.colores = [];
    this.cargarColores();
  }

  cargarColores() {
    this.colores = [];
    for(let i=0; i<10; i++){
      this.colores.push(color(random(255), random(255), random(255)));
    }
  }

  darUnColor() {
    return random(this.colores);
  }

  cambiarPaletaAleatoria() {
    this.cargarColores();
    console.log("Paleta cambiada!");
  }
}
