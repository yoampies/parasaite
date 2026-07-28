import * as ort from 'onnxruntime-web';
import { applyNMS } from '../utils/yoloUtils';

ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';

let session: ort.InferenceSession | null = null;
let isProcessing = false;

function isMobile(): boolean {
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === 'INIT') {
    try {
      const modelPath = payload.modelPath || '/ml_model/model.onnx';

      const options: ort.InferenceSession.SessionOptions = {
        executionProviders: isMobile() ? ['wasm'] : ['webgl', 'wasm'],
        graphOptimizationLevel: 'all',
        enableCpuMemArena: true,
        enableMemPattern: true,
      };

      if (isMobile()) {
        options.executionMode = 'sequential';
        options.extra = {
          session: {
            intra_op_num_threads: navigator.hardwareConcurrency
              ? Math.min(navigator.hardwareConcurrency, 4)
              : 2,
          },
        };
      }

      session = await ort.InferenceSession.create(modelPath, options);
      self.postMessage({ type: 'READY' });
    } catch (error: any) {
      self.postMessage({ type: 'ERROR', payload: error.message });
    }
  }

  if (type === 'PREDICT') {
    if (isProcessing || !session) {
      return;
    }

    isProcessing = true;
    let inputTensor: ort.Tensor | null = null;

    try {
      const { floatArray, dims } = payload;
      inputTensor = new ort.Tensor('float32', new Float32Array(floatArray), dims);

      const feeds: Record<string, ort.Tensor> = {};
      feeds[session.inputNames[0]] = inputTensor;

      const results = await session.run(feeds);
      const outputName = session.outputNames[0];
      const outputTensor = results[outputName];
      const outputData = outputTensor.data as Float32Array;
      const shape = outputTensor.dims; // [1, num_channels, 8400]

      const candidateBoxes: any[] = [];

      if (shape.length >= 2) {
        const rows = shape[2]; // 8400
        const dimensions = shape[1]; // 4 (coordenadas) + N clases

        for (let i = 0; i < rows; i++) {
          let maxScore = 0;
          let classId = 0;

          for (let c = 4; c < dimensions; c++) {
            const score = outputData[c * rows + i];
            if (score > maxScore) {
              maxScore = score;
              classId = c - 4;
            }
          }

          if (maxScore > 0.35) {
            const xc = outputData[0 * rows + i];
            const yc = outputData[1 * rows + i];
            const w = outputData[2 * rows + i];
            const h = outputData[3 * rows + i];

            const x1 = (xc - w / 2) / 640;
            const y1 = (yc - h / 2) / 640;
            const x2 = (xc + w / 2) / 640;
            const y2 = (yc + h / 2) / 640;

            candidateBoxes.push({
              box: [Math.max(0, x1), Math.max(0, y1), Math.min(1, x2), Math.min(1, y2)],
              confidence: maxScore,
              classId: classId,
            });
          }
        }
      }

      // Aplicar NMS para eliminar cajas duplicadas
      const filteredDetections = applyNMS(candidateBoxes, 0.45);

      self.postMessage({
        type: 'RESULT',
        payload: filteredDetections,
      });
    } catch (error: any) {
      self.postMessage({ type: 'ERROR', payload: error.message });
    } finally {
      if (inputTensor && typeof inputTensor.dispose === 'function') {
        inputTensor.dispose();
      }
      isProcessing = false;
    }
  }
};

console.log('se corrio de nuevo');
