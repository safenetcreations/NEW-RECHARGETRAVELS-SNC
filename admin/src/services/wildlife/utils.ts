
export function calculateWildlifePackagePrice(
  basePrice: number, 
  participants: number, 
  duration: number,
  discounts: any = {}
) {
  let totalPrice = basePrice * participants;

  // Group discount
  if (participants >= 4) {
    totalPrice *= 0.9; // 10% discount for groups of 4+
  }
  if (participants >= 8) {
    totalPrice *= 0.85; // 15% discount for groups of 8+
  }

  // Early bird discount
  if (discounts.earlyBird) {
    totalPrice *= 0.9; // 10% early bird discount
  }

  // Multi-day discount
  if (duration >= 5) {
    totalPrice *= 0.95; // 5% discount for 5+ day packages
  }

  return Math.round(totalPrice * 100) / 100;
}

export function getBestWildlifeSeasons() {
  return {
    leopards: {
      best: ['June', 'July', 'August', 'September'],
      good: ['May', 'October'],
      avoid: ['November', 'December', 'January', 'February']
    },
    whales: {
      best: ['December', 'January', 'February', 'March', 'April'],
      good: ['November', 'May'],
      avoid: ['June', 'July', 'August', 'September']
    },
    elephants: {
      best: ['June', 'July', 'August', 'September', 'October'],
      good: ['May', 'November'],
      avoid: ['December', 'January', 'February']
    },
    birds: {
      best: ['November', 'December', 'January', 'February', 'March'],
      good: ['October', 'April'],
      avoid: ['June', 'July', 'August']
    }
  };
}
