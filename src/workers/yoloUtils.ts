// src/workers/yoloUtils.ts

export interface BoundingBoxCandidate {
  box: [number, number, number, number]; // [x1, y1, x2, y2]
  confidence: number;
  classId: number;
}

/**
 * Algoritmo de Intersection over Union (IoU)
 */
export function calculateIoU(box1: number[], box2: number[]): number {
  const [x1, y1, x2, y2] = box1;
  const [x3, y3, x4, y4] = box2;

  const interX1 = Math.max(x1, x3);
  const interY1 = Math.max(y1, y3);
  const interX2 = Math.min(x2, x4);
  const interY2 = Math.min(y2, y4);

  const interArea = Math.max(0, interX2 - interX1) * Math.max(0, interY2 - interY1);
  if (interArea === 0) return 0;

  const area1 = (x2 - x1) * (y2 - y1);
  const area2 = (x4 - x3) * (y4 - y3);

  return interArea / (area1 + area2 - interArea);
}

/**
 * Algoritmo Non-Maximum Suppression (NMS) para eliminar detecciones duplicadas
 */
export function applyNMS(
  boxes: BoundingBoxCandidate[],
  iouThreshold = 0.45,
  maxDetections = 20
): BoundingBoxCandidate[] {
  const sortedBoxes = [...boxes].sort((a, b) => b.confidence - a.confidence);
  const selected: BoundingBoxCandidate[] = [];
  const active = new Array(sortedBoxes.length).fill(true);

  for (let i = 0; i < sortedBoxes.length; i++) {
    if (!active[i]) continue;
    selected.push(sortedBoxes[i]);
    if (selected.length >= maxDetections) break;

    for (let j = i + 1; j < sortedBoxes.length; j++) {
      if (active[j] && calculateIoU(sortedBoxes[i].box, sortedBoxes[j].box) > iouThreshold) {
        active[j] = false;
      }
    }
  }
  return selected;
}
