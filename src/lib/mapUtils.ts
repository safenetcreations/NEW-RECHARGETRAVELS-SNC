
export const getMarkerIcon = (type: string): google.maps.Symbol => {
  const colors: Record<string, string> = {
    tour: '#0a9396',
    hotel: '#ee9b00',
    transport: '#005f73'
  };
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: colors[type] || '#0a9396',
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 2,
    scale: 8
  };
};

export const mapStyles: google.maps.MapTypeStyle[] = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0a9396' }]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f2' }]
  }
];
