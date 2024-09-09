import type { LngLat } from "src/declarations/geospatial"

type Offset = {
  meters: number
  degree: number
}

const EARTH_RADIUS = 6378137

export const offsetLngLat = (coords: LngLat, offset: Offset): LngLat => {
  const { lng, lat } = coords;
  const { meters, degree } = offset;

  // Convert degrees to radians
  const degreeRad = (degree * Math.PI) / 180;

  // Calculate the new latitude
  const deltaLat = (meters * Math.cos(degreeRad)) / EARTH_RADIUS;
  const newLat = lat + (deltaLat * 180) / Math.PI;

  // Calculate the new longitude
  const deltaLng = (meters * Math.sin(degreeRad)) / (EARTH_RADIUS * Math.cos((lat * Math.PI) / 180));
  const newLng = lng + (deltaLng * 180) / Math.PI;

  return { lng: newLng, lat: newLat };
}
