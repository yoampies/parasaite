import { ReactNode, Dispatch, SetStateAction, MutableRefObject } from 'react';
import * as THREE from 'three';

export interface IDetectedParasite {
  label: string;
  value: number;
}

export interface IAnalysis {
  id: number | string;
  date: string;
  content: string;
  imgURL: string;
  detectedParasites: IDetectedParasite[];
  fileName?: string;
}

export interface IParasite {
  id: number;
  name: string;
  description: string;
  imgURL: string;
}

export interface IParasiteStage {
  title: string;
  description: string;
  imgUrl: string;
}

export interface IParasiteSection {
  title: string;
  text?: string;
  imgUrl?: string;
  stages?: IParasiteStage[];
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

export interface IMapData {
  id: string;
  detections: number;
}

export interface IMeshInfo {
  title: string;
  description: string;
}

export interface IModelDetails {
  [key: string]: IMeshInfo;
  DEFAULT: IMeshInfo;
  XRAY_DETAILS: IMeshInfo;
}

export interface IChartData {
  label: string;
  value: number;
}

export interface IDashboardData {
  summary: {
    parasitesDetected: {
      count: number;
      change: string;
    };
    parasitesChart: IChartData[];
  };
  epidemiology: {
    ages: IChartData[];
    sex: IChartData[];
    race: IChartData[];
    comorbidities: IChartData[];
    geographicDistribution: IChartData[];
    otherFactors: IChartData[];
  };
}

export interface ButtonFilterProps {
  title: string;
  options?: string[];
  onSelect: (option: string) => void;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarFilterProps {
  title: string;
  onDateChange?: (range: DateRange) => void;
}

export interface CardProps {
  title?: string;
  content?: string;
  imgURL?: string;
  children?: ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
}

export interface ConfidenceLvlFilterProps {
  title: string;
  onRangeChange?: (range: number[]) => void;
  initialRange?: number[];
}

export interface ErrorProps {
  title?: string;
  message?: string;
  linkText?: string;
  linkTo?: string;
}

export interface MaterialRefData {
  originalColor: THREE.Color;
  originalOpacity: number;
  overrideColor?: THREE.Color | null;
}

export interface DynamicModelProps {
  modelPath: string;
  rotation: [number, number, number];
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  activePart: string | null;
  setActivePart: Dispatch<SetStateAction<string | null>>;
  isXRayEnabled: boolean;
  setFocusPoint: Dispatch<SetStateAction<[number, number, number] | null>>;
}

export interface ModelProps extends DynamicModelProps {
  focusPoint: [number, number, number] | null;
  yOffset: number;
}

export interface ExpandedModelCardProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  modelPath: string;
  rotation: [number, number, number];
}

export interface HistoryCardProps {
  title: string;
  content?: string;
  imgURL?: string;
  onClick?: () => void;
}

export interface HomeCardProps {
  title?: string;
  children?: ReactNode;
}

export interface HorizontalBarChartProps {
  data: IChartData[];
}

export interface ImageUploaderProps {
  instruction: string;
  message?: string;
  typesOfFiles?: string;
  selectedFileName?: string | null;
  onFileSelect: (file: File) => void;
}

export interface ModelCanvasProps {
  modelPath: string;
  rotation: [number, number, number];
  scrollPositionRef: MutableRefObject<number>;
  setIsExpanded: (expanded: boolean) => void;
  setExpandedModelPath: (path: string) => void;
}

export interface RegularCardProps {
  title: string;
  content?: string;
  imgURL?: string;
}

export interface ScannerCardProps {
  imgURL?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export interface SearchProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export interface SectionRenderingProps {
  sections: IParasiteSection[];
  parasiteName: string;
  scrollPositionRef: MutableRefObject<number>;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  setExpandedModelPath: (path: string) => void;
  parasiteRotation: [number, number, number];
}

export interface SelectionFilterProps {
  title: string;
  options: string[];
  initialSelected?: string[];
  onSelectionChange?: (selected: string[]) => void;
}

export interface TableProps {
  parasites: IDetectedParasite[];
}

export type WorkerMessageType = 'INIT_CANVAS' | 'PROCESS_IMAGE';

export interface WorkerInitMessage {
  type: 'INIT_CANVAS';
  canvas: OffscreenCanvas;
}

export interface WorkerProcessMessage {
  type: 'PROCESS_IMAGE';
  imageWidth: number;
  imageHeight: number;
  detectedParasites: IDetectedParasite[];
}

export type WorkerMessage = WorkerInitMessage | WorkerProcessMessage;

export interface FilterConfig {
  component: React.ComponentType<any>;
  title: string;
  options?: string[];
  startingDate?: number;
  endingDate?: number;
}

export interface EpidemiologicalCard {
  title: string;
  key: keyof IDashboardData['epidemiology'];
}

export interface FeedbackOption {
  id: string;
  label: string;
}

export interface IBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  detectedParasites: IDetectedParasite[];
}
