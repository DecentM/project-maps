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
import { hillshade } from './layers/hills'

import type { StyleConfig } from '.'

type LayerConstructor = (config: StyleConfig) => LayerSpecification[]

export const createLayers: LayerConstructor = (context) => [
  background(context),
  tints(context),
  hillshade(context),
  park(context),
  park_outline(context),
  landuse_residential(context),
  landcover_wood(context),
  landcover_grass(context),
  landcover_ice(context),
  landcover_wetland(context),
  landuse_pitch(context),
  landuse_track(context),
  landuse_cemetery(context),
  landuse_hospital(context),
  landuse_school(context),
  waterway_tunnel(context),
  waterway_river(context),
  waterway_other(context),
  water(context),
  landcover_sand(context),
  aeroway_fill(context),
  aeroway_runway(context),
  aeroway_taxiway(context),
  tunnel_motorway_link_casing(context),
  tunnel_service_track_casing(context),
  tunnel_link_casing(context),
  tunnel_street_casing(context),
  tunnel_secondary_tertiary_casing(context),
  tunnel_trunk_primary_casing(context),
  tunnel_motorway_casing(context),
  tunnel_path_pedestrian(context),
  tunnel_motorway_link(context),
  tunnel_service_track(context),
  tunnel_link(context),
  tunnel_minor(context),
  tunnel_secondary_tertiary(context),
  tunnel_trunk_primary(context),
  tunnel_motorway(context),
  tunnel_major_rail(context),
  tunnel_major_rail_hatching(context),
  tunnel_transit_rail(context),
  tunnel_transit_rail_hatching(context),
  road_area_pattern(context),
  road_motorway_link_casing(context),
  road_service_track_casing(context),
  road_link_casing(context),
  road_minor_casing(context),
  road_secondary_tertiary_casing(context),
  road_trunk_primary_casing(context),
  road_motorway_casing(context),
  road_path_pedestrian(context),
  road_motorway_link(context),
  road_service_track(context),
  road_link(context),
  road_minor(context),
  road_secondary_tertiary(context),
  road_trunk_primary(context),
  road_motorway(context),
  road_major_rail(context),
  road_major_rail_hatching(context),
  road_transit_rail(context),
  road_transit_rail_hatching(context),
  road_one_way_arrow(context),
  road_one_way_arrow_opposite(context),
  bridge_motorway_link_casing(context),
  bridge_service_track_casing(context),
  bridge_link_casing(context),
  bridge_street_casing(context),
  bridge_path_pedestrian_casing(context),
  bridge_secondary_tertiary_casing(context),
  bridge_trunk_primary_casing(context),
  bridge_motorway_casing(context),
  bridge_path_pedestrian(context),
  bridge_motorway_link(context),
  bridge_service_track(context),
  bridge_link(context),
  bridge_street(context),
  bridge_secondary_tertiary(context),
  bridge_trunk_primary(context),
  bridge_motorway(context),
  bridge_major_rail(context),
  bridge_major_rail_hatching(context),
  bridge_transit_rail(context),
  bridge_transit_rail_hatching(context),
  building(context),
  building_3d(context),
  boundary_3(context),
  boundary_2_z0_4(context),
  boundary_2_z5_(context),
  water_name_line(context),
  water_name_point(context),
  road_label(context),
  road_shield(context),
  place_other(context),
  place_village(context),
  place_town(context),
  place_city(context),
  state(context),
  country_3(context),
  country_2(context),
  country_1(context),
  continent(context),
  data_z14(context),
  data_z15(context),
  data_z16(context),
]
