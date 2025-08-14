self.onmessage = function(e) {
  console.log('Worker: Mensaje recibido. Simulando análisis de imagen...');

  setTimeout(() => {
    // Definimos las dimensiones de la imagen (ajusta estos valores si tus imágenes son de otro tamaño)
    const imageWidth = 800; 
    const imageHeight = 600;

    // Definimos los rangos para el ancho y alto del recuadro
    const minSquareWidth = 100;
    const maxSquareWidth = 200;
    const minSquareHeight = 75;
    const maxSquareHeight = 150;
    
    // Función para generar un número aleatorio dentro de un rango
    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generamos las dimensiones aleatorias del recuadro
    const randomWidth = getRandomNumber(minSquareWidth, maxSquareWidth);
    const randomHeight = getRandomNumber(minSquareHeight, maxSquareHeight);

    // 🟢 Generamos las coordenadas 'x' e 'y' ajustadas
    // El máximo para 'x' es el ancho de la imagen menos el ancho del recuadro.
    const randomX = getRandomNumber(0, imageWidth - randomWidth);
    // El máximo para 'y' es la altura de la imagen menos la altura del recuadro.
    const randomY = getRandomNumber(0, imageHeight - randomHeight);

    const parasiteCoordinates = {
      x: randomX,
      y: randomY,
      width: randomWidth,
      height: randomHeight,
    };
    
    console.log('Worker: Análisis completo. Devolviendo coordenadas al hilo principal.');
    self.postMessage(parasiteCoordinates);
  }, 3000);
};