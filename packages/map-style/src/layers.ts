import type { LayerSpecification } from 'maplibre-gl'

/**
 * We have to re-export the layers, because the order matters, and export * with
 * Object.values() reorders them alphabetically.
 */
import { airport_area } from './layers/airport_area'
import { airport_runway } from './layers/airport_runway'
import { airport_runway_outline } from './layers/airport_runway_outline'
import { airport_taxiway } from './layers/airport_taxiway'
import { airport_taxiway_outline } from './layers/airport_taxiway_outline'
import { background } from './layers/background'
import { boundary_country } from './layers/boundary_country'
import { boundary_country_disputed } from './layers/boundary_country_disputed'
import { boundary_country_disputed_outline } from './layers/boundary_country_disputed_outline'
import { boundary_country_outline } from './layers/boundary_country_outline'
import { boundary_state } from './layers/boundary_state'
import { boundary_state_outline } from './layers/boundary_state_outline'
import { bridge } from './layers/bridge'
import { bridge_street_livingstreet } from './layers/bridge_street_livingstreet'
import { bridge_street_livingstreet_bicycle } from './layers/bridge_street_livingstreet_bicycle'
import { bridge_street_livingstreet_bridge } from './layers/bridge_street_livingstreet_bridge'
import { bridge_street_livingstreet_outline } from './layers/bridge_street_livingstreet_outline'
import { bridge_street_motorway } from './layers/bridge_street_motorway'
import { bridge_street_motorway_bridge } from './layers/bridge_street_motorway_bridge'
import { bridge_street_motorway_link } from './layers/bridge_street_motorway_link'
import { bridge_street_motorway_link_bridge } from './layers/bridge_street_motorway_link_bridge'
import { bridge_street_motorway_link_outline } from './layers/bridge_street_motorway_link_outline'
import { bridge_street_motorway_outline } from './layers/bridge_street_motorway_outline'
import { bridge_street_pedestrian } from './layers/bridge_street_pedestrian'
import { bridge_street_pedestrian_bicycle } from './layers/bridge_street_pedestrian_bicycle'
import { bridge_street_pedestrian_bridge } from './layers/bridge_street_pedestrian_bridge'
import { bridge_street_pedestrian_outline } from './layers/bridge_street_pedestrian_outline'
import { bridge_street_pedestrian_zone } from './layers/bridge_street_pedestrian_zone'
import { bridge_street_primary } from './layers/bridge_street_primary'
import { bridge_street_primary_bridge } from './layers/bridge_street_primary_bridge'
import { bridge_street_primary_link } from './layers/bridge_street_primary_link'
import { bridge_street_primary_link_bridge } from './layers/bridge_street_primary_link_bridge'
import { bridge_street_primary_link_outline } from './layers/bridge_street_primary_link_outline'
import { bridge_street_primary_outline } from './layers/bridge_street_primary_outline'
import { bridge_street_residential } from './layers/bridge_street_residential'
import { bridge_street_residential_bicycle } from './layers/bridge_street_residential_bicycle'
import { bridge_street_residential_bridge } from './layers/bridge_street_residential_bridge'
import { bridge_street_residential_outline } from './layers/bridge_street_residential_outline'
import { bridge_street_secondary } from './layers/bridge_street_secondary'
import { bridge_street_secondary_bridge } from './layers/bridge_street_secondary_bridge'
import { bridge_street_secondary_link } from './layers/bridge_street_secondary_link'
import { bridge_street_secondary_link_bridge } from './layers/bridge_street_secondary_link_bridge'
import { bridge_street_secondary_link_outline } from './layers/bridge_street_secondary_link_outline'
import { bridge_street_secondary_outline } from './layers/bridge_street_secondary_outline'
import { bridge_street_service } from './layers/bridge_street_service'
import { bridge_street_service_bicycle } from './layers/bridge_street_service_bicycle'
import { bridge_street_service_bridge } from './layers/bridge_street_service_bridge'
import { bridge_street_service_outline } from './layers/bridge_street_service_outline'
import { bridge_street_tertiary } from './layers/bridge_street_tertiary'
import { bridge_street_tertiary_bridge } from './layers/bridge_street_tertiary_bridge'
import { bridge_street_tertiary_link } from './layers/bridge_street_tertiary_link'
import { bridge_street_tertiary_link_bridge } from './layers/bridge_street_tertiary_link_bridge'
import { bridge_street_tertiary_link_outline } from './layers/bridge_street_tertiary_link_outline'
import { bridge_street_tertiary_outline } from './layers/bridge_street_tertiary_outline'
import { bridge_street_track } from './layers/bridge_street_track'
import { bridge_street_track_bicycle } from './layers/bridge_street_track_bicycle'
import { bridge_street_track_bridge } from './layers/bridge_street_track_bridge'
import { bridge_street_track_outline } from './layers/bridge_street_track_outline'
import { bridge_street_trunk } from './layers/bridge_street_trunk'
import { bridge_street_trunk_bridge } from './layers/bridge_street_trunk_bridge'
import { bridge_street_trunk_link } from './layers/bridge_street_trunk_link'
import { bridge_street_trunk_link_bridge } from './layers/bridge_street_trunk_link_bridge'
import { bridge_street_trunk_link_outline } from './layers/bridge_street_trunk_link_outline'
import { bridge_street_trunk_outline } from './layers/bridge_street_trunk_outline'
import { bridge_street_unclassified } from './layers/bridge_street_unclassified'
import { bridge_street_unclassified_bicycle } from './layers/bridge_street_unclassified_bicycle'
import { bridge_street_unclassified_bridge } from './layers/bridge_street_unclassified_bridge'
import { bridge_street_unclassified_outline } from './layers/bridge_street_unclassified_outline'
import { bridge_transport_funicular } from './layers/bridge_transport_funicular'
import { bridge_transport_funicular_outline } from './layers/bridge_transport_funicular_outline'
import { bridge_transport_lightrail } from './layers/bridge_transport_lightrail'
import { bridge_transport_lightrail_outline } from './layers/bridge_transport_lightrail_outline'
import { bridge_transport_lightrail_service } from './layers/bridge_transport_lightrail_service'
import { bridge_transport_lightrail_service_outline } from './layers/bridge_transport_lightrail_service_outline'
import { bridge_transport_monorail } from './layers/bridge_transport_monorail'
import { bridge_transport_monorail_outline } from './layers/bridge_transport_monorail_outline'
import { bridge_transport_narrowgauge } from './layers/bridge_transport_narrowgauge'
import { bridge_transport_narrowgauge_outline } from './layers/bridge_transport_narrowgauge_outline'
import { bridge_transport_rail } from './layers/bridge_transport_rail'
import { bridge_transport_rail_outline } from './layers/bridge_transport_rail_outline'
import { bridge_transport_rail_service } from './layers/bridge_transport_rail_service'
import { bridge_transport_rail_service_outline } from './layers/bridge_transport_rail_service_outline'
import { bridge_transport_subway } from './layers/bridge_transport_subway'
import { bridge_transport_subway_outline } from './layers/bridge_transport_subway_outline'
import { bridge_transport_tram } from './layers/bridge_transport_tram'
import { bridge_transport_tram_outline } from './layers/bridge_transport_tram_outline'
import { bridge_way_cycleway } from './layers/bridge_way_cycleway'
import { bridge_way_cycleway_bridge } from './layers/bridge_way_cycleway_bridge'
import { bridge_way_cycleway_outline } from './layers/bridge_way_cycleway_outline'
import { bridge_way_footway } from './layers/bridge_way_footway'
import { bridge_way_footway_bridge } from './layers/bridge_way_footway_bridge'
import { bridge_way_footway_outline } from './layers/bridge_way_footway_outline'
import { bridge_way_path } from './layers/bridge_way_path'
import { bridge_way_path_bridge } from './layers/bridge_way_path_bridge'
import { bridge_way_path_outline } from './layers/bridge_way_path_outline'
import { bridge_way_steps } from './layers/bridge_way_steps'
import { bridge_way_steps_bridge } from './layers/bridge_way_steps_bridge'
import { bridge_way_steps_outline } from './layers/bridge_way_steps_outline'
import { building } from './layers/building'
import { building_outline } from './layers/building_outline'
import { label_address_housenumber } from './layers/label_address_housenumber'
import { label_boundary_country_large } from './layers/label_boundary_country_large'
import { label_boundary_country_medium } from './layers/label_boundary_country_medium'
import { label_boundary_country_small } from './layers/label_boundary_country_small'
import { label_boundary_state } from './layers/label_boundary_state'
import { label_motorway_shield } from './layers/label_motorway_shield'
import { label_place_capital } from './layers/label_place_capital'
import { label_place_city } from './layers/label_place_city'
import { label_place_hamlet } from './layers/label_place_hamlet'
import { label_place_neighbourhood } from './layers/label_place_neighbourhood'
import { label_place_quarter } from './layers/label_place_quarter'
import { label_place_statecapital } from './layers/label_place_statecapital'
import { label_place_suburb } from './layers/label_place_suburb'
import { label_place_town } from './layers/label_place_town'
import { label_place_village } from './layers/label_place_village'
import { label_street_livingstreet } from './layers/label_street_livingstreet'
import { label_street_pedestrian } from './layers/label_street_pedestrian'
import { label_street_primary } from './layers/label_street_primary'
import { label_street_residential } from './layers/label_street_residential'
import { label_street_secondary } from './layers/label_street_secondary'
import { label_street_tertiary } from './layers/label_street_tertiary'
import { label_street_trunk } from './layers/label_street_trunk'
import { label_street_unclassified } from './layers/label_street_unclassified'
import { land_agriculture } from './layers/land_agriculture'
import { land_burial } from './layers/land_burial'
import { land_commercial } from './layers/land_commercial'
import { land_forest } from './layers/land_forest'
import { land_garden } from './layers/land_garden'
import { land_glacier } from './layers/land_glacier'
import { land_grass } from './layers/land_grass'
import { land_industrial } from './layers/land_industrial'
import { land_leisure } from './layers/land_leisure'
import { land_park } from './layers/land_park'
import { land_residential } from './layers/land_residential'
import { land_rock } from './layers/land_rock'
import { land_sand } from './layers/land_sand'
import { land_vegetation } from './layers/land_vegetation'
import { land_waste } from './layers/land_waste'
import { land_wetland } from './layers/land_wetland'
import { marking_oneway } from './layers/marking_oneway'
import { marking_oneway_reverse } from './layers/marking_oneway_reverse'
import { poi_amenity } from './layers/poi_amenity'
import { poi_emergency } from './layers/poi_emergency'
import { poi_highway } from './layers/poi_highway'
import { poi_historic } from './layers/poi_historic'
import { poi_leisure } from './layers/poi_leisure'
import { poi_man_made } from './layers/poi_man_made'
import { poi_office } from './layers/poi_office'
import { poi_shop } from './layers/poi_shop'
import { poi_tourism } from './layers/poi_tourism'
import { site_bicycleparking } from './layers/site_bicycleparking'
import { site_college } from './layers/site_college'
import { site_construction } from './layers/site_construction'
import { site_dangerarea } from './layers/site_dangerarea'
import { site_hospital } from './layers/site_hospital'
import { site_parking } from './layers/site_parking'
import { site_prison } from './layers/site_prison'
import { site_school } from './layers/site_school'
import { site_university } from './layers/site_university'
import { street_livingstreet } from './layers/street_livingstreet'
import { street_livingstreet_bicycle } from './layers/street_livingstreet_bicycle'
import { street_livingstreet_outline } from './layers/street_livingstreet_outline'
import { street_motorway } from './layers/street_motorway'
import { street_motorway_link } from './layers/street_motorway_link'
import { street_motorway_link_outline } from './layers/street_motorway_link_outline'
import { street_motorway_outline } from './layers/street_motorway_outline'
import { street_pedestrian } from './layers/street_pedestrian'
import { street_pedestrian_bicycle } from './layers/street_pedestrian_bicycle'
import { street_pedestrian_outline } from './layers/street_pedestrian_outline'
import { street_pedestrian_zone } from './layers/street_pedestrian_zone'
import { street_primary } from './layers/street_primary'
import { street_primary_link } from './layers/street_primary_link'
import { street_primary_link_outline } from './layers/street_primary_link_outline'
import { street_primary_outline } from './layers/street_primary_outline'
import { street_residential } from './layers/street_residential'
import { street_residential_bicycle } from './layers/street_residential_bicycle'
import { street_residential_outline } from './layers/street_residential_outline'
import { street_secondary } from './layers/street_secondary'
import { street_secondary_link } from './layers/street_secondary_link'
import { street_secondary_link_outline } from './layers/street_secondary_link_outline'
import { street_secondary_outline } from './layers/street_secondary_outline'
import { street_service } from './layers/street_service'
import { street_service_bicycle } from './layers/street_service_bicycle'
import { street_service_outline } from './layers/street_service_outline'
import { street_tertiary } from './layers/street_tertiary'
import { street_tertiary_link } from './layers/street_tertiary_link'
import { street_tertiary_link_outline } from './layers/street_tertiary_link_outline'
import { street_tertiary_outline } from './layers/street_tertiary_outline'
import { street_track } from './layers/street_track'
import { street_track_bicycle } from './layers/street_track_bicycle'
import { street_track_outline } from './layers/street_track_outline'
import { street_trunk } from './layers/street_trunk'
import { street_trunk_link } from './layers/street_trunk_link'
import { street_trunk_link_outline } from './layers/street_trunk_link_outline'
import { street_trunk_outline } from './layers/street_trunk_outline'
import { street_unclassified } from './layers/street_unclassified'
import { street_unclassified_bicycle } from './layers/street_unclassified_bicycle'
import { street_unclassified_outline } from './layers/street_unclassified_outline'
import { symbol_transit_airfield } from './layers/symbol_transit_airfield'
import { symbol_transit_airport } from './layers/symbol_transit_airport'
import { symbol_transit_bus } from './layers/symbol_transit_bus'
import { symbol_transit_lightrail } from './layers/symbol_transit_lightrail'
import { symbol_transit_station } from './layers/symbol_transit_station'
import { symbol_transit_subway } from './layers/symbol_transit_subway'
import { symbol_transit_tram } from './layers/symbol_transit_tram'
import { transport_ferry } from './layers/transport_ferry'
import { transport_funicular } from './layers/transport_funicular'
import { transport_funicular_outline } from './layers/transport_funicular_outline'
import { transport_lightrail } from './layers/transport_lightrail'
import { transport_lightrail_outline } from './layers/transport_lightrail_outline'
import { transport_lightrail_service } from './layers/transport_lightrail_service'
import { transport_lightrail_service_outline } from './layers/transport_lightrail_service_outline'
import { transport_monorail } from './layers/transport_monorail'
import { transport_monorail_outline } from './layers/transport_monorail_outline'
import { transport_narrowgauge } from './layers/transport_narrowgauge'
import { transport_narrowgauge_outline } from './layers/transport_narrowgauge_outline'
import { transport_rail } from './layers/transport_rail'
import { transport_rail_outline } from './layers/transport_rail_outline'
import { transport_rail_service } from './layers/transport_rail_service'
import { transport_rail_service_outline } from './layers/transport_rail_service_outline'
import { transport_subway } from './layers/transport_subway'
import { transport_subway_outline } from './layers/transport_subway_outline'
import { transport_tram } from './layers/transport_tram'
import { transport_tram_outline } from './layers/transport_tram_outline'
import { tunnel_street_livingstreet } from './layers/tunnel_street_livingstreet'
import { tunnel_street_livingstreet_bicycle } from './layers/tunnel_street_livingstreet_bicycle'
import { tunnel_street_livingstreet_outline } from './layers/tunnel_street_livingstreet_outline'
import { tunnel_street_motorway } from './layers/tunnel_street_motorway'
import { tunnel_street_motorway_link } from './layers/tunnel_street_motorway_link'
import { tunnel_street_motorway_link_outline } from './layers/tunnel_street_motorway_link_outline'
import { tunnel_street_motorway_outline } from './layers/tunnel_street_motorway_outline'
import { tunnel_street_pedestrian } from './layers/tunnel_street_pedestrian'
import { tunnel_street_pedestrian_bicycle } from './layers/tunnel_street_pedestrian_bicycle'
import { tunnel_street_pedestrian_outline } from './layers/tunnel_street_pedestrian_outline'
import { tunnel_street_pedestrian_zone } from './layers/tunnel_street_pedestrian_zone'
import { tunnel_street_primary } from './layers/tunnel_street_primary'
import { tunnel_street_primary_link } from './layers/tunnel_street_primary_link'
import { tunnel_street_primary_link_outline } from './layers/tunnel_street_primary_link_outline'
import { tunnel_street_primary_outline } from './layers/tunnel_street_primary_outline'
import { tunnel_street_residential } from './layers/tunnel_street_residential'
import { tunnel_street_residential_bicycle } from './layers/tunnel_street_residential_bicycle'
import { tunnel_street_residential_outline } from './layers/tunnel_street_residential_outline'
import { tunnel_street_secondary } from './layers/tunnel_street_secondary'
import { tunnel_street_secondary_link } from './layers/tunnel_street_secondary_link'
import { tunnel_street_secondary_link_outline } from './layers/tunnel_street_secondary_link_outline'
import { tunnel_street_secondary_outline } from './layers/tunnel_street_secondary_outline'
import { tunnel_street_service } from './layers/tunnel_street_service'
import { tunnel_street_service_bicycle } from './layers/tunnel_street_service_bicycle'
import { tunnel_street_service_outline } from './layers/tunnel_street_service_outline'
import { tunnel_street_tertiary } from './layers/tunnel_street_tertiary'
import { tunnel_street_tertiary_link } from './layers/tunnel_street_tertiary_link'
import { tunnel_street_tertiary_link_outline } from './layers/tunnel_street_tertiary_link_outline'
import { tunnel_street_tertiary_outline } from './layers/tunnel_street_tertiary_outline'
import { tunnel_street_track } from './layers/tunnel_street_track'
import { tunnel_street_track_bicycle } from './layers/tunnel_street_track_bicycle'
import { tunnel_street_track_outline } from './layers/tunnel_street_track_outline'
import { tunnel_street_trunk } from './layers/tunnel_street_trunk'
import { tunnel_street_trunk_link } from './layers/tunnel_street_trunk_link'
import { tunnel_street_trunk_link_outline } from './layers/tunnel_street_trunk_link_outline'
import { tunnel_street_trunk_outline } from './layers/tunnel_street_trunk_outline'
import { tunnel_street_unclassified } from './layers/tunnel_street_unclassified'
import { tunnel_street_unclassified_bicycle } from './layers/tunnel_street_unclassified_bicycle'
import { tunnel_street_unclassified_outline } from './layers/tunnel_street_unclassified_outline'
import { tunnel_transport_funicular } from './layers/tunnel_transport_funicular'
import { tunnel_transport_funicular_outline } from './layers/tunnel_transport_funicular_outline'
import { tunnel_transport_lightrail } from './layers/tunnel_transport_lightrail'
import { tunnel_transport_lightrail_outline } from './layers/tunnel_transport_lightrail_outline'
import { tunnel_transport_lightrail_service } from './layers/tunnel_transport_lightrail_service'
import { tunnel_transport_lightrail_service_outline } from './layers/tunnel_transport_lightrail_service_outline'
import { tunnel_transport_monorail } from './layers/tunnel_transport_monorail'
import { tunnel_transport_monorail_outline } from './layers/tunnel_transport_monorail_outline'
import { tunnel_transport_narrowgauge } from './layers/tunnel_transport_narrowgauge'
import { tunnel_transport_narrowgauge_outline } from './layers/tunnel_transport_narrowgauge_outline'
import { tunnel_transport_rail } from './layers/tunnel_transport_rail'
import { tunnel_transport_rail_outline } from './layers/tunnel_transport_rail_outline'
import { tunnel_transport_rail_service } from './layers/tunnel_transport_rail_service'
import { tunnel_transport_rail_service_outline } from './layers/tunnel_transport_rail_service_outline'
import { tunnel_transport_subway } from './layers/tunnel_transport_subway'
import { tunnel_transport_subway_outline } from './layers/tunnel_transport_subway_outline'
import { tunnel_transport_tram } from './layers/tunnel_transport_tram'
import { tunnel_transport_tram_outline } from './layers/tunnel_transport_tram_outline'
import { tunnel_way_cycleway } from './layers/tunnel_way_cycleway'
import { tunnel_way_cycleway_outline } from './layers/tunnel_way_cycleway_outline'
import { tunnel_way_footway } from './layers/tunnel_way_footway'
import { tunnel_way_footway_outline } from './layers/tunnel_way_footway_outline'
import { tunnel_way_path } from './layers/tunnel_way_path'
import { tunnel_way_path_outline } from './layers/tunnel_way_path_outline'
import { tunnel_way_steps } from './layers/tunnel_way_steps'
import { tunnel_way_steps_outline } from './layers/tunnel_way_steps_outline'
import { water_area } from './layers/water_area'
import { water_area_river } from './layers/water_area_river'
import { water_area_small } from './layers/water_area_small'
import { water_canal } from './layers/water_canal'
import { water_dam } from './layers/water_dam'
import { water_dam_area } from './layers/water_dam_area'
import { water_ditch } from './layers/water_ditch'
import { water_ocean } from './layers/water_ocean'
import { water_pier } from './layers/water_pier'
import { water_pier_area } from './layers/water_pier_area'
import { water_river } from './layers/water_river'
import { water_stream } from './layers/water_stream'
import { way_cycleway } from './layers/way_cycleway'
import { way_cycleway_outline } from './layers/way_cycleway_outline'
import { way_footway } from './layers/way_footway'
import { way_footway_outline } from './layers/way_footway_outline'
import { way_path } from './layers/way_path'
import { way_path_outline } from './layers/way_path_outline'
import { way_steps } from './layers/way_steps'
import { way_steps_outline } from './layers/way_steps_outline'
import { tints } from './layers/tints'

import type { StyleConfig } from '.'

export const createLayers = (config: StyleConfig): LayerSpecification[] =>
  [
    background(config),
    tints(config),
    water_ocean(config),
    land_glacier(config),
    land_commercial(config),
    land_industrial(config),
    land_residential(config),
    land_agriculture(config),
    land_waste(config),
    land_park(config),
    land_garden(config),
    land_burial(config),
    land_leisure(config),
    land_rock(config),
    land_forest(config),
    land_grass(config),
    land_vegetation(config),
    land_sand(config),
    land_wetland(config),
    water_river(config),
    water_canal(config),
    water_stream(config),
    water_ditch(config),
    water_area(config),
    water_area_river(config),
    water_area_small(config),
    water_dam_area(config),
    water_dam(config),
    water_pier_area(config),
    water_pier(config),
    site_dangerarea(config),
    site_university(config),
    site_college(config),
    site_school(config),
    site_hospital(config),
    site_prison(config),
    site_parking(config),
    site_bicycleparking(config),
    site_construction(config),
    airport_area(config),
    airport_taxiway_outline(config),
    airport_runway_outline(config),
    airport_taxiway(config),
    airport_runway(config),
    building_outline(config),
    building(config),
    tunnel_street_pedestrian_zone(config),
    tunnel_way_footway_outline(config),
    tunnel_way_steps_outline(config),
    tunnel_way_path_outline(config),
    tunnel_way_cycleway_outline(config),
    tunnel_street_track_outline(config),
    tunnel_street_pedestrian_outline(config),
    tunnel_street_service_outline(config),
    tunnel_street_livingstreet_outline(config),
    tunnel_street_residential_outline(config),
    tunnel_street_unclassified_outline(config),
    tunnel_street_tertiary_link_outline(config),
    tunnel_street_secondary_link_outline(config),
    tunnel_street_primary_link_outline(config),
    tunnel_street_trunk_link_outline(config),
    tunnel_street_motorway_link_outline(config),
    tunnel_street_tertiary_outline(config),
    tunnel_street_secondary_outline(config),
    tunnel_street_primary_outline(config),
    tunnel_street_trunk_outline(config),
    tunnel_street_motorway_outline(config),
    tunnel_way_footway(config),
    tunnel_way_steps(config),
    tunnel_way_path(config),
    tunnel_way_cycleway(config),
    tunnel_street_track(config),
    tunnel_street_pedestrian(config),
    tunnel_street_service(config),
    tunnel_street_livingstreet(config),
    tunnel_street_residential(config),
    tunnel_street_unclassified(config),
    tunnel_street_track_bicycle(config),
    tunnel_street_pedestrian_bicycle(config),
    tunnel_street_service_bicycle(config),
    tunnel_street_livingstreet_bicycle(config),
    tunnel_street_residential_bicycle(config),
    tunnel_street_unclassified_bicycle(config),
    tunnel_street_tertiary_link(config),
    tunnel_street_secondary_link(config),
    tunnel_street_primary_link(config),
    tunnel_street_trunk_link(config),
    tunnel_street_motorway_link(config),
    tunnel_street_tertiary(config),
    tunnel_street_secondary(config),
    tunnel_street_primary(config),
    tunnel_street_trunk(config),
    tunnel_street_motorway(config),
    tunnel_transport_tram_outline(config),
    tunnel_transport_narrowgauge_outline(config),
    tunnel_transport_subway_outline(config),
    tunnel_transport_lightrail_outline(config),
    tunnel_transport_lightrail_service_outline(config),
    tunnel_transport_rail_outline(config),
    tunnel_transport_rail_service_outline(config),
    tunnel_transport_monorail_outline(config),
    tunnel_transport_funicular_outline(config),
    tunnel_transport_tram(config),
    tunnel_transport_narrowgauge(config),
    tunnel_transport_subway(config),
    tunnel_transport_lightrail(config),
    tunnel_transport_lightrail_service(config),
    tunnel_transport_rail(config),
    tunnel_transport_rail_service(config),
    tunnel_transport_monorail(config),
    tunnel_transport_funicular(config),
    bridge(config),
    street_pedestrian_zone(config),
    way_footway_outline(config),
    way_steps_outline(config),
    way_path_outline(config),
    way_cycleway_outline(config),
    street_track_outline(config),
    street_pedestrian_outline(config),
    street_service_outline(config),
    street_livingstreet_outline(config),
    street_residential_outline(config),
    street_unclassified_outline(config),
    street_tertiary_link_outline(config),
    street_secondary_link_outline(config),
    street_primary_link_outline(config),
    street_trunk_link_outline(config),
    street_motorway_link_outline(config),
    street_tertiary_outline(config),
    street_secondary_outline(config),
    street_primary_outline(config),
    street_trunk_outline(config),
    street_motorway_outline(config),
    way_footway(config),
    way_steps(config),
    way_path(config),
    way_cycleway(config),
    street_track(config),
    street_pedestrian(config),
    street_service(config),
    street_livingstreet(config),
    street_residential(config),
    street_unclassified(config),
    street_track_bicycle(config),
    street_pedestrian_bicycle(config),
    street_service_bicycle(config),
    street_livingstreet_bicycle(config),
    street_residential_bicycle(config),
    street_unclassified_bicycle(config),
    street_tertiary_link(config),
    street_secondary_link(config),
    street_primary_link(config),
    street_trunk_link(config),
    street_motorway_link(config),
    street_tertiary(config),
    street_secondary(config),
    street_primary(config),
    street_trunk(config),
    street_motorway(config),
    transport_tram_outline(config),
    transport_narrowgauge_outline(config),
    transport_subway_outline(config),
    transport_lightrail_outline(config),
    transport_lightrail_service_outline(config),
    transport_rail_outline(config),
    transport_rail_service_outline(config),
    transport_monorail_outline(config),
    transport_funicular_outline(config),
    transport_tram(config),
    transport_narrowgauge(config),
    transport_subway(config),
    transport_lightrail(config),
    transport_lightrail_service(config),
    transport_rail(config),
    transport_rail_service(config),
    transport_monorail(config),
    transport_funicular(config),
    transport_ferry(config),
    bridge_way_footway_bridge(config),
    bridge_way_steps_bridge(config),
    bridge_way_path_bridge(config),
    bridge_way_cycleway_bridge(config),
    bridge_street_track_bridge(config),
    bridge_street_pedestrian_bridge(config),
    bridge_street_service_bridge(config),
    bridge_street_livingstreet_bridge(config),
    bridge_street_residential_bridge(config),
    bridge_street_unclassified_bridge(config),
    bridge_street_tertiary_link_bridge(config),
    bridge_street_secondary_link_bridge(config),
    bridge_street_primary_link_bridge(config),
    bridge_street_trunk_link_bridge(config),
    bridge_street_motorway_link_bridge(config),
    bridge_street_tertiary_bridge(config),
    bridge_street_secondary_bridge(config),
    bridge_street_primary_bridge(config),
    bridge_street_trunk_bridge(config),
    bridge_street_motorway_bridge(config),
    bridge_street_pedestrian_zone(config),
    bridge_way_footway_outline(config),
    bridge_way_steps_outline(config),
    bridge_way_path_outline(config),
    bridge_way_cycleway_outline(config),
    bridge_street_track_outline(config),
    bridge_street_pedestrian_outline(config),
    bridge_street_service_outline(config),
    bridge_street_livingstreet_outline(config),
    bridge_street_residential_outline(config),
    bridge_street_unclassified_outline(config),
    bridge_street_tertiary_link_outline(config),
    bridge_street_secondary_link_outline(config),
    bridge_street_primary_link_outline(config),
    bridge_street_trunk_link_outline(config),
    bridge_street_motorway_link_outline(config),
    bridge_street_tertiary_outline(config),
    bridge_street_secondary_outline(config),
    bridge_street_primary_outline(config),
    bridge_street_trunk_outline(config),
    bridge_street_motorway_outline(config),
    bridge_way_footway(config),
    bridge_way_steps(config),
    bridge_way_path(config),
    bridge_way_cycleway(config),
    bridge_street_track(config),
    bridge_street_pedestrian(config),
    bridge_street_service(config),
    bridge_street_livingstreet(config),
    bridge_street_residential(config),
    bridge_street_unclassified(config),
    bridge_street_track_bicycle(config),
    bridge_street_pedestrian_bicycle(config),
    bridge_street_service_bicycle(config),
    bridge_street_livingstreet_bicycle(config),
    bridge_street_residential_bicycle(config),
    bridge_street_unclassified_bicycle(config),
    bridge_street_tertiary_link(config),
    bridge_street_secondary_link(config),
    bridge_street_primary_link(config),
    bridge_street_trunk_link(config),
    bridge_street_motorway_link(config),
    bridge_street_tertiary(config),
    bridge_street_secondary(config),
    bridge_street_primary(config),
    bridge_street_trunk(config),
    bridge_street_motorway(config),
    bridge_transport_tram_outline(config),
    bridge_transport_narrowgauge_outline(config),
    bridge_transport_subway_outline(config),
    bridge_transport_lightrail_outline(config),
    bridge_transport_lightrail_service_outline(config),
    bridge_transport_rail_outline(config),
    bridge_transport_rail_service_outline(config),
    bridge_transport_monorail_outline(config),
    bridge_transport_funicular_outline(config),
    bridge_transport_tram(config),
    bridge_transport_narrowgauge(config),
    bridge_transport_subway(config),
    bridge_transport_lightrail(config),
    bridge_transport_lightrail_service(config),
    bridge_transport_rail(config),
    bridge_transport_rail_service(config),
    bridge_transport_monorail(config),
    bridge_transport_funicular(config),
    poi_amenity(config),
    poi_leisure(config),
    poi_tourism(config),
    poi_shop(config),
    poi_man_made(config),
    poi_historic(config),
    poi_emergency(config),
    poi_highway(config),
    poi_office(config),
    boundary_country_outline(config),
    boundary_country_disputed_outline(config),
    boundary_state_outline(config),
    boundary_country(config),
    boundary_country_disputed(config),
    boundary_state(config),
    label_address_housenumber(config),
    label_motorway_shield(config),
    label_street_pedestrian(config),
    label_street_livingstreet(config),
    label_street_residential(config),
    label_street_unclassified(config),
    label_street_tertiary(config),
    label_street_secondary(config),
    label_street_primary(config),
    label_street_trunk(config),
    label_place_neighbourhood(config),
    label_place_quarter(config),
    label_place_suburb(config),
    label_place_hamlet(config),
    label_place_village(config),
    label_place_town(config),
    label_boundary_state(config),
    label_place_city(config),
    label_place_statecapital(config),
    label_place_capital(config),
    label_boundary_country_small(config),
    label_boundary_country_medium(config),
    label_boundary_country_large(config),
    marking_oneway(config),
    marking_oneway_reverse(config),
    symbol_transit_bus(config),
    symbol_transit_tram(config),
    symbol_transit_subway(config),
    symbol_transit_lightrail(config),
    symbol_transit_station(config),
    symbol_transit_airfield(config),
    symbol_transit_airport(config),
  ] as LayerSpecification[]
