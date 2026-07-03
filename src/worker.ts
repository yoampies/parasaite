// src/worker.ts
import { InferenceSession, Tensor } from 'onnxruntime-web';

const ctxSelf = self as unknown as Worker;

let session: InferenceSession | null = null;

// Iniciar sesión cargando modelo desde public/ml_model
async function initModel() {
  try {
    if (!session) {
      console.log('Worker: Cargando model.onnx...');
      session = await InferenceSession.create('/ml_model/model.onnx', {
        executionProviders: ['wasm'],
      });
      console.log('Worker: model.onnx cargado con éxito.');
    }
  } catch (error) {
    console.error('Worker: Error al inicializar el modelo ONNX:', error);
  }
}

// Iniciar carga del modelo al instanciar el Worker
initModel();

ctxSelf.onmessage = async (e: MessageEvent<any>) => {
  const msg = e.data;

  // Manejo de inicialización de canvas
  if (msg.type === 'INIT_CANVAS') {
    console.log('Worker: Comando INIT_CANVAS recibido.');
    return;
  }

  if (msg.type === 'PROCESS_IMAGE') {
    // Si el modelo aún no ha cargado, esperamos o cancelamos para evitar romper el hilo
    if (!session) {
      console.warn('Worker: El modelo ONNX aún no está listo.');
      return;
    }

    const { imageBitmap } = msg;
    if (!imageBitmap) return;

    const targetSize = 640;

    // 1. Crear un OffscreenCanvas interno temporal para redimensionar el frame a 640x640
    const resizeCanvas = new OffscreenCanvas(targetSize, targetSize);
    const ctx = resizeCanvas.getContext('2d');

    if (!ctx) {
      console.error('Worker: No se pudo obtener el contexto 2D para el redimensionamiento.');
      return;
    }

    // Dibujar forzando el estiramiento/redimensionamiento directo a 640x640
    ctx.drawImage(imageBitmap, 0, 0, targetSize, targetSize);

    // Extraer los bytes de los píxeles (RGBA)
    const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
    const { data } = imageData; // Array plano de tamaño 640 * 640 * 4

    // 2. Matriz de normalización: YOLOv8 espera un Float32Array planar CHW (Canales, Altura, Anchura)
    // El orden esperado es: todos los Rojos, luego todos los Verdes, luego todos los Azules.
    // Además, se normalizan dividiendo los píxeles [0, 255] entre 255.0 para dejarlos en rango [0.0, 1.0].
    const float32Buffer = new Float32Array(3 * targetSize * targetSize);

    const imageSize = targetSize * targetSize;
    for (let i = 0; i < imageSize; i++) {
      const r = data[i * 4] / 255.0; // Canal R
      const g = data[i * 4 + 1] / 255.0; // Canal G
      const b = data[i * 4 + 2] / 255.0; // Canal B

      // Formato Planar (CHW):
      float32Buffer[i] = r; // Bloque de Rojos
      float32Buffer[imageSize + i] = g; // Bloque de Verdes
      float32Buffer[2 * imageSize + i] = b; // Bloque de Azules
    }

    // 3. Empaquetar en el Tensor de ONNX Runtime
    // YOLOv8 espera un tensor con dimensiones: [1, 3, 640, 640]
    const inputTensor = new Tensor('float32', float32Buffer, [1, 3, targetSize, targetSize]);

    try {
      console.log('Worker: Ejecutando inferencia real...');

      const outputNames = session.outputNames;
      const feeds: Record<string, Tensor> = {};
      feeds[session.inputNames[0]] = inputTensor;

      const resultsSession = await session.run(feeds);
      const outputTensor = resultsSession[outputNames[0]];

      const outputData = outputTensor.data as Float32Array; // Array plano de floats
      const numChannels = outputTensor.dims[1]; // 10 propiedades (4 cajas + 6 clases)
      const numCandidates = outputTensor.dims[2]; // 8400 candidatos de cajas

      const CONFIDENCE_THRESHOLD = 0.3; // Filtro de confianza mínimo clínico
      const IOU_THRESHOLD = 0.45; // Límite de superposición para NMS

      interface CandidateDetection {
        box: [number, number, number, number]; // [x_min, y_min, x_max, y_max]
        confidence: number;
        classId: number;
      }

      const candidates: CandidateDetection[] = [];

      // Recorrer los 8400 candidatos (Lectura transpuesta horizontal)
      for (let c = 0; c < numCandidates; c++) {
        // 1. Extraer los scores de las clases para este candidato
        let maxScore = 0;
        let classId = -1;

        // Las clases empiezan desde el índice 4 hasta el numChannels (4 + 6 = 10)
        for (let cl = 4; cl < numChannels; cl++) {
          const score = outputData[cl * numCandidates + c];
          if (score > maxScore) {
            maxScore = score;
            classId = cl - 4; // Ajustar índice para que coincida con nuestro id de parásito (0 a 5)
          }
        }

        // Si la confianza supera nuestro umbral base, procesamos sus coordenadas geográficas
        if (maxScore > CONFIDENCE_THRESHOLD) {
          // Extraer formato nativo YOLOv8: [x_center, y_center, width, height]
          const cx = outputData[0 * numCandidates + c];
          const cy = outputData[1 * numCandidates + c];
          const w = outputData[2 * numCandidates + c];
          const h = outputData[3 * numCandidates + c];

          // Convertir matemáticamente a Coordenadas Relativas de Esquina: [x_min, y_min, x_max, y_max]
          // Esto mapea los extremos del parásito en un rango de [0.0, 1.0] relativo al lienzo
          const x_min = Math.max(0, cx - w / 2);
          const y_min = Math.max(0, cy - h / 2);
          const x_max = Math.min(640, cx + w / 2);
          const y_max = Math.min(640, cy + h / 2);

          candidates.push({
            box: [x_min, y_min, x_max, y_max],
            confidence: maxScore,
            classId: classId,
          });
        }
      }

      // 2. Aplicar el filtro de Supresión No Máxima (NMS) local para eliminar duplicados
      const finalDetections: CandidateDetection[] = [];

      // Ordenar candidatos por nivel de confianza descendente
      candidates.sort((a, b) => b.confidence - a.confidence);

      while (candidates.length > 0) {
        const best = candidates.shift()!;
        finalDetections.push(best);

        // Filtrar y eliminar todas las cajas remanentes que se superpongan demasiado con la mejor
        for (let i = candidates.length - 1; i >= 0; i--) {
          if (calculateIoU(best.box, candidates[i].box) > IOU_THRESHOLD) {
            candidates.splice(i, 1); // Descartar duplicado redundante
          }
        }
      }

      // Liberar memoria del fotograma gráfico transferido
      imageBitmap.close();

      console.log(
        `Worker: Inferencia y decodificación terminadas. Hallazgos reales: ${finalDetections.length}`
      );

      // Enviar las bounding boxes limpias y parseadas de vuelta a la UI del microscopio
      ctxSelf.postMessage({
        type: 'INFERENCE_SUCCESS',
        results: finalDetections,
      });
    } catch (inferenceError) {
      console.error('Worker: Error durante la inferencia ONNX:', inferenceError);
    }
  }
};

// Función auxiliar para calcular la Intersección sobre Unión (IoU) entre dos cajas
function calculateIoU(
  boxA: [number, number, number, number],
  boxB: [number, number, number, number]
): number {
  const xA = Math.max(boxA[0], boxB[0]);
  const yA = Math.max(boxA[1], boxB[1]);
  const xB = Math.min(boxA[2], boxB[2]);
  const yB = Math.min(boxA[3], boxB[3]);

  const intersectionArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);

  const boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1]);
  const boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1]);

  const unionArea = boxAArea + boxBArea - intersectionArea;

  return unionArea === 0 ? 0 : intersectionArea / unionArea;
}
