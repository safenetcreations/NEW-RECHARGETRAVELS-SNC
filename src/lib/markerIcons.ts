
export const getWildlifeMarkerIcon = (wildlifeType: string): google.maps.Icon => {
  const iconConfigs: Record<string, google.maps.Icon> = {
    leopard: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#FF6B1A" stroke="#FFFFFF" stroke-width="2"/>
          <circle cx="18" cy="18" r="12" fill="#FFE4D1"/>
          <circle cx="14" cy="14" r="2" fill="#FF6B1A"/>
          <circle cx="22" cy="14" r="1.5" fill="#FF6B1A"/>
          <circle cx="18" cy="20" r="1.8" fill="#FF6B1A"/>
          <circle cx="12" cy="22" r="1.2" fill="#FF6B1A"/>
          <circle cx="24" cy="22" r="1.4" fill="#FF6B1A"/>
          <text x="18" y="32" text-anchor="middle" font-size="10" fill="#FFFFFF" font-weight="bold">🐆</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 36)
    },
    elephant: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#2E8A4D" stroke="#FFFFFF" stroke-width="2"/>
          <text x="18" y="22" text-anchor="middle" font-size="18" fill="#FFFFFF">🐘</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 36)
    },
    whale: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#0074B6" stroke="#FFFFFF" stroke-width="2"/>
          <text x="18" y="22" text-anchor="middle" font-size="18" fill="#FFFFFF">🐋</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 36)
    },
    dolphin: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#00A8CC" stroke="#FFFFFF" stroke-width="2"/>
          <text x="18" y="22" text-anchor="middle" font-size="18" fill="#FFFFFF">🐬</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 36)
    },
    turtle: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#228B22" stroke="#FFFFFF" stroke-width="2"/>
          <text x="18" y="22" text-anchor="middle" font-size="18" fill="#FFFFFF">🐢</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 36)
    },
    crocodile: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#556B2F" stroke="#FFFFFF" stroke-width="2"/>
          <text x="18" y="22" text-anchor="middle" font-size="18" fill="#FFFFFF">🐊</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 36)
    },
    bird: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#4169E1" stroke="#FFFFFF" stroke-width="2"/>
          <text x="18" y="22" text-anchor="middle" font-size="18" fill="#FFFFFF">🦅</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 36)
    },
    bear: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#8B4513" stroke="#FFFFFF" stroke-width="2"/>
          <text x="18" y="22" text-anchor="middle" font-size="18" fill="#FFFFFF">🐻</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 36)
    },
    dugong: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#20B2AA" stroke="#FFFFFF" stroke-width="2"/>
          <text x="18" y="22" text-anchor="middle" font-size="18" fill="#FFFFFF">🦭</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 36)
    },
    beach: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#FFD700" stroke="#FFFFFF" stroke-width="2"/>
          <text x="18" y="22" text-anchor="middle" font-size="18" fill="#FFFFFF">🏖️</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 36)
    },
    temple: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#9932CC" stroke="#FFFFFF" stroke-width="2"/>
          <text x="18" y="22" text-anchor="middle" font-size="18" fill="#FFFFFF">🛕</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 36)
    },
    waterfall: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#00CED1" stroke="#FFFFFF" stroke-width="2"/>
          <text x="18" y="22" text-anchor="middle" font-size="18" fill="#FFFFFF">💧</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 36)
    },
    adventure: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#FF4500" stroke="#FFFFFF" stroke-width="2"/>
          <text x="18" y="22" text-anchor="middle" font-size="18" fill="#FFFFFF">🏔️</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 36)
    },
    cultural: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#009988" stroke="#FFFFFF" stroke-width="2"/>
          <text x="18" y="22" text-anchor="middle" font-size="18" fill="#FFFFFF">🏛️</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 36)
    },
    mixed: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#404040" stroke="#FFFFFF" stroke-width="2"/>
          <text x="18" y="22" text-anchor="middle" font-size="18" fill="#FFFFFF">✈️</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 36)
    }
  };

  return iconConfigs[wildlifeType] || iconConfigs.mixed;
};
