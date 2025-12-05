import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getFeaturedDestinations, FeaturedDestination } from '@/services/featuredDestinationsService';

// High-quality destination images matching the hero/featured section
const DESTINATION_IMAGES: Record<string, string> = {
    'mirissa': 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80',
    'ella': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    'sigiriya': 'https://images.unsplash.com/photo-1603852452378-a4e8d84324a2?w=800&q=80',
    'galle': 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80',
    'nuwara-eliya': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    'nuwara eliya': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    'nuwaraeliya': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    'yala': 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=800&q=80',
    'trincomalee': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    'kandy': 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
    'anuradhapura': 'https://images.unsplash.com/photo-1588598198321-9735fd510e3c?w=800&q=80',
    'polonnaruwa': 'https://images.unsplash.com/photo-1588598198321-9735fd510e3c?w=800&q=80',
    'dambulla': 'https://images.unsplash.com/photo-1588598198321-9735fd510e3c?w=800&q=80',
    'arugam bay': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    'bentota': 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80',
    'hikkaduwa': 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80',
    'unawatuna': 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80',
    'jaffna': 'https://images.unsplash.com/photo-1588598198321-9735fd510e3c?w=800&q=80',
    'colombo': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
};

// Default fallback image for any destination
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80';

// Get the best image for a destination
const getDestinationImage = (dest: any): string => {
    // If the destination has a valid image URL, use it
    if (dest.image && dest.image.startsWith('http')) {
        return dest.image;
    }

    // Try to match by name (case-insensitive)
    const nameKey = dest.name?.toLowerCase()?.trim();
    if (nameKey && DESTINATION_IMAGES[nameKey]) {
        return DESTINATION_IMAGES[nameKey];
    }

    // Try to match by id
    const idKey = dest.id?.toLowerCase()?.trim();
    if (idKey && DESTINATION_IMAGES[idKey]) {
        return DESTINATION_IMAGES[idKey];
    }

    return DEFAULT_IMAGE;
};

const FALLBACK_DESTINATIONS = [
    {
        id: 'mirissa',
        name: 'Mirissa',
        to: '/destinations/mirissa',
        image: DESTINATION_IMAGES['mirissa'],
        emoji: '🐋'
    },
    {
        id: 'ella',
        name: 'Ella',
        to: '/destinations/ella',
        image: DESTINATION_IMAGES['ella'],
        emoji: '⛰️'
    },
    {
        id: 'sigiriya',
        name: 'Sigiriya',
        to: '/destinations/sigiriya',
        image: DESTINATION_IMAGES['sigiriya'],
        emoji: '🦁'
    },
    {
        id: 'galle',
        name: 'Galle',
        to: '/destinations/galle',
        image: DESTINATION_IMAGES['galle'],
        emoji: '🏰'
    },
    {
        id: 'nuwara-eliya',
        name: 'Nuwara Eliya',
        to: '/destinations/nuwara-eliya',
        image: DESTINATION_IMAGES['nuwara-eliya'],
        emoji: '🍵'
    },
    {
        id: 'yala',
        name: 'Yala',
        to: '/wild-tours',
        image: DESTINATION_IMAGES['yala'],
        emoji: '🐆'
    },
    {
        id: 'trincomalee',
        name: 'Trincomalee',
        to: '/destinations/trincomalee',
        image: DESTINATION_IMAGES['trincomalee'],
        emoji: '🏖️'
    },
    {
        id: 'kandy',
        name: 'Kandy',
        to: '/destinations/kandy',
        image: DESTINATION_IMAGES['kandy'],
        emoji: '🦷'
    }
];

const FooterDestinationMarquee = () => {
    const [destinations, setDestinations] = useState<any[]>(FALLBACK_DESTINATIONS);

    useEffect(() => {
        const loadDestinations = async () => {
            try {
                const data = await getFeaturedDestinations();
                if (data && data.length > 0) {
                    // Process destinations to ensure valid images
                    const processedData = data.map(dest => ({
                        ...dest,
                        image: getDestinationImage(dest),
                        to: dest.to || `/destinations/${dest.name?.toLowerCase()?.replace(/\s+/g, '-')}`,
                        emoji: dest.emoji || '🌴'
                    }));

                    // Merge with fallback to ensure we have enough items for a smooth marquee
                    const merged = [...processedData];
                    FALLBACK_DESTINATIONS.forEach(fb => {
                        if (!merged.some(d => d.name === fb.name)) {
                            merged.push(fb as any);
                        }
                    });
                    setDestinations(merged);
                }
            } catch (err) {
                console.error('Failed to load destinations for marquee', err);
            }
        };
        loadDestinations();
    }, []);

    // Handle image load errors
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, destName: string) => {
        const target = e.currentTarget;
        // Try to get a matching image from our known images, or use default
        const nameKey = destName?.toLowerCase()?.trim();
        const fallbackUrl = DESTINATION_IMAGES[nameKey] || DEFAULT_IMAGE;
        if (target.src !== fallbackUrl) {
            target.src = fallbackUrl;
        }
    };

    // Duplicate items to ensure seamless loop
    const marqueeItems = [...destinations, ...destinations, ...destinations];

    return (
        <div className="relative w-full overflow-hidden py-10 bg-transparent">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d3b3b] via-transparent to-[#0d3b3b] z-10 pointer-events-none" />

            <div className="flex animate-marquee hover:[animation-play-state:paused]">
                {marqueeItems.map((dest, idx) => (
                    <Link
                        key={`${dest.id}-${idx}`}
                        to={dest.to}
                        className="flex-shrink-0 mx-4 group relative w-[280px] h-[180px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                    >
                        <img
                            src={getDestinationImage(dest)}
                            alt={dest.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => handleImageError(e, dest.name)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-2xl mb-1 block">{dest.emoji}</span>
                                    <h4 className="text-white font-bold text-lg leading-tight">{dest.name}</h4>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                                    <ArrowRight className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          width: max-content;
        }
      `}</style>
        </div>
    );
};

export default FooterDestinationMarquee;
