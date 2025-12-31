import { FeatureCollection, Geometry } from "geojson";

export interface VenezuelaProperties {
  ESTADO: string;
  COD_ESTADO: string;
}

export interface ParGeoMapProps {
  geometry: FeatureCollection<Geometry, VenezuelaProperties> | null;
}