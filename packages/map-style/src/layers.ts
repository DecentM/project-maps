import type { LayerSpecification } from 'maplibre-gl'

/**
 * We have to re-export the layers, because the order matters, and export * with
 * Object.values() reorders them alphabetically.
 */

import { background } from './layers/background'
import { park } from './layers/park'
import { park_outline } from './layers/park_outline'
import { landuse_residential } from './layers/landuse_residential'
import { landcover_wood } from './layers/landcover_wood'
import { landcover_grass } from './layers/landcover_grass'
import { landcover_ice } from './layers/landcover_ice'
import { landcover_wetland } from './layers/landcover_wetland'
import { landuse_pitch } from './layers/landuse_pitch'
import { landuse_track } from './layers/landuse_track'
import { landuse_cemetery } from './layers/landuse_cemetery'
import { landuse_hospital } from './layers/landuse_hospital'
import { landuse_school } from './layers/landuse_school'
import { waterway_tunnel } from './layers/waterway_tunnel'
import { waterway_river } from './layers/waterway_river'
import { waterway_other } from './layers/waterway_other'
import { water } from './layers/water'
import { landcover_sand } from './layers/landcover_sand'
import { aeroway_fill } from './layers/aeroway_fill'
import { aeroway_runway } from './layers/aeroway_runway'
import { aeroway_taxiway } from './layers/aeroway_taxiway'
import { tunnel_motorway_link_casing } from './layers/tunnel_motorway_link_casing'
import { tunnel_service_track_casing } from './layers/tunnel_service_track_casing'
import { tunnel_link_casing } from './layers/tunnel_link_casing'
import { tunnel_street_casing } from './layers/tunnel_street_casing'
import { tunnel_secondary_tertiary_casing } from './layers/tunnel_secondary_tertiary_casing'
import { tunnel_trunk_primary_casing } from './layers/tunnel_trunk_primary_casing'
import { tunnel_motorway_casing } from './layers/tunnel_motorway_casing'
import { tunnel_path_pedestrian } from './layers/tunnel_path_pedestrian'
import { tunnel_motorway_link } from './layers/tunnel_motorway_link'
import { tunnel_service_track } from './layers/tunnel_service_track'
import { tunnel_link } from './layers/tunnel_link'
import { tunnel_minor } from './layers/tunnel_minor'
import { tunnel_secondary_tertiary } from './layers/tunnel_secondary_tertiary'
import { tunnel_trunk_primary } from './layers/tunnel_trunk_primary'
import { tunnel_motorway } from './layers/tunnel_motorway'
import { tunnel_major_rail } from './layers/tunnel_major_rail'
import { tunnel_major_rail_hatching } from './layers/tunnel_major_rail_hatching'
import { tunnel_transit_rail } from './layers/tunnel_transit_rail'
import { tunnel_transit_rail_hatching } from './layers/tunnel_transit_rail_hatching'
import { road_area_pattern } from './layers/road_area_pattern'
import { road_motorway_link_casing } from './layers/road_motorway_link_casing'
import { road_service_track_casing } from './layers/road_service_track_casing'
import { road_link_casing } from './layers/road_link_casing'
import { road_minor_casing } from './layers/road_minor_casing'
import { road_secondary_tertiary_casing } from './layers/road_secondary_tertiary_casing'
import { road_trunk_primary_casing } from './layers/road_trunk_primary_casing'
import { road_motorway_casing } from './layers/road_motorway_casing'
import { road_path_pedestrian } from './layers/road_path_pedestrian'
import { road_motorway_link } from './layers/road_motorway_link'
import { road_service_track } from './layers/road_service_track'
import { road_link } from './layers/road_link'
import { road_minor } from './layers/road_minor'
import { road_secondary_tertiary } from './layers/road_secondary_tertiary'
import { road_trunk_primary } from './layers/road_trunk_primary'
import { road_motorway } from './layers/road_motorway'
import { road_major_rail } from './layers/road_major_rail'
import { road_major_rail_hatching } from './layers/road_major_rail_hatching'
import { road_transit_rail } from './layers/road_transit_rail'
import { road_transit_rail_hatching } from './layers/road_transit_rail_hatching'
import { road_one_way_arrow } from './layers/road_one_way_arrow'
import { road_one_way_arrow_opposite } from './layers/road_one_way_arrow_opposite'
import { bridge_motorway_link_casing } from './layers/bridge_motorway_link_casing'
import { bridge_service_track_casing } from './layers/bridge_service_track_casing'
import { bridge_link_casing } from './layers/bridge_link_casing'
import { bridge_street_casing } from './layers/bridge_street_casing'
import { bridge_path_pedestrian_casing } from './layers/bridge_path_pedestrian_casing'
import { bridge_secondary_tertiary_casing } from './layers/bridge_secondary_tertiary_casing'
import { bridge_trunk_primary_casing } from './layers/bridge_trunk_primary_casing'
import { bridge_motorway_casing } from './layers/bridge_motorway_casing'
import { bridge_path_pedestrian } from './layers/bridge_path_pedestrian'
import { bridge_motorway_link } from './layers/bridge_motorway_link'
import { bridge_service_track } from './layers/bridge_service_track'
import { bridge_link } from './layers/bridge_link'
import { bridge_street } from './layers/bridge_street'
import { bridge_secondary_tertiary } from './layers/bridge_secondary_tertiary'
import { bridge_trunk_primary } from './layers/bridge_trunk_primary'
import { bridge_motorway } from './layers/bridge_motorway'
import { bridge_major_rail } from './layers/bridge_major_rail'
import { bridge_major_rail_hatching } from './layers/bridge_major_rail_hatching'
import { bridge_transit_rail } from './layers/bridge_transit_rail'
import { bridge_transit_rail_hatching } from './layers/bridge_transit_rail_hatching'
import { building } from './layers/building'
import { building_3d } from './layers/building_3d'
import { boundary_3 } from './layers/boundary_3'
import { boundary_2_z0_4 } from './layers/boundary_2_z0_4'
import { boundary_2_z5_ } from './layers/boundary_2_z5_'
import { water_name_line } from './layers/water_name_line'
import { water_name_point } from './layers/water_name_point'
import { poi_transit } from './layers/poi_transit'
import { road_label } from './layers/road_label'
import { road_shield } from './layers/road_shield'
import { place_other } from './layers/place_other'
import { place_village } from './layers/place_village'
import { place_town } from './layers/place_town'
import { place_city } from './layers/place_city'
import { state } from './layers/state'
import { country_3 } from './layers/country_3'
import { country_2 } from './layers/country_2'
import { country_1 } from './layers/country_1'
import { continent } from './layers/continent'
import { data_z14 } from './layers/data_z14'
import { data_z15 } from './layers/data_z15'
import { data_z16 } from './layers/data_z16'
import { tints } from './layers/tints'

export const layers: LayerSpecification[] = [
  background,
  tints,
  {
    id: 'hills',
    type: 'hillshade',
    source: 'terrain',
    layout: { visibility: 'visible' },
    paint: { 'hillshade-shadow-color': '#473B24' },
  },
  park,
  park_outline,
  landuse_residential,
  landcover_wood,
  landcover_grass,
  landcover_ice,
  landcover_wetland,
  landuse_pitch,
  landuse_track,
  landuse_cemetery,
  landuse_hospital,
  landuse_school,
  waterway_tunnel,
  waterway_river,
  waterway_other,
  water,
  landcover_sand,
  aeroway_fill,
  aeroway_runway,
  aeroway_taxiway,
  tunnel_motorway_link_casing,
  tunnel_service_track_casing,
  tunnel_link_casing,
  tunnel_street_casing,
  tunnel_secondary_tertiary_casing,
  tunnel_trunk_primary_casing,
  tunnel_motorway_casing,
  tunnel_path_pedestrian,
  tunnel_motorway_link,
  tunnel_service_track,
  tunnel_link,
  tunnel_minor,
  tunnel_secondary_tertiary,
  tunnel_trunk_primary,
  tunnel_motorway,
  tunnel_major_rail,
  tunnel_major_rail_hatching,
  tunnel_transit_rail,
  tunnel_transit_rail_hatching,
  road_area_pattern,
  road_motorway_link_casing,
  road_service_track_casing,
  road_link_casing,
  road_minor_casing,
  road_secondary_tertiary_casing,
  road_trunk_primary_casing,
  road_motorway_casing,
  road_path_pedestrian,
  road_motorway_link,
  road_service_track,
  road_link,
  road_minor,
  road_secondary_tertiary,
  road_trunk_primary,
  road_motorway,
  road_major_rail,
  road_major_rail_hatching,
  road_transit_rail,
  road_transit_rail_hatching,
  road_one_way_arrow,
  road_one_way_arrow_opposite,
  bridge_motorway_link_casing,
  bridge_service_track_casing,
  bridge_link_casing,
  bridge_street_casing,
  bridge_path_pedestrian_casing,
  bridge_secondary_tertiary_casing,
  bridge_trunk_primary_casing,
  bridge_motorway_casing,
  bridge_path_pedestrian,
  bridge_motorway_link,
  bridge_service_track,
  bridge_link,
  bridge_street,
  bridge_secondary_tertiary,
  bridge_trunk_primary,
  bridge_motorway,
  bridge_major_rail,
  bridge_major_rail_hatching,
  bridge_transit_rail,
  bridge_transit_rail_hatching,
  building,
  building_3d,
  boundary_3,
  boundary_2_z0_4,
  boundary_2_z5_,
  water_name_line,
  water_name_point,
  poi_transit,
  road_label,
  road_shield,
  place_other,
  place_village,
  place_town,
  place_city,
  state,
  country_3,
  country_2,
  country_1,
  continent,
  data_z14,
  data_z15,
  data_z16,
]
