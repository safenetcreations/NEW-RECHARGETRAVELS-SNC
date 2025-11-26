
export const getEmojiForType = (type: string): string => {
  const emojiMap: Record<string, string> = {
    wildlife: '🐆',
    beach: '🏖️',
    beaches: '🏖️',
    temple: '🛕',
    temples: '🛕',
    waterfall: '💧',
    waterfalls: '💧',
    adventure: '🏔️',
    cultural: '🏛️',
    national_park: '🦎',
    safari: '🐘',
    city: '🏙️',
    mountain: '⛰️',
    lake: '🌊',
    ancient: '🏺',
    heritage: '🏛️'
  };
  
  return emojiMap[type.toLowerCase()] || '📍';
};
