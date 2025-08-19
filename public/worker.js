// Worker.js
self.onmessage = async function(e) {
  console.log('Worker: Mensaje recibido. Simulando análisis y dibujo...');
  
  const { imageBitmap, imageWidth, imageHeight, detectedParasites } = e.data;

  setTimeout(() => {
    // Verificar si hay parásitos detectados
    if (detectedParasites && detectedParasites.length > 0) {
      console.log('Worker: Se encontraron parásitos. Generando y dibujando cuadros delimitadores.');

      const minSquareWidth = 100;
      const maxSquareWidth = 200;
      const minSquareHeight = 75;
      const maxSquareHeight = 150;
      
      function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      
      // Mapear los parásitos existentes para crear un array con la estructura completa de detección
      const analysisResults = detectedParasites.map(parasite => {
        const randomWidth = getRandomNumber(minSquareWidth, maxSquareWidth);
        const randomHeight = getRandomNumber(minSquareHeight, maxSquareHeight);

        const randomX = getRandomNumber(0, imageWidth - randomWidth);
        const randomY = getRandomNumber(0, imageHeight - randomHeight);

        return {
          x: randomX,
          y: randomY,
          width: randomWidth,
          height: randomHeight,
          detectedParasites: [parasite], // Cada objeto de detección contiene su parásito asociado
        };
      });

      console.log('Worker: Análisis y dibujo completos. Devolviendo resultados al hilo principal.');
      self.postMessage({
        results: analysisResults,
      });
    } else {
      console.log('Worker: No se encontraron parásitos. Devolviendo array vacío.');
      self.postMessage({
        results: [],
      });
    }
  }, 3000);
};