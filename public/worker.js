// Worker.js
self.onmessage = function(e) {
  console.log('Worker: Mensaje recibido. Verificando resultados...');
  
  // Destructuramos los datos para obtener tanto la información de la imagen como los parásitos ya detectados.
  const { imageWidth, imageHeight, detectedParasites } = e.data;

  setTimeout(() => {
    // 🚨 Nueva lógica: Si hay parásitos, genera un cuadro delimitador para cada uno
    if (detectedParasites && detectedParasites.length > 0) {
      console.log('Worker: Se encontraron parásitos. Generando cuadros delimitadores.');

      const minSquareWidth = 100;
      const maxSquareWidth = 200;
      const minSquareHeight = 75;
      const maxSquareHeight = 150;
      
      function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      // 🟢 Mapeamos los parásitos existentes para crear un array con la estructura completa de detección
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

      self.postMessage(analysisResults);
    } else {
      console.log('Worker: No se encontraron parásitos. Devolviendo un array vacío.');
      self.postMessage([]); // Devuelve un array vacío para indicar que no hay detecciones
    }
  }, 3000);
};