export interface VenezuelaProperties {
  ESTADO: string;
  COD_ESTADO: string;
}

export interface ParGeoMapProps {
  // Usamos 'any' para evitar el mismatch entre FeatureCollection<GeoJsonProperties> y VenezuelaProperties
  geometry: any;
}
