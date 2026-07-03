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

      // Ejecutar la sesión de inferencia localmente
      const outputNames = session.outputNames;
      const feeds: Record<string, Tensor> = {};
      feeds[session.inputNames[0]] = inputTensor;

      const resultsSession = await session.run(feeds);
      const outputTensor = resultsSession[outputNames[0]];

      console.log('Worker: Inferencia completada con éxito. Tensor de salida generado.');

      imageBitmap.close();

      // De momento enviamos un flag de completado para validar que la tubería matemática no se rompa
      ctxSelf.postMessage({
        type: 'INFERENCE_DONE',
        rawOutput: { data: outputTensor.data, dims: outputTensor.dims },
      });
    } catch (inferenceError) {
      console.error('Worker: Error durante la inferencia ONNX:', inferenceError);
    }
  }
};
