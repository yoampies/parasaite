import { db, PendingSync } from '../db/localDB';

const MAX_RETRIES = 5;
const BATCH_SIZE = 5;
const API_ENDPOINT = import.meta.env.VITE_API_SYNC_URL || '/api/sync';

const uploadSingleDiagnosis = async (pendingItem: PendingSync): Promise<boolean> => {
  if (pendingItem.id === undefined || pendingItem.diagnosisId === undefined) {
    return false;
  }

  try {
    const diagnosis = await db.diagnoses.get(pendingItem.diagnosisId);

    if (!diagnosis || diagnosis.id === undefined) {
      await db.pendingSyncs.delete(pendingItem.id);
      return true;
    }

    const frames = await db.detectionFrames
      .where('diagnosisId')
      .equals(pendingItem.diagnosisId)
      .toArray();

    const formData = new FormData();
    formData.append('diagnosis', JSON.stringify(diagnosis));

    if (pendingItem.action) {
      formData.append('action', pendingItem.action);
    }
    if (pendingItem.payload) {
      formData.append('payload', JSON.stringify(pendingItem.payload));
    }

    frames.forEach((frame, index) => {
      if (frame.imageBlob) {
        const fileName = frame.fileName || `frame_${index}.jpg`;
        formData.append('images', frame.imageBlob, fileName);
      }
    });

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await db.transaction('rw', [db.diagnoses, db.pendingSyncs], async () => {
      await db.diagnoses.update(diagnosis.id!, { isSynced: true });
      await db.pendingSyncs.delete(pendingItem.id!);
    });

    return true;
  } catch (error) {
    console.error(`Error sincronizando diagnóstico ${pendingItem.diagnosisId}:`, error);

    const newRetryCount = (pendingItem.retryCount || 0) + 1;
    const isFailed = newRetryCount >= MAX_RETRIES;

    await db.pendingSyncs.update(pendingItem.id, {
      retryCount: newRetryCount,
      status: isFailed ? 'FAILED' : 'PENDING',
    });

    return false;
  }
};

export const processSyncQueue = async (): Promise<void> => {
  if (!navigator.onLine) return;

  const pendingItems = await db.pendingSyncs.toArray();
  if (pendingItems.length === 0) return;

  const queue = pendingItems
    .filter((item) => item.status !== 'FAILED')
    .sort((a, b) => (a.retryCount || 0) - (b.retryCount || 0));

  for (let i = 0; i < queue.length; i += BATCH_SIZE) {
    const chunk = queue.slice(i, i + BATCH_SIZE);
    const uploadPromises = chunk.map((item) => uploadSingleDiagnosis(item));

    await Promise.allSettled(uploadPromises);
  }
};
