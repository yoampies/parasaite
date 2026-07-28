import { db, PendingSync } from '../db/localDB';

const MAX_RETRIES = 5;
const BATCH_SIZE = 5;
const API_ENDPOINT = import.meta.env.VITE_API_SYNC_URL || '/api/sync';

/**
 * Procesa un registro pendiente individual enviando los datos y blobs
 */
const uploadSingleDiagnosis = async (pendingItem: PendingSync): Promise<boolean> => {
  // Aseguramos que el ID exista antes de operar
  if (pendingItem.id === undefined || pendingItem.diagnosisId === undefined) {
    return false;
  }

  try {
    // 1. Recuperar el diagnóstico local
    const diagnosis = await db.diagnoses.get(pendingItem.diagnosisId);

    // Si el diagnóstico ya no existe localmente, se descarta el ítem de la cola
    if (!diagnosis || diagnosis.id === undefined) {
      await db.pendingSyncs.delete(pendingItem.id);
      return true;
    }

    // 2. Recuperar los frames/imágenes vinculados a este diagnóstico
    const frames = await db.detectionFrames
      .where('diagnosisId')
      .equals(pendingItem.diagnosisId)
      .toArray();

    // 3. Construir el Payload mediante FormData
    const formData = new FormData();
    formData.append('diagnosis', JSON.stringify(diagnosis));

    frames.forEach((frame, index) => {
      if (frame.imageBlob) {
        // Usamos una propiedad alternativa o genérica si 'fileName' no está en la interfaz
        const fileName = (frame as any).fileName || `frame_${index}.jpg`;
        formData.append('images', frame.imageBlob, fileName);
      }
    });

    // 4. Enviar a la API
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 5. Actualizar estado local al confirmar éxito (usando diagnosis.id validado)
    await db.diagnoses.update(diagnosis.id, { isSynced: true });
    await db.pendingSyncs.delete(pendingItem.id);

    return true;
  } catch (error) {
    console.error(`Error sincronizando diagnóstico ${pendingItem.diagnosisId}:`, error);

    // Manejo de reintentos
    const newRetryCount = (pendingItem.retryCount || 0) + 1;
    const isFailed = newRetryCount >= MAX_RETRIES;

    // Actualizamos el registro manejando status de forma segura (cast a any si no está en la interfaz)
    await db.pendingSyncs.update(pendingItem.id, {
      retryCount: newRetryCount,
      status: isFailed ? 'FAILED' : 'PENDING',
    } as any);

    return false;
  }
};

/**
 * Procesa la cola completa de elementos pendientes por lotes (chunks)
 */
export const processSyncQueue = async (): Promise<void> => {
  if (!navigator.onLine) return;

  const pendingItems = await db.pendingSyncs.toArray();
  if (pendingItems.length === 0) return;

  // Filtrar ítems fallidos y ordenar por menor reintento
  const queue = pendingItems
    .filter((item) => (item as any).status !== 'FAILED')
    .sort((a, b) => (a.retryCount || 0) - (b.retryCount || 0));

  // Procesar por lotes (BATCH_SIZE)
  for (let i = 0; i < queue.length; i += BATCH_SIZE) {
    const chunk = queue.slice(i, i + BATCH_SIZE);
    const uploadPromises = chunk.map((item) => uploadSingleDiagnosis(item));

    await Promise.allSettled(uploadPromises);
  }
};
