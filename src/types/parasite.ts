// Información básica para listas y librería
export interface IParasite {
  id: number;
  name: string;
  description: string;
  imgURL: string;
}

// Estructura para las secciones de detalles (Overview, Morfología, Ciclo de Vida)
export interface IParasiteSection {
  title: string;
  text?: string;
  imgUrl?: string;
  stages?: IParasiteStage[]; // Específico para Ciclo de Vida
}

export interface IParasiteStage {
  title: string;
  description: string;
  imgUrl: string;
}

export interface IParasiteTabs {
  overview: { sections: IParasiteSection[] };
  morphology: { sections: IParasiteSection[] };
  lifeCycle: { sections: IParasiteSection[] };
}

export interface IParasiteDetail {
  title: string;
  subtitle: string;
  tabs: IParasiteTabs;
}

// Detalles de las mallas 3D para la interactividad en Three.js
export interface IMeshInfo {
  title: string;
  description: string;
}

export interface IModelMeshDetails {
  [meshName: string]: IMeshInfo;
  DEFAULT: IMeshInfo;
  XRAY_DETAILS: IMeshInfo;
}

export type ParasiteModelRegistry = Record<string, IModelMeshDetails>;