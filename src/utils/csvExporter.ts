// src/utils/csvExporter.ts
import { db } from '../db/localDB';

export const exportDiagnosesToCSV = async (): Promise<void> => {
  try {
    const diagnoses = await db.diagnoses.toArray();

    if (diagnoses.length === 0) {
      alert('No hay diagnósticos registrados para exportar.');
      return;
    }

    const headers = ['ID Local', 'Paciente', 'Fecha', 'Parásito', 'Confianza (%)'];

    const rows = diagnoses.map((d) => {
      const id = d.id ?? '';
      const patientId = `"${(d.patientLocalId ?? '').replace(/"/g, '""')}"`;
      const date = `"${new Date(d.date).toLocaleString().replace(/"/g, '""')}"`;
      const parasite = `"${(d.parasiteFound ?? '').replace(/,/g, '')}"`;
      const confidence = (d.confidence * 100).toFixed(2);

      return [id, patientId, date, parasite, confidence].join(',');
    });

    const BOM = '\uFEFF';
    const csvContent = BOM + [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_parasaite_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al exportar diagnósticos a CSV:', error);
    alert('Ocurrió un error al generar el archivo CSV.');
  }
};
