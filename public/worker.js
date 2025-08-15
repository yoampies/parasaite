// Worker.js
self.onmessage = function(e) {
  console.log('Worker: Mensaje recibido. Simulando análisis de imagen...');
  
  const { imageWidth, imageHeight } = e.data;

  setTimeout(() => {
    const minSquareWidth = 100;
    const maxSquareWidth = 200;
    const minSquareHeight = 75;
    const maxSquareHeight = 150;
    
    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const randomWidth = getRandomNumber(minSquareWidth, maxSquareWidth);
    const randomHeight = getRandomNumber(minSquareHeight, maxSquareHeight);

    const randomX = getRandomNumber(0, imageWidth - randomWidth);
    const randomY = getRandomNumber(0, imageHeight - randomHeight);

    // 🟢 Simulación de los parásitos detectados
    const simulatedParasites = [
        { label: 'Ascaris lumbricoides', value: getRandomNumber(80, 100) },
        { label: 'Trichuris trichiura', value: getRandomNumber(70, 90) },
    ];

    // 🟢 Devolvemos un objeto completo con todos los resultados del análisis
    const analysisResults = {
        x: randomX,
        y: randomY,
        width: randomWidth,
        height: randomHeight,
        detectedParasites: simulatedParasites,
    };
    
    console.log('Worker: Análisis completo. Devolviendo resultados al hilo principal.');
    self.postMessage(analysisResults);
  }, 3000);
};