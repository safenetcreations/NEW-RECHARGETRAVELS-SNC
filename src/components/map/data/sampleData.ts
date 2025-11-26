
export interface POIFeature {
  type: string;
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

export const samplePoiData: POIFeature[] = [
  {"type":"Feature","properties":{"name":"Sigiriya","historic":"archaeological_site"},"geometry":{"type":"Point","coordinates":[80.758,7.957]}},
  {"type":"Feature","properties":{"name":"Temple of the Tooth","amenity":"place_of_worship"},"geometry":{"type":"Point","coordinates":[80.641,7.293]}},
  {"type":"Feature","properties":{"name":"Yala National Park","leisure":"nature_reserve"},"geometry":{"type":"Point","coordinates":[81.411,6.366]}},
  {"type":"Feature","properties":{"name":"Unawatuna Beach","natural":"beach"},"geometry":{"type":"Point","coordinates":[80.247,6.014]}},
  {"type":"Feature","properties":{"name":"Galle Fort","historic":"castle"},"geometry":{"type":"Point","coordinates":[80.217,6.026]}},
  {"type":"Feature","properties":{"name":"Diyaluma Falls","waterway":"waterfall"},"geometry":{"type":"Point","coordinates":[80.957,6.726]}},
  {"type":"Feature","properties":{"name":"Anuradhapura","historic":"ruins"},"geometry":{"type":"Point","coordinates":[80.403,8.345]}},
  {"type":"Feature","properties":{"name":"Nallur Kandaswamy Kovil","amenity":"place_of_worship"},"geometry":{"type":"Point","coordinates":[80.033,9.674]}},
  {"type":"Feature","properties":{"name":"Mirissa Beach","natural":"beach"},"geometry":{"type":"Point","coordinates":[80.457,5.946]}},
  {"type":"Feature","properties":{"name":"Udawalawe National Park","leisure":"nature_reserve"},"geometry":{"type":"Point","coordinates":[80.891,6.471]}}
];
