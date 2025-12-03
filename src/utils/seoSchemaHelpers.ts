const DEFAULT_BASE_URL = 'https://www.rechargetravels.com';

export const getBaseUrl = () =>
  typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : DEFAULT_BASE_URL;

export const buildBrand = (baseUrl = getBaseUrl()) => ({
  '@type': 'Organization',
  name: 'Recharge Travels',
  url: baseUrl,
  logo: `${baseUrl}/logo-v2.png`,
  sameAs: [
    'https://www.facebook.com/rechargetravels',
    'https://www.instagram.com/rechargetravels',
    'https://www.youtube.com/rechargetravels'
  ]
});

export const buildAggregateRating = (
  ratingValue?: number | string,
  reviewCount?: number | string,
  bestRating: number = 5,
  worstRating: number = 1
) => {
  if (ratingValue === undefined || reviewCount === undefined) return undefined;
  const rating = Number(ratingValue);
  const count = Number(reviewCount);
  if (!Number.isFinite(rating) || !Number.isFinite(count)) return undefined;

  return {
    '@type': 'AggregateRating',
    ratingValue: rating,
    reviewCount: count,
    bestRating,
    worstRating
  };
};

export const parsePrice = (value?: string | number | null) => {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const match = value.match(/[\d.]+/);
  if (!match) return null;
  const parsed = parseFloat(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
};

export const buildOffersFromItems = (
  items: Array<{ name: string; price?: string | number | null }>,
  baseUrl = getBaseUrl()
) => {
  const offers = items
    .map(({ name, price }) => {
      const parsedPrice = parsePrice(price);
      if (parsedPrice === null) return null;
      return {
        '@type': 'Offer',
        name,
        price: parsedPrice,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: baseUrl
      };
    })
    .filter(Boolean);

  return offers.length ? offers : undefined;
};
