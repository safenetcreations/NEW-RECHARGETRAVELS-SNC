import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export interface FleetPageSettings {
  seoTitle: string
  seoDescription: string
  heroBadge: string
  heroTitle: string
  heroSubtitle: string
  heroPrimaryCtaLabel: string
  heroPrimaryCtaLink: string
  heroOverlayTitle: string
  heroOverlaySubtitle: string
  sectionTitle: string
  sectionSubtitle: string
  badge1Label: string
  badge2Label: string
  badge3Label: string
  statsVehiclesFallback: string
  statsSeatsFallback: string
  statsAcFallback: string
}

const DEFAULT_FLEET_PAGE_SETTINGS: FleetPageSettings = {
  seoTitle: 'Our Vehicle Fleet | Chauffeur-Driven Cars, Vans & SUVs - Recharge Travels',
  seoDescription:
    'Browse our private fleet of chauffeur-driven cars, vans, SUVs and minibuses in Sri Lanka. All vehicles include licensed drivers and comfortable, air-conditioned interiors for airport transfers and tours.',
  heroBadge: 'Our Private Fleet',
  heroTitle: 'Chauffeur-driven vehicles for every journey',
  heroSubtitle:
    'Choose from sedans, SUVs, vans and luxury vehicles with trusted, professional drivers anywhere in Sri Lanka.',
  heroPrimaryCtaLabel: 'Get a custom quote',
  heroPrimaryCtaLink: '/vehicle-rental',
  heroOverlayTitle: 'Airport, round trips & custom tours',
  heroOverlaySubtitle: 'Licensed, insured and regularly serviced vehicles',
  sectionTitle: 'Fleet for every traveller',
  sectionSubtitle:
    'From solo business trips to big family holidays, pick the vehicle class that matches your journey.',
  badge1Label: 'Driver included',
  badge2Label: 'Luggage friendly',
  badge3Label: 'Hand-picked fleet',
  statsVehiclesFallback: '10+',
  statsSeatsFallback: '40+',
  statsAcFallback: 'All',
}

const DOC_ID = 'fleetPageSettings'

export async function getFleetPageSettings(): Promise<FleetPageSettings> {
  try {
    const ref = doc(db, 'cmsContent', DOC_ID)
    const snap = await getDoc(ref)

    if (snap.exists()) {
      const data = snap.data() as Partial<FleetPageSettings>
      return { ...DEFAULT_FLEET_PAGE_SETTINGS, ...data }
    }

    await setDoc(ref, DEFAULT_FLEET_PAGE_SETTINGS)
    return DEFAULT_FLEET_PAGE_SETTINGS
  } catch (error) {
    console.error('Error fetching fleet page settings:', error)
    return DEFAULT_FLEET_PAGE_SETTINGS
  }
}
