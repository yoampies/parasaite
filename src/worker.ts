import { IBoundingBox, WorkerPayload } from './types';

// Tipamos el contexto global del Worker
const ctx = self as unknown as Worker;

ctx.onmessage = async (e: MessageEvent<WorkerPayload>) => {
  console.log('Worker: Procesando muestra microscópica...');

  const { imageWidth, imageHeight, detectedParasites } = e.data;

  // Simulamos la latencia del modelo de IA (3 segundos)
  setTimeout(() => {
    if (detectedParasites && detectedParasites.length > 0) {
      // Parámetros de diseño para las Bounding Boxes
      const minBoxWidth = 100;
      const maxBoxWidth = 200;
      const minBoxHeight = 75;
      const maxBoxHeight = 150;

      const getRandomNumber = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      // Generamos las coordenadas espaciales para cada parásito
      const analysisResults: IBoundingBox[] = detectedParasites.map((parasite) => {
        const randomWidth = getRandomNumber(minBoxWidth, maxBoxWidth);
        const randomHeight = getRandomNumber(minBoxHeight, maxBoxHeight);

        // Aseguramos que el cuadro no se salga de los límites de la imagen
        const randomX = getRandomNumber(0, imageWidth - randomWidth);
        const randomY = getRandomNumber(0, imageHeight - randomHeight);

        return {
          x: randomX,
          y: randomY,
          width: randomWidth,
          height: randomHeight,
          detectedParasites: [parasite],
        };
      });

      console.log('Worker: Segmentación completada. Enviando coordenadas al UI Thread.');
      ctx.postMessage({ results: analysisResults });
    } else {
      ctx.postMessage({ results: [] });
    }
  }, 3000);
};
