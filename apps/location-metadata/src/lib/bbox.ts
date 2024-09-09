import type { LngLat } from "src/declarations/geospatial";

import { offsetLngLat } from "./offset-lnglat";

export const createBBox = (center: LngLat, sizeMeters: number): [LngLat, LngLat] => {
  // Offset by half the size in each direction
  const halfSize = sizeMeters / 2;

  // Calculate the southwest corner (bottom-left)
  const southwest = offsetLngLat(center, { meters: halfSize, degree: 225 }); // 225 degrees for southwest

  // Calculate the northeast corner (top-right)
  const northeast = offsetLngLat(center, { meters: halfSize, degree: 45 }); // 45 degrees for northeast

  return [southwest, northeast];
};
