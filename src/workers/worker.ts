// src/workers/worker
import { InferenceSession, Tensor, env } from 'onnxruntime-web';

const ctxSelf = self as unknown as Worker;

let session: InferenceSession | null = null;
let isInitializing = false;

// Configuración global de ORT para evitar errores de MIME/CORS
// Esto debe hacerse antes de llamar a InferenceSession.create
env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';

async function initModel() {
  if (session || isInitializing) return;

  isInitializing = true;
  try {
    console.log('Worker: Cargando model.onnx...');

    // 1. Descargar el modelo
    const response = await fetch('/ml_model/model.onnx');
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // 2. Inicializar la sesión solo con las opciones permitidas
    session = await InferenceSession.create(uint8Array, {
      executionProviders: ['wasm'],
    });

    console.log('Worker: model.onnx cargado con éxito.');
  } catch (error) {
    console.error('Worker: Error al inicializar el modelo ONNX:', error);
  } finally {
    isInitializing = false;
  }
}

// Iniciar carga del modelo al instanciar el Worker
initModel();

ctxSelf.onmessage = async (e: MessageEvent<any>) => {
  const msg = e.data;

  if (msg.type === 'INIT_CANVAS') {
    console.log('Worker: Comando INIT_CANVAS recibido.');
    return;
  }

  if (msg.type === 'PROCESS_IMAGE') {
    console.log('Worker: Mensaje recibido con tipo:', e.data.type);
    if (!session) {
      console.warn('Worker: El modelo ONNX aún no está listo.');
      await initModel();
      if (!session) {
        console.warn('Worker: El modelo ONNX aún no está listo. Estado de init:', isInitializing);
        return;
      }
    }

    const { imageBitmap } = msg;
    if (!imageBitmap) return;

    const originalWidth = imageBitmap.width;
    const originalHeight = imageBitmap.height;

    const targetSize = 640;
    const resizeCanvas = new OffscreenCanvas(targetSize, targetSize);
    const ctx = resizeCanvas.getContext('2d');

    if (!ctx) {
      console.error('Worker: No se pudo obtener el contexto 2D.');
      return;
    }

    ctx.drawImage(imageBitmap, 0, 0, targetSize, targetSize);
    const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
    const { data } = imageData;

    const float32Buffer = new Float32Array(3 * targetSize * targetSize);
    const imageSize = targetSize * targetSize;
    for (let i = 0; i < imageSize; i++) {
      float32Buffer[i] = data[i * 4] / 255.0;
      float32Buffer[imageSize + i] = data[i * 4 + 1] / 255.0;
      float32Buffer[2 * imageSize + i] = data[i * 4 + 2] / 255.0;
    }

    const inputTensor = new Tensor('float32', float32Buffer, [1, 3, targetSize, targetSize]);

    try {
      const outputNames = session.outputNames;
      const feeds: Record<string, Tensor> = {};
      feeds[session.inputNames[0]] = inputTensor;

      const resultsSession = await session.run(feeds);
      console.log('Worker: Inferencia ejecutada correctamente.');
      const outputTensor = resultsSession[outputNames[0]];

      const outputData = outputTensor.data as Float32Array;
      const numChannels = outputTensor.dims[1];
      const numCandidates = outputTensor.dims[2];

      const CONFIDENCE_THRESHOLD = 0.3;
      const IOU_THRESHOLD = 0.45;

      interface CandidateDetection {
        box: [number, number, number, number]; // [x_min_px, y_min_px, width_px, height_px]
        confidence: number;
        classId: number;
      }

      const candidates: CandidateDetection[] = [];

      // Factores de escala para proyectar de 640x640 a la resolución real de la imagen original
      const scaleX = originalWidth / targetSize;
      const scaleY = originalHeight / targetSize;

      for (let c = 0; c < numCandidates; c++) {
        let maxScore = 0;
        let classId = -1;

        for (let cl = 4; cl < numChannels; cl++) {
          const score = outputData[cl * numCandidates + c];
          if (score > maxScore) {
            maxScore = score;
            classId = cl - 4;
          }
        }

        if (maxScore > CONFIDENCE_THRESHOLD) {
          const cx = outputData[0 * numCandidates + c];
          const cy = outputData[1 * numCandidates + c];
          const w = outputData[2 * numCandidates + c];
          const h = outputData[3 * numCandidates + c];

          // Coordenadas superiores izquierdas en el espacio de 640x640
          const x_min = Math.max(0, cx - w / 2);
          const y_min = Math.max(0, cy - h / 2);

          // Escalar directamente a píxeles absolutos de la imagen original
          const realX = x_min * scaleX;
          const realY = y_min * scaleY;
          const realW = w * scaleX;
          const realH = h * scaleY;

          candidates.push({
            box: [realX, realY, realW, realH],
            confidence: maxScore,
            classId: classId,
          });
        }
      }

      const finalDetections: CandidateDetection[] = [];
      candidates.sort((a, b) => b.confidence - a.confidence);

      while (candidates.length > 0) {
        const best = candidates.shift()!;
        finalDetections.push(best);

        for (let i = candidates.length - 1; i >= 0; i--) {
          if (calculateIoU(best.box, candidates[i].box) > IOU_THRESHOLD) {
            candidates.splice(i, 1);
          }
        }
      }

      imageBitmap.close();

      ctxSelf.postMessage({
        type: 'INFERENCE_SUCCESS',
        results: finalDetections,
      });
      console.log('Worker: Inferencia finalizada. Número de detecciones:', finalDetections.length);
    } catch (inferenceError) {
      console.error('Worker: Error detallado durante la inferencia:', inferenceError);
    }
  }
};

/**
 * Calculo de la Intersección sobre Unión (IoU) para cajas en formato [x, y, w, h]
 */
function calculateIoU(
  boxA: [number, number, number, number],
  boxB: [number, number, number, number]
): number {
  const xA = Math.max(boxA[0], boxB[0]);
  const yA = Math.max(boxA[1], boxB[1]);
  const xB = Math.min(boxA[0] + boxA[2], boxB[0] + boxB[2]);
  const yB = Math.min(boxA[1] + boxA[3], boxB[1] + boxB[3]);

  const intersectionArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
  const boxAArea = boxA[2] * boxA[3];
  const boxBArea = boxB[2] * boxB[3];
  const unionArea = boxAArea + boxBArea - intersectionArea;

  return unionArea === 0 ? 0 : intersectionArea / unionArea;
}
