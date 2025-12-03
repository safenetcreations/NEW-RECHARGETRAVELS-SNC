import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HelpCircle, ChevronDown, ChevronUp, Search, Car, Plane, Train, Shield, DollarSign, Sun, Phone, FileText, Globe, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  COMPANY,
  createBreadcrumbSchema,
  createSpeakableSchema,
  createHowToSchema
} from '@/utils/schemaMarkup';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQCategory {
    category: string;
    icon: React.ReactNode;
    description: string;
    questions: FAQItem[];
}

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const faqCategories: FAQCategory[] = [
        {
            category: 'Driving & Mobility',
            icon: <Car className="w-5 h-5" />,
            description: 'IDP requirements, license rules, and driving regulations in Sri Lanka',
            questions: [
                {
                    question: 'Do I need an International Driving Permit (IDP) to drive in Sri Lanka?',
                    answer: 'Yes, all foreign visitors must carry a valid IDP along with their home country driving license to drive legally in Sri Lanka. The IDP must be obtained before arrival from your home country\'s authorized motoring association.'
                },
                {
                    question: 'Can I get a temporary driving permit at the airport?',
                    answer: 'Yes! As of August 2025, the Department of Motor Traffic operates a counter at Bandaranaike International Airport (BIA) where tourists can obtain a Recognition Permit. This service operates 24/7 and requires your valid foreign driving license, passport, and a small fee (approximately LKR 5,000).'
                },
                {
                    question: 'What is the new airport driving license counter introduced in August 2025?',
                    answer: 'The DMT Recognition Permit Counter at Bandaranaike International Airport was launched in August 2025 to streamline tourist driving permits. Located in the arrivals hall, it offers immediate permit issuance valid for 3 months, renewable at any DMT office. This eliminates the need to visit regional DMT offices.'
                },
                {
                    question: 'Can tourists drive three-wheelers (tuk-tuks) in Sri Lanka?',
                    answer: 'No. As of 2024, tourists are prohibited from driving three-wheelers in Sri Lanka. This ban was implemented for safety reasons due to several accidents involving foreign drivers unfamiliar with local driving conditions and the unique handling of three-wheelers. Tourists can only use three-wheelers as passengers.'
                },
                {
                    question: 'Why was the three-wheeler driving ban implemented for tourists?',
                    answer: 'The ban was introduced following safety concerns and multiple accidents involving tourists. Three-wheelers require specialized driving skills due to their unique balance and handling characteristics. The Sri Lankan government prioritized tourist safety by restricting this vehicle category to licensed local drivers only.'
                },
                {
                    question: 'What is the minimum age to drive in Sri Lanka?',
                    answer: 'The minimum age to drive a car in Sri Lanka is 18 years. For motorcycles, the minimum age is 16 years. You must have a valid license from your home country plus an IDP or Recognition Permit to legally drive as a tourist.'
                },
                {
                    question: 'Which side of the road do vehicles drive on in Sri Lanka?',
                    answer: 'Vehicles drive on the left side of the road in Sri Lanka, similar to the UK, India, and Australia. If you\'re from a country that drives on the right, take extra care at intersections and when overtaking.'
                },
                {
                    question: 'Are seat belts mandatory in Sri Lanka?',
                    answer: 'Yes, seat belts are mandatory for all front-seat passengers. Failure to wear a seat belt can result in fines. While rear seat belt laws are less strictly enforced, we strongly recommend all passengers wear seat belts for safety.'
                },
                {
                    question: 'What are the speed limits in Sri Lanka?',
                    answer: 'General speed limits are: 50 km/h in urban areas, 70 km/h on rural roads, and 100 km/h on expressways. Some highways have higher limits posted. Speed cameras and police checkpoints are common, so always observe posted limits.'
                },
                {
                    question: 'Can I rent a car in Sri Lanka as a tourist?',
                    answer: 'Yes, you can rent cars from numerous agencies in Sri Lanka. You\'ll need your valid foreign license, IDP or Recognition Permit, passport, and a credit card. Many tourists prefer hiring a car with a driver for convenience and local expertise. Rental rates start from around $30-50/day for self-drive.'
                },
                {
                    question: 'Is it better to hire a car with a driver or self-drive?',
                    answer: 'Most tourists prefer hiring a car with a driver-guide. Benefits include: local knowledge of routes, no parking hassles, ability to relax and enjoy scenery, driver handles navigation, and many drivers are excellent guides. Self-driving can be challenging due to road conditions and driving habits.'
                },
                {
                    question: 'What documents should I carry while driving in Sri Lanka?',
                    answer: 'Always carry: your passport (or a copy), original driving license from your home country, IDP or Sri Lankan Recognition Permit, vehicle registration documents (if renting), and insurance papers. Police may check documents at checkpoints.'
                },
                {
                    question: 'Are there toll roads in Sri Lanka?',
                    answer: 'Yes, Sri Lanka has modern expressways with toll booths. The main ones are: Southern Expressway (E01), Outer Circular Highway (E02), Colombo-Katunayake Expressway (E03), and Central Expressway. Tolls are affordable, typically LKR 100-600 depending on distance.'
                },
                {
                    question: 'What fuel types are available in Sri Lanka?',
                    answer: 'Petrol (92 and 95 octane), diesel, and auto-diesel are widely available. Some stations in major cities offer Euro 4 grade fuels. Electric vehicle charging stations are limited but growing. Fuel prices are government-regulated and similar across all stations.'
                },
                {
                    question: 'Can I use my foreign motorcycle license in Sri Lanka?',
                    answer: 'Yes, but you need an IDP that specifically endorses motorcycle riding (Category A). Your home country license must also be valid for motorcycles. The Recognition Permit from the airport covers the same categories as your foreign license.'
                },
                {
                    question: 'What happens if I get into an accident while driving?',
                    answer: 'Stop immediately, do not leave the scene. Call police (119) and ambulance (110) if needed. Exchange information with other parties and take photos. Contact your rental company or insurance. For minor accidents, parties often settle mutually, but always file a police report for insurance claims.'
                },
                {
                    question: 'Is it safe to drive at night in Sri Lanka?',
                    answer: 'Night driving requires extra caution due to: poorly lit roads in rural areas, stray animals, pedestrians walking on roads, and vehicles with inadequate lighting. We recommend completing long journeys before dark, especially in unfamiliar areas.'
                },
                {
                    question: 'Can I cross into other countries from Sri Lanka by road?',
                    answer: 'No, Sri Lanka is an island nation with no land borders. You cannot drive to any other country. The closest point to India is just 30km across the Palk Strait, but there\'s no road connection. All international travel requires flights or ferries.'
                },
                {
                    question: 'What are the drunk driving laws in Sri Lanka?',
                    answer: 'The legal blood alcohol limit is 0.08% (80mg per 100ml of blood). Police conduct random breath tests, especially at night and on weekends. Penalties include heavy fines, license suspension, and imprisonment for repeat offenders. Don\'t drink and drive.'
                },
                {
                    question: 'Where can I get my IDP issued before traveling to Sri Lanka?',
                    answer: 'IDPs must be obtained in your home country from authorized automobile associations (AAA in USA, AA in UK, RACV/RACQ/NRMA in Australia, CAA in Canada, etc.). Apply at least 2 weeks before travel. Many associations offer online applications with postal delivery.'
                },
                {
                    question: 'How long is the Recognition Permit valid for?',
                    answer: 'The Recognition Permit issued at the airport is valid for 3 months. It can be extended at any Department of Motor Traffic (DMT) office for an additional 3 months if you need to stay longer. Keep your permit with you whenever driving.'
                },
                {
                    question: 'Can I convert my foreign license to a Sri Lankan license?',
                    answer: 'Yes, if you\'re staying in Sri Lanka for an extended period (usually 6+ months on a valid visa), you can convert your foreign license to a Sri Lankan one at DMT offices. Requirements include medical examination, vision test, and proof of residence.'
                },
                {
                    question: 'Are there any vehicle restrictions in certain areas?',
                    answer: 'Some wildlife sanctuaries and national parks only allow registered safari jeeps. Certain city centers have traffic restrictions during peak hours. Some areas near military installations may have checkpoint requirements. Your driver-guide will know all local restrictions.'
                },
                {
                    question: 'What type of vehicle is best for touring Sri Lanka?',
                    answer: 'For most tourists, a comfortable SUV or minivan is ideal. These handle the varied terrain well - from expressways to rural roads to mountain passes. For solo travelers or couples, a sedan works well. Groups of 5+ should consider larger vans or mini-coaches.'
                },
                {
                    question: 'Can I drive my own vehicle to Sri Lanka?',
                    answer: 'Technically possible but impractical. You would need to ship your vehicle by cargo, obtain customs clearance, and arrange temporary import permits. The process is expensive and time-consuming. It\'s far easier and cheaper to rent locally or hire a car with driver.'
                },
                {
                    question: 'What\'s the process for hiring a car with a driver?',
                    answer: 'Contact reputable tour operators like Recharge Travels, specify your travel dates, group size, and itinerary. We provide modern, air-conditioned vehicles with experienced SLTDA-certified driver-guides who speak English. Prices include driver accommodation and meals. Book at least a week in advance during peak season.'
                },
                {
                    question: 'Are child car seats available in Sri Lanka?',
                    answer: 'Child car seats are not common in taxis or three-wheelers. If traveling with young children, request child seats when booking a car with driver - reputable operators like Recharge Travels provide them. Alternatively, bring your own travel-friendly car seat.'
                },
                {
                    question: 'How do I handle parking in major cities?',
                    answer: 'Street parking in Colombo and other cities requires paying attendants (LKR 50-100). Multi-story car parks are available in malls and central areas. Never park in no-parking zones as vehicles are towed quickly. This is another advantage of having a driver - they handle all parking!'
                },
                {
                    question: 'Can I use international apps like Uber in Sri Lanka?',
                    answer: 'Uber is available in Colombo and surrounding areas. Local alternatives PickMe and YOGO are more widely available across the country. These apps offer cars, three-wheelers, and motorbike taxis at metered rates. English language support is available on all major apps.'
                },
                {
                    question: 'What should I know about mountain road driving?',
                    answer: 'Mountain roads to areas like Nuwara Eliya and Ella have many hairpin bends, steep gradients, and narrow sections. Use low gears when descending, sound horn at blind corners, and give way to uphill traffic. Fog is common in highlands during certain seasons. If uncomfortable, hire an experienced local driver.'
                },
                {
                    question: 'Are there any areas where tourists cannot drive?',
                    answer: 'Some military-sensitive areas in the north may have restrictions, though these have largely been lifted since 2019. National parks require registered safari vehicles. Some temple premises and historical sites have vehicle restrictions. Your rental agency or driver will advise on any current restrictions.'
                },
                {
                    question: 'What happens if I lose my driving documents while in Sri Lanka?',
                    answer: 'Report the loss to the nearest police station immediately and get a police report. Contact your embassy for emergency passport services if lost. For lost IDP, contact your issuing automobile association for a replacement. The Recognition Permit can be reissued at DMT offices with a police report.'
                },
                {
                    question: 'Can I drive through wildlife areas?',
                    answer: 'Self-driving through national parks like Yala or Wilpattu is not permitted - you must use registered park jeeps with licensed drivers. However, you can drive on public roads that pass through wildlife corridors (like Lunugamvehera). Be extremely cautious of elephants and other wildlife, especially at dawn and dusk.'
                },
                {
                    question: 'What\'s the condition of roads in Sri Lanka?',
                    answer: 'Main highways and expressways are excellent. A-roads connecting major cities are generally good but may have potholes. B-roads and rural routes vary significantly - some are well-maintained, others require careful driving. Mountain roads are narrow but paved. Your navigation app may not reflect current road conditions.'
                },
                {
                    question: 'How much does it cost to hire a car with driver per day?',
                    answer: 'Rates vary by vehicle type: sedans from $45-60/day, SUVs from $55-80/day, minivans from $70-100/day. This typically includes driver accommodation, meals, and fuel. Airport transfers, expressway tolls, and parking are often extra. Multi-day bookings usually get discounted rates.'
                },
                {
                    question: 'What GPS navigation works best in Sri Lanka?',
                    answer: 'Google Maps is the most reliable and updated for Sri Lanka. Waze also works well in urban areas. Offline maps are recommended for rural areas with poor network coverage. Local drivers often know routes better than GPS, especially for scenic detours and avoiding traffic.'
                },
                {
                    question: 'Can I get motorcycle or scooter rentals in tourist areas?',
                    answer: 'Yes, motorbike rentals are available in tourist areas like Colombo, Galle, and Unawatuna (typically LKR 2,000-4,000/day). Helmets are mandatory. However, ensure you have the proper IDP endorsement for motorcycles. Be aware that road conditions and traffic can be challenging for inexperienced riders.'
                },
                {
                    question: 'What\'s the penalty for driving without a valid permit?',
                    answer: 'Driving without a valid license/permit can result in fines up to LKR 25,000, vehicle impoundment, and potential court appearance. Your travel insurance may be invalidated. Always carry valid documents - the Recognition Permit at the airport makes this easy for tourists.'
                },
                {
                    question: 'Are electric vehicle charging stations available?',
                    answer: 'EV infrastructure is developing in Sri Lanka. Charging stations are mainly in Colombo and along major expressways. If renting an EV, plan your route carefully and verify charging point locations. Most international visitors opt for conventional vehicles due to the limited charging network.'
                },
                {
                    question: 'Can I drive in Sri Lanka during monsoon season?',
                    answer: 'Yes, but take extra precautions. Roads may flood in low-lying areas. Landslides can affect mountain routes during heavy rains. Reduce speed on wet roads and avoid crossing flooded areas. The southwest monsoon affects western/southern regions (May-September), while the northeast monsoon affects eastern areas (November-February).'
                }
            ]
        },
        {
            category: 'Visas & Immigration',
            icon: <FileText className="w-5 h-5" />,
            description: 'Entry requirements, visa types, and immigration procedures',
            questions: [
                {
                    question: 'Do I need a visa to visit Sri Lanka?',
                    answer: 'Most nationalities need an Electronic Travel Authorization (ETA) or visa. However, as of 2024, citizens of 7 countries enjoy visa-free entry: India, China, Indonesia, Thailand, Malaysia, Japan, and Russia (for stays up to 30 days). All others must obtain an ETA before arrival or visa on arrival at immigration.'
                },
                {
                    question: 'Which countries have visa-free entry to Sri Lanka?',
                    answer: 'As of 2024, citizens of India, China, Indonesia, Thailand, Malaysia, Japan, and Russia can enter Sri Lanka visa-free for up to 30 days. This policy was introduced to boost tourism and can be extended by 60 days at the Department of Immigration if needed.'
                },
                {
                    question: 'How do I apply for the Sri Lanka ETA?',
                    answer: 'Apply online at www.eta.gov.lk or through the official Sri Lanka ETA app. You\'ll need a valid passport, travel dates, and payment (typically $50 for most nationalities). Processing takes 24-48 hours normally, or instant approval with "Fast Track" option for an additional fee.'
                },
                {
                    question: 'What is the cost of a Sri Lanka tourist visa/ETA?',
                    answer: 'ETA costs vary by nationality: SAARC countries $25, other countries $50 for standard processing. The "Fast Track" option costs $75 for immediate processing. Children under 12 are free. Business visa ETA costs $50-100 depending on processing type.'
                },
                {
                    question: 'Can I get a visa on arrival at Colombo airport?',
                    answer: 'Yes, visa on arrival is available at Bandaranaike International Airport, but it\'s more expensive ($60) and involves waiting in queues. We strongly recommend obtaining your ETA online before travel for a smoother arrival experience.'
                },
                {
                    question: 'How long can I stay in Sri Lanka on a tourist visa?',
                    answer: 'The standard tourist ETA allows 30 days. Visa-free entries also permit 30 days. Both can be extended at the Department of Immigration in Colombo for up to 90 additional days (maximum 6 months total stay within any 12-month period).'
                },
                {
                    question: 'How do I extend my visa in Sri Lanka?',
                    answer: 'Visit the Department of Immigration and Emigration at 41 Ananda Rajakaruna Mawatha, Colombo 10. Apply at least 7 days before your current visa expires. You\'ll need your passport, completed application form, proof of funds, onward travel plans, and extension fee (approximately $2 per day for the extension period).'
                },
                {
                    question: 'What are the passport requirements for Sri Lanka?',
                    answer: 'Your passport must be valid for at least 6 months from your date of entry. It should have at least 2 blank pages for stamps. Ensure your passport is in good condition without damaged pages. Some nationalities may need additional validity requirements.'
                },
                {
                    question: 'Can I work on a tourist visa in Sri Lanka?',
                    answer: 'No, tourist visas do not permit any form of employment. If you plan to work, volunteer extensively, or conduct business, you need the appropriate visa category (Employment visa, Business visa, or NGO/Volunteer visa). Violating visa conditions can result in deportation and entry bans.'
                },
                {
                    question: 'What is the Sri Lanka Business visa and who needs it?',
                    answer: 'The Business visa (also via ETA system) is for attending meetings, conferences, negotiations, or short-term business activities. It does not permit actual employment. Valid for 30 days and extendable. Apply online with a business letter from your company or invitation from Sri Lankan counterpart.'
                },
                {
                    question: 'Can I transit through Sri Lanka without a visa?',
                    answer: 'Transit passengers remaining in the airport for less than 24 hours and not passing through immigration do not need a visa. If you wish to leave the airport during a layover, you\'ll need at least a transit visa or ETA. Most airlines can advise on transit requirements.'
                },
                {
                    question: 'What documents do I need at immigration on arrival?',
                    answer: 'Have ready: valid passport, ETA approval printout or confirmation email, completed arrival card (given on flight), proof of accommodation (hotel booking), return/onward ticket, and proof of sufficient funds if requested. Immigration officers may ask about your travel plans.'
                },
                {
                    question: 'Can I enter Sri Lanka multiple times on one ETA?',
                    answer: 'The standard ETA is for double entry within the validity period. If you plan to leave and return (e.g., to visit Maldives and return), ensure you have a double-entry ETA. Multiple-entry visas are available for business travelers and those with specific requirements.'
                },
                {
                    question: 'What happens if my visa expires while I\'m in Sri Lanka?',
                    answer: 'Overstaying your visa is illegal and results in fines (approximately $25 per day overstayed), potential detention, and entry ban for future visits. If you realize you\'ll overstay, apply for extension immediately. In emergencies (illness, flight cancellations), contact Immigration with documentation.'
                },
                {
                    question: 'Are there any visa restrictions for certain nationalities?',
                    answer: 'Citizens of certain countries may face additional security clearance requirements. This can extend processing time. Check the official ETA website or Sri Lankan embassy in your country for specific requirements. Apply well in advance if your nationality requires additional clearance.'
                },
                {
                    question: 'Can I change my visa type while in Sri Lanka?',
                    answer: 'Generally, you cannot change visa categories within Sri Lanka. If you entered on a tourist visa and wish to work or study, you typically must exit and apply for the appropriate visa from abroad. Some exceptions exist for specific circumstances - consult Immigration.'
                },
                {
                    question: 'What is the Residence visa for Sri Lanka?',
                    answer: 'Residence visas are for those living in Sri Lanka long-term (retirees, investors, spouses of citizens). Requirements include proof of income/investment, police clearance, medical certificate, and significant fees. Processing takes 2-3 months. Contact Sri Lankan embassy for specific requirements.'
                },
                {
                    question: 'Do children need their own visa for Sri Lanka?',
                    answer: 'Yes, every traveler including infants needs their own valid travel document and visa/ETA. Children under 12 get free ETA but must still apply. Children can be included on a parent\'s ETA application. Ensure children\'s passports have adequate validity.'
                },
                {
                    question: 'What is the "My Sri Lanka" digital entry system?',
                    answer: 'Sri Lanka is modernizing its immigration system with digital entry cards and health declarations. Some information may be submitted electronically before arrival. Check current requirements on the official ETA website or airline guidance as these digital systems continue to evolve.'
                },
                {
                    question: 'Can I volunteer in Sri Lanka on a tourist visa?',
                    answer: 'Short-term volunteering (under 14 days) in some contexts may be permitted on a tourist visa, but formal volunteering programs typically require an NGO/Volunteer visa. Requirements vary by activity type. Consult with your volunteer organization about proper visa category.'
                },
                {
                    question: 'What is the process for getting a student visa?',
                    answer: 'Student visas require an acceptance letter from a recognized Sri Lankan educational institution, proof of funds, accommodation arrangements, police clearance, and medical certificate. Apply through Sri Lankan embassy before travel. Processing takes 2-4 weeks typically.'
                },
                {
                    question: 'Are there any COVID-19 related entry requirements?',
                    answer: 'As of late 2024, Sri Lanka has removed all COVID-19 related entry requirements. No vaccination certificates, negative tests, or health declarations are required. Check current requirements before travel as policies can change. General travel insurance is recommended.'
                },
                {
                    question: 'Can I get a visa for medical treatment in Sri Lanka?',
                    answer: 'Yes, Medical Treatment visas are available for those seeking healthcare in Sri Lanka. You\'ll need documentation from a recognized Sri Lankan hospital confirming your treatment. Apply through the embassy or online system. Extensions are possible based on treatment duration.'
                },
                {
                    question: 'What should I do if my visa application is rejected?',
                    answer: 'Visa rejections are rare for tourists. If rejected, you\'ll receive a reason (usually incomplete documentation or eligibility issues). You can reapply with corrected documents. Contact the Sri Lankan embassy for guidance. Consider using a visa service agent if you have complex circumstances.'
                },
                {
                    question: 'Is there an embassy fee in addition to the ETA fee?',
                    answer: 'The online ETA fee covers everything - there\'s no separate embassy fee for standard tourist visas. However, if you apply through an agency or third-party website, they may charge service fees. Always use the official www.eta.gov.lk website to avoid unnecessary charges.'
                },
                {
                    question: 'How early should I apply for my Sri Lanka ETA?',
                    answer: 'Apply at least 1 week before travel for standard processing. Most ETAs are approved within 24-48 hours. During peak season (December-March), allow extra time. For Fast Track processing, approval is usually within hours. Don\'t leave it until the last minute!'
                },
                {
                    question: 'Can I travel to Sri Lanka if I have an Israeli passport stamp?',
                    answer: 'Yes, Sri Lanka does not restrict entry for travelers with Israeli passport stamps. There are no political restrictions on who can visit based on previous travel history. All nationalities are welcome in Sri Lanka.'
                },
                {
                    question: 'What is the process for visa extension at Immigration?',
                    answer: 'Visit Department of Immigration in Colombo with: passport, completed IM 38A form, two passport photos, bank statement showing sufficient funds, copy of return ticket, hotel reservations for extended period, and payment. Process takes 3-7 working days. Apply before current visa expires.'
                },
                {
                    question: 'Can dual citizens enter Sri Lanka on either passport?',
                    answer: 'Sri Lanka recognizes dual citizenship. You can enter on either passport, but must use the same passport for entry and exit. If one passport offers visa-free access (e.g., Japanese passport), use that one. Sri Lankan dual citizens should be aware of National Service obligations.'
                },
                {
                    question: 'Are there special visas for digital nomads or remote workers?',
                    answer: 'Sri Lanka is developing its digital nomad program. Currently, remote workers typically use tourist visas with extensions. Some use business visas. A dedicated Digital Nomad Visa scheme is being planned - check latest developments on the Immigration website for updates on this program.'
                }
            ]
        },
        {
            category: 'Transport & Connectivity',
            icon: <Train className="w-5 h-5" />,
            description: 'Train booking, SIM cards, flights, and getting around Sri Lanka',
            questions: [
                {
                    question: 'How do I book train tickets in Sri Lanka?',
                    answer: 'Book online at www.railway.gov.lk or through the Sri Lanka Railways app. For popular routes like Colombo-Kandy-Ella, book 30 days in advance as observation deck seats sell out quickly. You can also buy tickets at station counters (go early for same-day travel). Tourist-friendly booking services charge a small fee but handle the process for you.'
                },
                {
                    question: 'What is the most scenic train route in Sri Lanka?',
                    answer: 'The Kandy to Ella route (via Nanu Oya) is considered one of the world\'s most scenic train journeys. The 7-hour journey passes through tea plantations, mountains, waterfalls, and the famous Nine Arches Bridge. Book first-class observation deck for the best experience. The Colombo-Galle coastal route is also beautiful.'
                },
                {
                    question: 'How do I get a local SIM card in Sri Lanka?',
                    answer: 'Buy SIM cards at the airport arrival hall (Dialog, Mobitel, Airtel counters) or any mobile shop in town. You\'ll need your passport for registration. Tourist SIM packages typically include data, calls, and SMS for 30 days. Dialog and Mobitel have the best coverage. Activation is instant.'
                },
                {
                    question: 'Which mobile network has the best coverage in Sri Lanka?',
                    answer: 'Dialog has the widest coverage across Sri Lanka, including most rural areas. Mobitel (government-owned) also has good coverage. Airtel is reliable in urban areas but patchier in remote regions. For traveling around the country, Dialog is recommended. 4G is widely available.'
                },
                {
                    question: 'How much does a tourist SIM card cost?',
                    answer: 'Airport SIM packages range from LKR 1,300-2,000 (~$4-7) including 10-50GB data for 30 days. City shops may be slightly cheaper. Top-ups are available at any small shop (salli cards). Data-only packages and higher data bundles are available for heavy users.'
                },
                {
                    question: 'Is there free WiFi available in Sri Lanka?',
                    answer: 'Free WiFi is available at most hotels, guesthouses, restaurants, and cafes in tourist areas. Quality varies from excellent to unreliable. Shopping malls offer free WiFi. Some beaches and public areas in Colombo have government-sponsored free hotspots. A local SIM with data is more reliable for constant connectivity.'
                },
                {
                    question: 'Are there domestic flights within Sri Lanka?',
                    answer: 'Yes, Cinnamon Air and other operators offer domestic flights connecting Colombo (BIA and Ratmalana), Jaffna, Trincomalee, Batticaloa, and seaplane services to various locations. Flights save time (Colombo-Jaffna: 1 hour vs 8 hours driving) but are pricey ($100-300). Seaplanes offer unique experiences to coastal hotels.'
                },
                {
                    question: 'How do ride-hailing apps work in Sri Lanka?',
                    answer: 'PickMe is the most popular ride-hailing app, available nationwide. Uber operates in Colombo and suburbs. YOGO is another local option. Download the app, register with your foreign phone number, and book rides. Payment is usually cash (card payment on some apps). Rides are metered and receipts are provided.'
                },
                {
                    question: 'What are the main transportation options between cities?',
                    answer: 'Options include: Trains (scenic but slower), express buses (AC and non-AC, affordable), private car/van with driver (flexible and comfortable), domestic flights (fastest for long distances), and ride-hailing for shorter trips. Each has its place depending on distance, budget, and comfort preferences.'
                },
                {
                    question: 'How do I book an intercity bus in Sri Lanka?',
                    answer: 'Most buses don\'t require advance booking - just show up at the bus station. For comfortable travel, use private AC bus services like "Highland" or "Royal" which can be booked online or at offices. Government CTB buses are cheaper but more basic. Express buses run on major routes hourly.'
                },
                {
                    question: 'How much do trains cost in Sri Lanka?',
                    answer: 'Train fares are extremely affordable. Colombo to Kandy: First Class LKR 1,000 (~$3), Second Class LKR 600, Third Class LKR 400. Colombo to Ella: First Class LKR 1,500-2,000. Observation deck (most scenic) is equivalent to First Class fare. Prices vary slightly by train type.'
                },
                {
                    question: 'What\'s the difference between train classes in Sri Lanka?',
                    answer: 'First Class: Reserved seating, AC in some trains, comfortable. Second Class: Reserved seating on express trains, no AC, decent comfort. Third Class: Unreserved, crowded on popular routes, basic benches. Observation Deck: Reserved, large windows, best views - book early. Sleeper Class available on night trains.'
                },
                {
                    question: 'Is there a bus from the airport to Colombo city?',
                    answer: 'The #187 bus runs from BIA airport to Colombo Fort via Negombo and Colombo suburbs (LKR 180, ~3 hours). Airport Express buses run to Colombo Central every 30 minutes (LKR 500, ~1.5 hours). Taxis and ride-hailing are faster but more expensive ($25-40). Many hotels offer airport pickups.'
                },
                {
                    question: 'How long does it take to travel between major destinations?',
                    answer: 'Colombo to: Kandy (3-4 hours by road, 3 hours by train), Galle (2-3 hours), Ella (6-7 hours by road, 8-9 hours by train), Sigiriya (4-5 hours), Jaffna (7-8 hours by road, 1 hour by flight), Trincomalee (5-6 hours), Arugam Bay (7-8 hours). Expressways reduce travel time significantly on applicable routes.'
                },
                {
                    question: 'Can I rent a bicycle in Sri Lanka?',
                    answer: 'Yes, bicycles are available for rent in most tourist areas. Daily rates: LKR 500-1,500 for basic bikes, more for mountain bikes. Popular cycling areas include Anuradhapura ancient city, Polonnaruwa, Galle Fort, and some beach towns. Always wear a helmet and be cautious of traffic.'
                },
                {
                    question: 'Are there boat services along the coast?',
                    answer: 'Regular ferry services operate to islands like Delft from Jaffna (daily ferries), and boat taxis across rivers and lagoons. No major coastal ferry routes exist. Boat tours (whale watching, river safaris, lagoon cruises) are popular tourist activities available in relevant coastal areas.'
                },
                {
                    question: 'What\'s the best way to get around Colombo?',
                    answer: 'Options include: PickMe/Uber (most convenient), three-wheelers (negotiate fare first, around LKR 80/km), buses (cheap but crowded), and tuk-tuks with meters. For multiple stops, hiring a car with driver for half/full day is cost-effective. Traffic is heavy during rush hours (8-9am, 5-7pm).'
                },
                {
                    question: 'How reliable are buses in Sri Lanka?',
                    answer: 'Government CTB buses run regularly on all routes but can be unpredictable on timing. Private buses are more punctual but may wait until full before departing. Express buses on major routes run frequently (every 15-30 minutes). Keep valuables secure in crowded buses.'
                },
                {
                    question: 'Can I use my international roaming in Sri Lanka?',
                    answer: 'Yes, international roaming works with most carriers. However, it\'s usually much more expensive than a local SIM. Roaming data can cost $10-20/day or more. We strongly recommend getting a local SIM for cost-effective connectivity. Airport SIM counters make this easy.'
                },
                {
                    question: 'Is there 5G mobile service in Sri Lanka?',
                    answer: 'Dialog and Mobitel have launched limited 5G services in Colombo and some areas. Most of the country uses 4G/LTE which provides good speeds for typical tourist needs (social media, video calls, navigation). 5G coverage is expanding but not yet widespread.'
                },
                {
                    question: 'How do I book the Observation Deck seats on trains?',
                    answer: 'Book through www.railway.gov.lk exactly 30 days before travel (bookings open at midnight). These seats sell out within minutes for popular trains. Alternative: Book through travel agencies who may have allocations (at a premium). Or try Expo Rail private train (more expensive but reliable availability).'
                },
                {
                    question: 'Are there any expressway rest stops in Sri Lanka?',
                    answer: 'Yes, expressways have modern service areas every 20-30km with fuel stations, food courts, restrooms, and shops. Popular chains like KFC, Pizza Hut, and local restaurants are available. These rest stops are clean and well-maintained compared to rural roadside stops.'
                },
                {
                    question: 'What\'s the Expo Rail and is it worth it?',
                    answer: 'Expo Rail is a private luxury train service running Colombo-Kandy-Badulla. It offers guaranteed seating, AC, better observation cars, onboard service, and meals. Tickets cost $40-80 (much more than regular trains) but eliminate booking hassles and ensure comfort. Worth it for scenic routes if budget allows.'
                },
                {
                    question: 'Can I book activities and transfers online before arriving?',
                    answer: 'Yes, most reputable operators offer online booking for transfers, tours, and activities. Book through official websites (not random third parties) for security. Recharge Travels offers WhatsApp booking (+94 77 77 21 999) and online reservations. Confirm all bookings before travel.'
                },
                {
                    question: 'Is there a night bus service between cities?',
                    answer: 'Yes, night buses operate on major routes like Colombo-Jaffna, Colombo-Trincomalee, and Colombo-Arugam Bay. Both government and private buses run overnight. Private buses are more comfortable. Book a seat rather than standing for long journeys. Bring a jacket as AC buses get cold.'
                },
                {
                    question: 'How do I charge my phone while traveling?',
                    answer: 'Sri Lanka uses type G plugs (British-style 3-pin) at 230V. Bring a universal adapter. Most hotels have charging facilities. Some tour vehicles have USB chargers. Power banks are useful for long journeys. Buy adapters at airport electronics shops if needed (LKR 300-500).'
                },
                {
                    question: 'What\'s the cheapest way to travel around Sri Lanka?',
                    answer: 'Government buses are cheapest (long distances under LKR 500), followed by third-class trains. Shared tuk-tuks/vans in some areas are economical. Budget travelers can cross the country for under $10/day in transport. However, combining cheap transport with hired car for specific days offers the best value-comfort balance.'
                },
                {
                    question: 'Are there luggage storage facilities at train stations?',
                    answer: 'Colombo Fort station has left luggage facilities (LKR 100-200 per item per day). Major stations may have informal arrangements. Most hotels will store luggage before check-in/after checkout. Some bus stations have cloak rooms. Keep valuables with you always.'
                },
                {
                    question: 'Can I use Google Maps for navigation in Sri Lanka?',
                    answer: 'Yes, Google Maps works well in Sri Lanka with accurate road mapping and traffic information. Download offline maps for areas with poor connectivity. Local addresses might not be precise - use landmarks or coordinates when possible. Waze is also useful in urban areas.'
                },
                {
                    question: 'What about postal services for tourists?',
                    answer: 'Sri Lanka Post offices are everywhere. Postcards to international destinations take 1-3 weeks (LKR 35-50). EMS (express mail) reaches most countries in 5-7 days. Some tourist shops sell stamps and post items for you. Main post office in Colombo Fort area has philatelic services.'
                },
                {
                    question: 'Is there a train service to the airport?',
                    answer: 'Not directly. The Negombo train station is 10km from BIA airport with bus/taxi connections. There\'s no dedicated rail link to the airport. The most practical options are: airport shuttle, taxi/ride-hailing, or hired car. A light rail transit project is planned for future airport connectivity.'
                },
                {
                    question: 'How do I travel to Jaffna in the north?',
                    answer: 'Options include: Express bus (7-8 hours, ~LKR 1,500-2,500), train (8-10 hours, scenic, ~LKR 2,000 first class), domestic flight (1 hour, $100-150), or car with driver (8-9 hours, ~$120-150). Night buses save a day of travel. The train journey through the northern plains is interesting.'
                },
                {
                    question: 'What\'s eSIM availability like in Sri Lanka?',
                    answer: 'Dialog and Mobitel offer eSIM for compatible phones. You can activate before arrival through their apps/websites or at airport counters. This eliminates the need for physical SIM swaps. Ensure your phone is unlocked and eSIM compatible. Useful for dual-SIM use with home number.'
                },
                {
                    question: 'Can I book train tickets at the station on the same day?',
                    answer: 'Yes, but for popular routes (especially Kandy-Ella), same-day tickets for reserved classes often sell out. You can usually get third-class tickets which are unreserved. For guaranteed seating on scenic routes, book 14-30 days ahead. Early morning station visits improve same-day chances.'
                },
                {
                    question: 'Are there package tours available within Sri Lanka?',
                    answer: 'Yes, many operators offer fixed-itinerary packages (7, 10, 14 days) covering main attractions. These include transport, accommodation, and some activities. Custom packages tailored to your interests are also available. Recharge Travels specializes in personalized tours - contact us for a custom itinerary.'
                },
                {
                    question: 'What\'s the ferry schedule to Delft Island?',
                    answer: 'Ferries from Kurikadduwan Jetty (Jaffna) to Delft Island run daily: departures typically at 7am, 9am, 1pm. Return trips at similar intervals. Journey takes about 1 hour. No advance booking needed - arrive early in tourist season. Check locally as schedules may change.'
                },
                {
                    question: 'How do I travel between Colombo and Kandy?',
                    answer: 'Options: Express train (3 hours, scenic, from LKR 600-1,500), bus (3-4 hours, from LKR 400-800 depending on AC), private car via expressway (2.5 hours, ~$60 with driver), or taxi/ride-hailing (~$50-70). The train journey along mountains is memorable. Morning trains are less crowded.'
                },
                {
                    question: 'Can I get mobile data at the airport immediately upon arrival?',
                    answer: 'Yes, Dialog, Mobitel, and Airtel have counters in the BIA arrivals hall open 24/7. SIM activation is instant with passport. Packages include data, calls, and validity from 7-30 days. Staff speak English and can help set up your phone. This is the most convenient option for immediate connectivity.'
                },
                {
                    question: 'What\'s the cost of a three-wheeler (tuk-tuk) ride?',
                    answer: 'Metered rate: approximately LKR 60 for first kilometer, then LKR 50-70 per km. Night rates are higher. Always confirm the driver will use the meter or agree on a fixed price before starting. In tourist areas, expect slightly inflated prices. App-based bookings (PickMe) show fare estimates.'
                }
            ]
        },
        {
            category: 'Safety & Security',
            icon: <Shield className="w-5 h-5" />,
            description: 'Emergency contacts, police assistance, and safety tips',
            questions: [
                {
                    question: 'Is Sri Lanka safe for tourists?',
                    answer: 'Yes, Sri Lanka is considered safe for tourists. The country has a strong tourism industry and visitors are generally welcomed warmly. Standard precautions apply: be aware of your surroundings, secure valuables, and use licensed tour operators. Tourist police operate in major areas.'
                },
                {
                    question: 'What is the IGP WhatsApp hotline for tourists?',
                    answer: 'The Inspector General of Police has established a direct WhatsApp hotline for tourists: +94 77 222 3456. This 24/7 service allows tourists to report crimes, seek assistance, or get information. Messages in English receive priority response. Save this number before traveling.'
                },
                {
                    question: 'What are the emergency numbers in Sri Lanka?',
                    answer: 'Police: 119 | Ambulance/Fire: 110 | Tourist Police: 011-242-1052 | IGP WhatsApp: +94 77 222 3456 | General Emergency: 1990 | Accident Service (Colombo): 011-269-1111. Program these into your phone before traveling. English-speaking operators are usually available.'
                },
                {
                    question: 'Is there a Tourist Police service in Sri Lanka?',
                    answer: 'Yes, Sri Lanka has dedicated Tourist Police units in major tourist areas including Colombo, Galle, Kandy, Negombo, and Arugam Bay. They speak English and are trained to assist foreign visitors. Look for officers in distinctive uniforms or visit tourist police stations for help.'
                },
                {
                    question: 'What should I do if I\'m robbed or pickpocketed?',
                    answer: 'Immediately report to the nearest police station for an official report (needed for insurance claims). Use the IGP WhatsApp hotline (+94 77 222 3456) for quick assistance. Contact your embassy if passport stolen. Cancel credit cards immediately. Tourist police can provide translation assistance.'
                },
                {
                    question: 'Are there areas to avoid in Sri Lanka?',
                    answer: 'Generally, Sri Lanka is safe throughout. Some precautions: Former conflict areas in the north are now accessible but some areas have landmine risks (stay on marked paths). Avoid isolated beaches at night. In Colombo, normal urban caution applies in crowded areas. Local guidance is valuable.'
                },
                {
                    question: 'How common are scams targeting tourists?',
                    answer: 'Common scams include: overcharging by tuk-tuk drivers (use metered or agreed fares), gem scams (never buy gems from strangers), fake tourist guides, "closed temple" diversions, and inflated restaurant prices. Use licensed operators, agree prices beforehand, and trust your instincts.'
                },
                {
                    question: 'Is it safe to travel alone in Sri Lanka?',
                    answer: 'Yes, solo travel is generally safe, including for women. Standard precautions apply: inform someone of your plans, avoid isolated areas at night, use reputable transport, and stay in established accommodations. The local hospitality culture means people often look out for solo travelers.'
                },
                {
                    question: 'Are there any health risks I should be aware of?',
                    answer: 'Dengue fever is present year-round (use mosquito repellent). Tap water isn\'t safe to drink (bottled water is cheap and everywhere). Sunburn is common (use strong SPF). Food hygiene at established restaurants is generally good. No mandatory vaccinations, but consult your doctor about recommended ones.'
                },
                {
                    question: 'How can I protect against dengue fever?',
                    answer: 'Dengue is mosquito-borne (daytime-biting Aedes mosquitoes). Prevention: use DEET-based repellent, wear long sleeves/pants especially morning and evening, use mosquito coils in rooms, stay in accommodations with screens. Symptoms: high fever, severe headache, joint pain. Seek medical attention if suspected.'
                },
                {
                    question: 'What about malaria in Sri Lanka?',
                    answer: 'Sri Lanka was declared malaria-free by WHO in 2016. No malaria prophylaxis is required. However, other mosquito-borne diseases exist (dengue, chikungunya), so mosquito protection is still important. This is a significant health achievement for the country.'
                },
                {
                    question: 'Is the food safe to eat in Sri Lanka?',
                    answer: 'Food at hotels, reputable restaurants, and established street food vendors is generally safe. Tips: eat freshly cooked food, avoid raw salads if uncertain, ensure meat is thoroughly cooked, peel fruits yourself, stick to bottled/filtered water. Most tourists experience no issues. Carry basic stomach medication just in case.'
                },
                {
                    question: 'What medical facilities are available for tourists?',
                    answer: 'Colombo has excellent private hospitals (Nawaloka, Lanka, Durdans, Asiri) with international standards and English-speaking doctors. Regional cities have good private hospitals too. Government hospitals provide free emergency care but are often crowded. Travel insurance with medical coverage is strongly recommended.'
                },
                {
                    question: 'Do I need any vaccinations for Sri Lanka?',
                    answer: 'No vaccinations are mandatory (unless arriving from a yellow fever endemic country). Recommended vaccines: Hepatitis A & B, Typhoid, Tetanus-Diphtheria. Japanese encephalitis if staying in rural areas long-term. COVID-19 vaccination is no longer required. Consult a travel health clinic 4-6 weeks before departure.'
                },
                {
                    question: 'Is it safe to swim in the ocean?',
                    answer: 'Beach safety varies by location and season. Many beaches have strong currents and no lifeguards. Safe swimming beaches include Unawatuna, Nilaveli, and hotel-managed beaches. Always heed local warnings, red flags, and ask locals about conditions. The west coast is generally safer December-April, east coast May-September.'
                },
                {
                    question: 'Are there dangerous animals I should be aware of?',
                    answer: 'Wild elephants: Never approach, especially in national parks. Crocodiles: Present in some rivers and lagoons. Snakes: Several venomous species exist; watch where you step in rural/forest areas. Monitor lizards: Harmless but startling. Blue-ringed octopus in some coastal waters. Sea urchins on some beaches.'
                },
                {
                    question: 'How do I find a good doctor if I get sick?',
                    answer: 'Hotels can recommend English-speaking doctors. Private hospital emergency rooms provide quality care. Insurance hotlines can direct you to approved facilities. In Colombo: Nawaloka, Lanka, and Durdans hospitals are well-regarded. Pharmacies can handle minor ailments; many medications available without prescription.'
                },
                {
                    question: 'Is travel insurance necessary for Sri Lanka?',
                    answer: 'While not mandatory, travel insurance is strongly recommended. It should cover: medical emergencies and evacuation, trip cancellation, lost luggage, and adventure activities if planned. Medical treatment in private hospitals can be expensive. Verify your policy covers specific activities like diving or hiking.'
                },
                {
                    question: 'What should I do in case of a natural disaster?',
                    answer: 'Sri Lanka experiences occasional floods, landslides (hill country in monsoon), and rare cyclones. Follow local news and authority instructions. Tsunami warning systems are in place since 2004. Move to high ground if you feel an earthquake near the coast. Hotels and tour operators will provide guidance.'
                },
                {
                    question: 'Are there any wildlife safety concerns in national parks?',
                    answer: 'Stay in your safari jeep at all times. Elephants can be unpredictable - maintain safe distance. Leopards in Yala are generally not dangerous but don\'t provoke. Crocodiles present in some water bodies. Follow guide instructions strictly. Don\'t feed animals. Early morning game drives may have limited visibility.'
                },
                {
                    question: 'How do I stay safe on the roads as a pedestrian?',
                    answer: 'Traffic can be chaotic. Look both ways multiple times. Vehicles may not stop at zebra crossings. Use pedestrian overpasses in Colombo. Walk facing oncoming traffic on roads without sidewalks. Be especially careful of buses and tuk-tuks which may not yield. Cross with groups when possible.'
                },
                {
                    question: 'Can I drink tap water in Sri Lanka?',
                    answer: 'No, tap water is not safe for drinking. Always use bottled or filtered water. Bottled water is cheap (LKR 50-80) and available everywhere. Ice in quality establishments is usually safe (made from purified water). Brush teeth with bottled water if you have a sensitive stomach.'
                },
                {
                    question: 'What\'s the best mosquito repellent to use?',
                    answer: 'DEET-based repellents (20-30% concentration) are most effective. Picaridin is a good alternative. Natural options like citronella are less effective. Apply to exposed skin especially during dawn and dusk. Mosquito coils work well indoors. Air-conditioned rooms with closed windows are safest at night.'
                },
                {
                    question: 'Is it safe to use ATMs in Sri Lanka?',
                    answer: 'ATMs are generally safe. Use ATMs at banks, inside shopping centers, or hotel lobbies rather than standalone street machines. Cover the keypad when entering PIN. Be aware of your surroundings. Notify your bank before travel to avoid card blocks. Commercial Bank and Sampath Bank ATMs are reliable for foreign cards.'
                },
                {
                    question: 'Are there any areas with landmine risks?',
                    answer: 'Some remote areas in the Northern Province may still have unexploded ordnance from the civil war, though significant clearance has been done. Stick to established roads and paths. Don\'t venture into unmarked areas. If you see warning signs, do not proceed. Main tourist areas in the north (Jaffna city, Point Pedro, etc.) are safe.'
                },
                {
                    question: 'What should solo female travelers know?',
                    answer: 'Sri Lanka is generally safe for solo female travelers. Tips: dress modestly (covering shoulders and knees) especially at religious sites, avoid isolated areas at night, use reputable transport, trust your instincts about situations/people, and stay in well-reviewed accommodations. Most Sri Lankans are respectful and helpful.'
                },
                {
                    question: 'How do I report a scam or tourist issue?',
                    answer: 'Report to: IGP WhatsApp +94 77 222 3456 (quickest), Tourist Police stations in major areas, or local police station. Document everything with photos/receipts. For serious issues, contact your embassy. SLTDA (tourism board) can help with complaints against licensed operators: +94 11 242 6900.'
                },
                {
                    question: 'Are there any food allergies I should communicate?',
                    answer: 'Always communicate allergies clearly. "Nutallergy" and "seafood allergy" are understood. Learn key phrases or write them down. Common Sri Lankan ingredients include coconut, cashews, peanuts in some curries, dried fish/shrimp in many dishes. Restaurant staff are generally accommodating when informed.'
                },
                {
                    question: 'Is it safe to go trekking and hiking?',
                    answer: 'Popular trails like Adam\'s Peak, Ella Rock, and Knuckles Range are safe. Always go with a guide for unmarked trails. Start early for sunrise treks. Carry water, snacks, and fully charged phone. Weather can change quickly in mountains. Leeches are present in wet conditions - use tobacco/salt or leech socks.'
                },
                {
                    question: 'What about LGBTQ+ safety in Sri Lanka?',
                    answer: 'Same-sex relationships are technically illegal in Sri Lanka (colonial-era laws rarely enforced). LGBTQ+ travelers should exercise discretion in public. Tourist areas are generally more accepting. Boutique hotels and international chains are typically welcoming. Avoid public displays of affection between same-sex couples.'
                },
                {
                    question: 'How reliable is emergency medical response?',
                    answer: 'Response varies by location. Colombo has reasonably quick ambulance services. Rural areas may have longer response times. Private ambulance services are available in major cities. Many tourists use taxis to reach hospitals directly. Having travel insurance with emergency assistance ensures access to medical evacuation if needed.'
                },
                {
                    question: 'What should I keep in a basic travel medical kit?',
                    answer: 'Recommended items: rehydration salts (for diarrhea), anti-diarrheal medication, pain relievers, antihistamines, insect repellent, sunscreen, hand sanitizer, Band-Aids and antiseptic, personal medications with prescriptions, motion sickness tablets if prone. Pharmacies are everywhere for anything you forget.'
                },
                {
                    question: 'Are street food and local restaurants safe?',
                    answer: 'Popular, busy street food stalls are usually safe - high turnover means fresh food. Watch that food is cooked fresh and served hot. Avoid pre-made items sitting uncovered. "Kottu" and "short eats" at busy shops are generally fine. Use judgment about hygiene. Even budget travelers rarely have serious issues.'
                },
                {
                    question: 'How do I protect my belongings while traveling?',
                    answer: 'Use hotel safes for passports and valuables. Carry a photocopy of your passport. Use money belts or concealed pouches for cash/cards. Be vigilant in crowds and on public transport. Don\'t display expensive jewelry or electronics unnecessarily. Use luggage locks. Most accommodations are secure but take basic precautions.'
                },
                {
                    question: 'What\'s the sun exposure like and how do I protect myself?',
                    answer: 'Sri Lanka is close to the equator - UV radiation is intense even on cloudy days. Use SPF 30+ sunscreen, reapply after swimming. Wear hats and sunglasses. Take breaks in shade during midday (11am-3pm). Drink plenty of water. Sunburn can happen quickly, especially near water or at altitude.'
                },
                {
                    question: 'Are there jellyfish in Sri Lankan waters?',
                    answer: 'Yes, jellyfish are present seasonally, particularly during monsoon transitions. Most are harmless but some can sting. Ask locals about current conditions. If stung, rinse with seawater (not freshwater), remove tentacles with tweezers, and apply vinegar if available. Seek medical help for severe reactions.'
                },
                {
                    question: 'What if I have a medical emergency at night?',
                    answer: 'Private hospitals in major cities have 24/7 emergency rooms. Dial 110 for ambulance (may be slow). Hotels can arrange private transport to hospitals. Insurance emergency lines operate 24/7. Keep a list of nearest hospitals in each area you\'re visiting. GPS "hospital near me" works well in Sri Lanka.'
                },
                {
                    question: 'Is it safe to participate in adventure sports?',
                    answer: 'Reputable operators offer safe experiences (white water rafting, surfing, diving). Check certifications - PADI for diving, proper insurance for others. Equipment should be well-maintained. Don\'t choose solely on price. Ask about safety records. Many activities are well-established with good track records (Kitulgala rafting, Hikkaduwa diving).'
                },
                {
                    question: 'What precautions should I take during monsoon season?',
                    answer: 'Check weather forecasts daily. Be prepared for sudden heavy rain (carry waterproof layer). Avoid swimming during rough seas. Landslides can affect hill country - follow road closure updates. Flash flooding possible in low areas. The upside: fewer tourists, lower prices, lush green landscapes.'
                },
                {
                    question: 'How do I stay connected with family while traveling?',
                    answer: 'Get a local SIM for cheap data/calls. Use WhatsApp, video calls over WiFi at hotels. Share your itinerary with family. Many GPS tracking apps work with local SIMs. Our driver-guides stay in regular contact for safety. Consider a check-in routine with family members.'
                },
                {
                    question: 'What should I do if I feel unwell while on tour?',
                    answer: 'Inform your driver-guide immediately - they know local medical facilities. For minor issues, pharmacies can help (many medications available over-counter). Rest and hydrate for travel fatigue. Seek medical attention for fever, severe stomach issues, or unusual symptoms. Don\'t tough it out - address health concerns promptly.'
                },
                {
                    question: 'Are there any cultural behaviors that could cause safety issues?',
                    answer: 'Avoid: Photographing military installations. Disrespecting religious sites (turn back to Buddha statues for photos). Arguing publicly or losing temper. Discussing politics or the civil war. Public intoxication. Drug possession (severe penalties). Cultural sensitivity generally keeps tourists safe and welcomed.'
                },
                {
                    question: 'What\'s the situation with stray dogs in Sri Lanka?',
                    answer: 'Stray dogs are common but usually not aggressive. Avoid feeding them or making sudden movements near territorial dogs. Rabies exists in Sri Lanka - if bitten, clean wound immediately and seek medical attention for post-exposure prophylaxis. Pre-exposure rabies vaccination is recommended for extended stays in rural areas.'
                },
                {
                    question: 'How safe are budget guesthouses and hostels?',
                    answer: 'Well-reviewed budget accommodations are generally safe. Check recent reviews on booking platforms. Most have basic security. Use your own locks on valuables. Socialize in common areas for safety information from fellow travelers. Lonely Planet, Hostelworld, and Booking.com reviews are reliable indicators.'
                },
                {
                    question: 'What\'s the protocol for water activities safety?',
                    answer: 'Always use reputable operators for whale watching, diving, snorkeling, surfing. Life jackets should be provided and worn. Check boat condition before boarding. Inform someone of your plans. Don\'t overestimate your swimming ability. Respect marine life (don\'t touch coral, maintain distance from wildlife).'
                },
                {
                    question: 'Is it safe to camp or stay in eco-lodges in remote areas?',
                    answer: 'Established eco-lodges and glamping sites are safe and popular. Wild camping isn\'t recommended due to wildlife, unclear land ownership, and lack of facilities. Book through official channels. Knuckles Range, Sinharaja, and national park buffer zones have authorized camping with guides. Research and book properly.'
                },
                {
                    question: 'What do I do if I lose my passport in Sri Lanka?',
                    answer: 'Report to police immediately for a report. Contact your embassy for emergency travel documents. You\'ll need: police report, passport photos, proof of citizenship if possible. Most embassies can issue emergency passports within 1-3 days. Keep passport photocopies and digital copies separate from the original.'
                },
                {
                    question: 'How do temples and religious sites handle security?',
                    answer: 'Major temples (Temple of the Tooth, etc.) have security screening similar to airports. Remove shoes before entering. Dress modestly (cover shoulders and knees). No photography in certain areas. Security is for protection of sacred items and respectful conduct, not because of any threat to visitors.'
                }
            ]
        },
        {
            category: 'Health & Medical',
            icon: <Heart className="w-5 h-5" />,
            description: 'Medical facilities, vaccinations, and health advice',
            questions: [
                {
                    question: 'Do I need health insurance for Sri Lanka?',
                    answer: 'While not mandatory, comprehensive travel health insurance is strongly recommended. It should cover medical emergencies, hospitalization, and medical evacuation. Private hospital care in Sri Lanka can be expensive without insurance. Many policies also cover trip cancellation and lost belongings.'
                },
                {
                    question: 'Where can I find pharmacies in Sri Lanka?',
                    answer: 'Pharmacies are abundant throughout Sri Lanka, even in small towns. Major chains include Lanka Hospitals Pharmacy, State Pharmaceuticals Corporation, and Osu Sala. Most common medications are available without prescription. Pharmacists often speak English and can recommend over-the-counter treatments.'
                },
                {
                    question: 'What should I know about Ayurvedic treatments?',
                    answer: 'Sri Lanka has a rich Ayurvedic tradition. Authentic treatments can be found at licensed Ayurvedic resorts and clinics. Inform practitioners of any medical conditions. Full Ayurvedic programs typically last 1-3 weeks. Be wary of unlicensed practitioners. The government regulates Ayurvedic medicine.'
                },
                {
                    question: 'Is it safe to get dental treatment in Sri Lanka?',
                    answer: 'Yes, Sri Lanka has qualified dentists, especially in Colombo and major cities. Private dental clinics maintain good standards at fraction of Western prices. Many offer cosmetic dentistry. Dental tourism is growing. Ensure the clinic is properly equipped and the dentist is registered.'
                },
                {
                    question: 'What\'s the risk of tropical diseases?',
                    answer: 'Main concerns: Dengue fever (year-round, preventable with mosquito protection), typhoid (reduced by careful food/water hygiene), hepatitis A (vaccine recommended). Malaria has been eliminated. Japanese encephalitis risk is low for short-term tourists. Standard travel precautions significantly reduce all risks.'
                },
                {
                    question: 'How do I handle altitude sickness in the hill country?',
                    answer: 'Sri Lanka\'s highlands reach only 2,500m (8,200ft), so severe altitude sickness is rare. Some people may experience mild breathlessness climbing Adam\'s Peak (2,243m). Take it slow, stay hydrated, and rest if feeling unwell. True altitude sickness is not a significant concern for Sri Lanka travel.'
                },
                {
                    question: 'Can I get prescription medications in Sri Lanka?',
                    answer: 'Many prescription medications are available over-the-counter in Sri Lanka. Bring a copy of your prescription for any controlled medications. Medications may have different brand names but same active ingredients. For specific medications, check availability before travel. Pharmacists are helpful in finding equivalents.'
                },
                {
                    question: 'What about mental health support while traveling?',
                    answer: 'Private hospitals in Colombo have psychiatry departments. Some international counseling services operate remotely. Travel can be stressful - don\'t hesitate to slow down if needed. Crisis lines are available in English. Wellness retreats offer meditation and relaxation programs that can support mental wellbeing.'
                },
                {
                    question: 'Is it safe to swim in freshwater bodies?',
                    answer: 'Exercise caution: Some lakes and rivers may have pollution, crocodiles, or strong currents. Avoid swimming in unknown bodies of water. Some hotel pools near waterways use treated water. Check locally about safe swimming spots. Victoria Reservoir and some mountain streams are generally safe but verify current conditions.'
                },
                {
                    question: 'What about snake bite first aid?',
                    answer: 'Sri Lanka has several venomous snakes (Russell\'s Viper, Cobra, Kraits). If bitten: Stay calm, immobilize the affected limb, remove jewelry, get to a hospital immediately. Don\'t cut, suck, or apply tourniquet. Take a photo of the snake if safe to do so. Anti-venom is available at major hospitals.'
                }
            ]
        },
        {
            category: 'Money & Finance',
            icon: <DollarSign className="w-5 h-5" />,
            description: 'Currency, ATMs, payments, and budgeting',
            questions: [
                {
                    question: 'What currency is used in Sri Lanka?',
                    answer: 'The Sri Lankan Rupee (LKR) is the official currency. As of late 2024, approximately: 1 USD = 320 LKR, 1 EUR = 340 LKR, 1 GBP = 400 LKR. Exchange rates fluctuate - check current rates before travel. Both notes (10-5000 LKR) and coins (1-10 LKR) are in circulation.'
                },
                {
                    question: 'Where should I exchange money?',
                    answer: 'Best rates: Licensed money changers in Colombo (especially Pettah area), airport exchange (convenient but slightly lower rates), and banks. Avoid street money changers. Hotels offer poor rates. Banks require passport for transactions. Exchange enough for initial days at airport; get better rates in city.'
                },
                {
                    question: 'Are credit cards widely accepted?',
                    answer: 'Major credit cards (Visa, Mastercard) are accepted at hotels, larger restaurants, supermarkets, and tourist-oriented shops. American Express is less common. Smaller establishments, local restaurants, and rural areas are cash-only. Always carry sufficient cash when leaving main tourist areas.'
                },
                {
                    question: 'Are ATMs easy to find?',
                    answer: 'ATMs are plentiful in cities, towns, and tourist areas. Most accept foreign cards (look for Visa/Mastercard/Plus/Cirrus logos). Maximum withdrawal typically LKR 40,000-60,000 per transaction. ATM fees vary (usually $2-5 per transaction). Commercial Bank and Sampath Bank ATMs are reliable for international cards.'
                },
                {
                    question: 'Should I bring USD or Euros?',
                    answer: 'US Dollars are most widely recognized and give best exchange rates. Euros and British Pounds are also easily exchanged. Bring clean, recent notes (torn or old bills may be rejected). Some hotels quote in USD. Carrying a mix of currencies provides flexibility. Smaller denominations are useful for initial expenses.'
                },
                {
                    question: 'How much should I budget per day in Sri Lanka?',
                    answer: 'Budget travelers: $30-50/day (basic guesthouses, local food, public transport). Mid-range: $75-150/day (comfortable hotels, restaurant meals, some activities). Luxury: $200+/day (boutique hotels, private transport, premium experiences). Sri Lanka offers excellent value compared to many destinations.'
                },
                {
                    question: 'Is tipping expected in Sri Lanka?',
                    answer: 'Tipping is appreciated but not obligatory. Guidelines: Restaurants 10% if not included, hotel porter LKR 200-500, driver-guides $5-10/day, safari jeep drivers LKR 500-1000, spa therapists 10%. Round up taxi/tuk-tuk fares. Locals in service industries appreciate tips but won\'t expect Western-level amounts.'
                },
                {
                    question: 'What is the 10% service charge on bills?',
                    answer: 'Many hotels and upscale restaurants add a 10% service charge automatically. This theoretically goes to staff, so additional tipping isn\'t required (though still appreciated). Check if "SC" or "Service Charge" is listed before adding a tip. Budget establishments typically don\'t add this charge.'
                },
                {
                    question: 'Can I use contactless payment?',
                    answer: 'Contactless payment (tap-to-pay) is available at some larger establishments, hotels, and modern cafes, but is not universal. Apple Pay and Google Pay work where contactless is accepted. Cash and chip-and-PIN remain more reliable payment methods. Always have backup cash.'
                },
                {
                    question: 'How do I handle money in remote areas?',
                    answer: 'Withdraw sufficient cash before visiting remote areas (national parks, small villages, mountains). ATMs may be scarce or unreliable outside towns. Local businesses rarely accept cards. Keep small denominations for purchases - breaking LKR 5000 notes can be difficult in small shops.'
                },
                {
                    question: 'Are there money transfer services available?',
                    answer: 'Western Union and MoneyGram have agents throughout Sri Lanka. Banks offer international transfers (slower, more documentation). Modern services like Wise (TransferWise) can transfer to local bank accounts. For emergencies, money can be received quickly through established agents.'
                },
                {
                    question: 'What about bargaining and haggling?',
                    answer: 'Bargaining is expected at markets, with tuk-tuk drivers, and souvenir shops. Fixed prices apply at supermarkets, restaurants, and hotels. Start at 50% of asking price and negotiate up. Be friendly and good-humored. If you agree on a price, honor it. Bargaining over tiny amounts is considered poor form.'
                },
                {
                    question: 'How do I avoid being overcharged as a tourist?',
                    answer: 'Research typical prices beforehand. Use metered tuk-tuks or ride-hailing apps. Check restaurant prices before ordering. Shop at fixed-price supermarkets for souvenirs. Ask hotel staff about reasonable costs. Don\'t feel pressured into purchases. A little overcharging is common; excessive amounts warrant walking away.'
                },
                {
                    question: 'What\'s the best way to carry money safely?',
                    answer: 'Use a money belt or hidden pouch for large amounts. Keep daily cash in an accessible pocket/wallet. Distribute money across different places. Use hotel safe for excess cash and documents. Avoid displaying large amounts publicly. ATM withdrawals in smaller amounts reduce risk.'
                },
                {
                    question: 'Can I pay for things in US Dollars?',
                    answer: 'Some hotels, tourist shops, and tour operators accept USD (often at unfavorable rates). Most everyday transactions require rupees. Government establishments (train tickets, national park fees) require LKR. It\'s best to exchange enough rupees for daily use and keep USD for emergencies or large hotel payments.'
                },
                {
                    question: 'Are there any hidden costs I should know about?',
                    answer: 'Watch for: Government taxes (VAT 15%) may be added to bills, service charges (10%) at hotels/restaurants, entry fees to temples and sites (often higher for foreigners), camera fees at some locations, "donations" solicited at religious sites, tipping expectations. Budget an extra 15-20% above listed prices.'
                },
                {
                    question: 'What about duty-free allowances?',
                    answer: 'Arriving passengers can bring: 1.5L alcohol, 200 cigarettes, gifts up to $250 value, and personal effects. Departing, you can take Rs. 250,000 or equivalent. Duty-free shops at airport offer alcohol, electronics, and cosmetics. Keep receipts for expensive purchases in case customs asks.'
                },
                {
                    question: 'How much cash should I carry daily?',
                    answer: 'Typically LKR 5,000-15,000 per day ($15-45) depending on plans. More for days with entrance fees, activities, or shopping. Keep hotel money separate from daily cash. ATMs allow top-ups when needed. Our driver-guides can advise on daily budget requirements for specific areas.'
                },
                {
                    question: 'Is travel in Sri Lanka cheap or expensive?',
                    answer: 'Sri Lanka offers excellent value. Accommodation ranges from $10 guesthouses to $500+ luxury resorts. Local meals from $2-5, tourist restaurants $10-25. Public transport is very cheap. Activities and tours are reasonably priced. Overall, mid-range travel costs much less than Southeast Asia or Europe while maintaining quality.'
                },
                {
                    question: 'Do banks have special services for tourists?',
                    answer: 'Major banks (Commercial, Sampath, HNB) handle foreign exchange and international card cash advances. Some branches in tourist areas have English-speaking staff. Banks are open Mon-Fri 9am-3pm (some Saturday mornings). Passport required for all banking transactions.'
                }
            ]
        },
        {
            category: 'Weather & Seasons',
            icon: <Sun className="w-5 h-5" />,
            description: 'Best time to visit, monsoons, and climate information',
            questions: [
                {
                    question: 'What\'s the best time to visit Sri Lanka?',
                    answer: 'Sri Lanka is a year-round destination! December-March: Best for west/south coast and hill country. May-September: Best for east coast and cultural triangle. The two monsoons (southwest May-Sept, northeast Oct-Jan) affect opposite coasts, so there\'s always a sunny side. Peak tourism: December-April.'
                },
                {
                    question: 'What are the two monsoon seasons?',
                    answer: 'Southwest (Yala) Monsoon: May-September, affects west and south coasts and central highlands. Northeast (Maha) Monsoon: October-January, affects east and north coasts. During monsoon, affected areas see heavy rain and rough seas, while opposite coast remains dry and sunny.'
                },
                {
                    question: 'Can I visit Sri Lanka during monsoon season?',
                    answer: 'Yes! You simply visit the "dry" side. During southwest monsoon (May-Sept), head to the east coast (Trincomalee, Arugam Bay). During northeast monsoon (Oct-Jan), the west/south coasts are perfect. Hill country can be visited year-round with some rain. Monsoon brings lush greenery and fewer tourists.'
                },
                {
                    question: 'What\'s the temperature like in Sri Lanka?',
                    answer: 'Coastal areas: Year-round warm, 25-32°C (77-90°F). Colombo: 27-31°C with high humidity. Hill country: Cooler, 15-25°C (59-77°F) in Kandy, 10-20°C (50-68°F) in Nuwara Eliya. Pack layers for the highlands. Nights in the mountains can be chilly. Air conditioning is welcome in coastal lowlands.'
                },
                {
                    question: 'What should I pack for different regions?',
                    answer: 'Coastal areas: Light, breathable clothing, swimwear, sunhat, sunglasses, strong sunscreen. Hill country: Layers, light jacket, long pants, closed shoes for trekking. Everywhere: Modest clothing for temples (covering shoulders and knees), rain jacket or umbrella, comfortable walking shoes, mosquito repellent.'
                },
                {
                    question: 'How does weather affect wildlife viewing?',
                    answer: 'Yala National Park: Best Feb-July (dry season, animals gather at water holes). Elephant gatherings at Minneriya: Aug-October (spectacular). Whale watching Mirissa: November-April. Bird migrations: Winter months. Some parks close during heavy monsoon. Weather affects animal behavior and visibility.'
                },
                {
                    question: 'Is Nuwara Eliya really that cold?',
                    answer: 'By Sri Lankan standards, yes! Nuwara Eliya (1,890m altitude) averages 10-20°C. Frost is possible on cold nights. You\'ll need warm clothing, especially mornings and evenings. Hotels may not have heating (request extra blankets). The cool climate is refreshing after humid lowlands. Pack a fleece or light jacket.'
                },
                {
                    question: 'When is the best time for beach holidays?',
                    answer: 'West/South coast (Hikkaduwa, Galle, Mirissa): November-April (calm seas, sunny). East coast (Trincomalee, Arugam Bay): May-September (surf season, calm waters). Shoulder months can be good with occasional rain. Check conditions for specific beaches before swimming.'
                },
                {
                    question: 'Does it rain every day during monsoon?',
                    answer: 'Not necessarily. Monsoon rain often comes in afternoon/evening bursts rather than all-day downpours. You can still have sunny mornings. Intensity varies by year. Some days are completely dry. Rain shouldn\'t deter travel - it\'s part of the tropical experience and brings lush landscapes.'
                },
                {
                    question: 'What\'s the humidity like?',
                    answer: 'Coastal areas and Colombo have high humidity (70-90%), making temperatures feel hotter. Hill country is much more comfortable with lower humidity. Stay hydrated, use air-conditioned transport, and plan strenuous activities for cooler morning hours. Humidity can affect camera equipment and electronics.'
                },
                {
                    question: 'When is the surf season in Sri Lanka?',
                    answer: 'South coast (Hikkaduwa, Mirissa, Weligama): November-April with consistent waves. East coast (Arugam Bay - world-famous): April-October with the best swells. Different breaks suit different levels. Water is warm year-round. Surfboard rentals and lessons available at both coasts during their respective seasons.'
                },
                {
                    question: 'How does weather vary across the country?',
                    answer: 'Sri Lanka has diverse microclimates. Dry zone (north, east, southeast) is hotter and drier. Wet zone (west, south, central highlands) receives more rainfall. The cultural triangle (Sigiriya, Anuradhapura) can be very hot in dry season. Coastal breeze moderates beach areas. Plan diverse itineraries around seasonal patterns.'
                },
                {
                    question: 'What about inter-monsoon periods?',
                    answer: 'April and October-November are inter-monsoon periods with unpredictable weather nationwide. Short, sharp thunderstorms possible anywhere. These transitions can still offer good travel conditions with fewer tourists. Flexibility helps - have backup plans for weather-dependent activities.'
                },
                {
                    question: 'When is peak tourist season?',
                    answer: 'Peak season: December-March (Christmas, New Year, European winter). This period sees highest prices and most crowds, especially at beach resorts and popular sites. Book well in advance. Shoulder seasons (April, September-November) offer good weather with fewer tourists and better rates.'
                },
                {
                    question: 'What about cyclones and extreme weather?',
                    answer: 'Cyclones are rare in Sri Lanka but possible during monsoon seasons. The Bay of Bengal side (east coast) is more vulnerable. Weather systems are monitored and warnings issued. Follow local news and hotel guidance if severe weather approaches. Major cyclones affecting tourists are very uncommon.'
                },
                {
                    question: 'How does climate affect the tea country experience?',
                    answer: 'Tea plantations are beautiful year-round but have distinct seasons. "Quality season" (Feb-March) produces the finest teas. Monsoon months bring mist and rain creating atmospheric scenery. Morning mists are common - afternoon is usually clearer for views. Cool climate makes hiking comfortable anytime.'
                },
                {
                    question: 'Is there a dry season in the hill country?',
                    answer: 'Hill country receives rain from both monsoons but has drier periods in January-February and August-September. Even in "dry" periods, expect some mist and occasional showers. The mountains create their own weather patterns. Early mornings are typically clearest for photography and views.'
                },
                {
                    question: 'What\'s the UV index like in Sri Lanka?',
                    answer: 'Very high! Sri Lanka\'s location near the equator means UV levels of 10-12 (extreme) year-round. Sunburn can occur in 10-15 minutes without protection. Use SPF 30+ sunscreen, wear hats and UV-blocking sunglasses, seek shade during midday. UV is strong even on cloudy days.'
                },
                {
                    question: 'How does weather impact travel schedules?',
                    answer: 'Heavy monsoon rain can cause: road delays due to flooding or landslides in hills, rough seas affecting whale watching and boat trips, some national park sections closing, and train delays. Build flexibility into itineraries during monsoon. Most journeys proceed normally with minor adjustments.'
                },
                {
                    question: 'When can I see rainbows and mist in the hills?',
                    answer: 'The tea country\'s misty conditions are most common during monsoon months (May-Sept and Oct-Jan depending on area) and in early mornings year-round. The iconic train journey through clouds is more likely in wetter months. Rainbow opportunities abound when sun breaks through after rain showers.'
                }
            ]
        },
        {
            category: 'Culture & Etiquette',
            icon: <Globe className="w-5 h-5" />,
            description: 'Religious sites, dress code, and local customs',
            questions: [
                {
                    question: 'What should I wear when visiting temples?',
                    answer: 'Temple dress code: Cover shoulders and knees (no tank tops, shorts, or short skirts). White or light colors are preferred. Remove shoes and hats before entering. Some temples provide sarongs to borrow or rent. Carry a scarf or sarong for spontaneous temple visits. Dress respectfully out of consideration for worshippers.'
                },
                {
                    question: 'Can I take photos inside Buddhist temples?',
                    answer: 'Generally yes, but rules vary. Never pose with your back to Buddha statues - this is highly disrespectful. Flash photography may be prohibited in certain shrines. Ask permission before photographing monks. Don\'t photograph during prayers or offerings. Some ancient temples charge camera fees.'
                },
                {
                    question: 'What are the main religions in Sri Lanka?',
                    answer: 'Buddhism (70%), Hinduism (12%), Islam (10%), Christianity (8%). Sri Lanka has significant religious diversity with major festivals from all traditions celebrated. You\'ll see Buddhist temples, Hindu kovils, mosques, and churches throughout the island. Religious tolerance is generally strong.'
                },
                {
                    question: 'What are important Buddhist festivals?',
                    answer: 'Key Buddhist festivals: Vesak (May full moon - Buddha\'s birth, enlightenment, death), Poson (June - Buddhism arriving in Sri Lanka), Esala Perahera (July/August - spectacular Kandy procession), Poya Days (monthly full moon holidays). Many businesses close on Poya days; alcohol sales restricted.'
                },
                {
                    question: 'Is it okay to drink alcohol in Sri Lanka?',
                    answer: 'Alcohol is legal and available in hotels, restaurants, and liquor stores. However, it\'s not sold on Poya (full moon) days, and some areas may be dry. Drinking in public places is frowned upon. Being visibly drunk is considered disrespectful. Moderate consumption in appropriate settings is fine.'
                },
                {
                    question: 'How should I interact with Buddhist monks?',
                    answer: 'Show respect: Don\'t touch monks, women should not hand items directly to monks (use an intermediary or place on a surface), don\'t sit higher than monks, stand when monks enter or pass, don\'t point feet at monks. Photographs are usually okay with permission. Monks are happy to chat and answer questions.'
                },
                {
                    question: 'What greetings should I use?',
                    answer: 'A friendly "hello" works in tourist areas. Traditional greeting: Place palms together at chest level and say "Ayubowan" (may you have a long life). This is appreciated but not expected from foreigners. Sinhalese "Kohomada?" (How are you?) or Tamil "Vanakkam" shows cultural interest.'
                },
                {
                    question: 'Are there topics I should avoid discussing?',
                    answer: 'Avoid: The civil war (ended 2009) unless the local person brings it up, ethnic/religious tensions, political criticism, comparisons to India. Sri Lankans are generally welcoming but these remain sensitive topics. Focus on positive aspects - food, beauty, culture, cricket!'
                },
                {
                    question: 'What are meal customs in Sri Lanka?',
                    answer: 'Traditionally, Sri Lankans eat with their right hand (left is considered unclean). In tourist restaurants, cutlery is standard. Rice and curry is the main meal. Lunch is often the main meal for locals. Sharing food is common and appreciated. It\'s polite to try everything offered.'
                },
                {
                    question: 'Is it rude to refuse food offered?',
                    answer: 'Declining food/drink can seem impolite, especially in homes. A small taste shows appreciation even if you\'re not hungry. For dietary restrictions, explain kindly and the host will understand. Taking a small amount and leaving some is better than outright refusal. Hospitality is important in Sri Lankan culture.'
                },
                {
                    question: 'Can I visit Hindu temples?',
                    answer: 'Yes, visitors are welcome at most Hindu kovils. Remove shoes, dress modestly (covering shoulders and knees), and be respectful during prayers. Non-Hindus may not be allowed into inner sanctums. Photography rules vary. Major kovils like Nallur in Jaffna are particularly welcoming to visitors.'
                },
                {
                    question: 'What about visiting mosques and churches?',
                    answer: 'Mosques: Remove shoes, dress very modestly (women may need head covering), best to visit outside prayer times. Churches: Open to visitors, dress respectfully, photography usually permitted except during services. Historic churches like Wolvendaal and colonial-era mosques are architecturally interesting.'
                },
                {
                    question: 'What\'s considered impolite in Sri Lanka?',
                    answer: 'Public displays of affection (brief hand-holding okay), pointing with feet or showing soles of feet, touching someone\'s head, shouting or losing temper publicly, pointing at people, eating with left hand, revealing clothing, disrespecting religious sites. Sri Lankans are forgiving of unintentional cultural mistakes.'
                },
                {
                    question: 'How important is punctuality in Sri Lanka?',
                    answer: '"Sri Lankan time" can be relaxed - don\'t be surprised if things don\'t start exactly on schedule. Formal meetings aim for punctuality. Social gatherings often start late. Tour drivers and guides are usually punctual for tourists. Be flexible and patient with local timing differences.'
                },
                {
                    question: 'Can I photograph local people?',
                    answer: 'Always ask permission before photographing individuals, especially close-up portraits. Most people agree when asked politely. Don\'t photograph people in vulnerable situations. Children should only be photographed with parental consent. Fishermen, craftspeople, and vendors are often happy subjects.'
                },
                {
                    question: 'What is the head-wobble gesture?',
                    answer: 'The distinctive South Asian head-wobble (side-to-side) generally means "yes" or acknowledgment in Sri Lanka. It can also indicate "okay," "I understand," or "maybe." Context matters. It\'s not a "no." You\'ll get used to it quickly and may find yourself doing it!'
                },
                {
                    question: 'Are there LGBT+ specific considerations?',
                    answer: 'Homosexuality is technically illegal (colonial-era law) though rarely enforced. Sri Lankan society is generally conservative about sexuality. Public displays of affection between same-sex couples draw attention. Many LGBT+ travelers visit without issues by being discreet. Boutique hotels and tourist areas are more accepting.'
                },
                {
                    question: 'What gifts are appropriate to give?',
                    answer: 'Nice gifts: Quality chocolates, items from your home country, souvenirs, fruits. For temple visits: Flowers, incense, lotus buds, small offerings. Avoid: Leather items for Buddhist/Hindu recipients, alcohol for Muslims/strict Buddhists. Give and receive with both hands or right hand. Gifts are often not opened immediately.'
                },
                {
                    question: 'How do I show respect at ancient sites?',
                    answer: 'Don\'t climb on ruins or Buddha statues. Follow roped-off areas. Don\'t touch ancient paintings or carvings. Use designated photography spots. Keep voices low. Remove shoes where indicated. Take rubbish with you. Follow guide instructions. UNESCO sites have specific preservation rules.'
                },
                {
                    question: 'What should I know about the caste system?',
                    answer: 'While caste historically existed in Sri Lanka, it\'s less pronounced than in some other South Asian countries. Urban areas and tourist contexts are largely caste-neutral. Traditional communities may maintain caste awareness in personal matters. As a tourist, you won\'t directly encounter caste-related situations.'
                }
            ]
        },
        {
            category: 'Contact & Support',
            icon: <Phone className="w-5 h-5" />,
            description: 'Emergency numbers, embassy contacts, and getting help',
            questions: [
                {
                    question: 'How do I contact Recharge Travels?',
                    answer: 'WhatsApp (fastest): +94 77 77 21 999 | Phone: +94 77 77 21 999 | Email: info@rechargetravels.com | Website: www.rechargetravels.com | We respond within hours and offer 24/7 support during your tour. Follow us on Facebook and Instagram @rechargetravels for travel inspiration.'
                },
                {
                    question: 'What are the main emergency numbers?',
                    answer: 'Police Emergency: 119 | Ambulance & Fire: 110 | Tourist Police: 011-242-1052 | IGP WhatsApp: +94 77 222 3456 | General Emergency: 1990 | Traffic Police: 011-244-4444 | Save these in your phone before traveling. English operators are usually available.'
                },
                {
                    question: 'Where are the major embassies located?',
                    answer: 'Most embassies are in Colombo 3, 5, and 7. US Embassy: 011-249-8500 | UK High Commission: 011-539-0639 | Australian High Commission: 011-246-3200 | Canadian High Commission: 011-522-6232 | German Embassy: 011-258-0431. Find your embassy contact before traveling.'
                },
                {
                    question: 'Is there 24-hour medical helpline?',
                    answer: 'Hospital emergency rooms operate 24/7. Suwa Seriya ambulance: 1990 (emergency medical). Hospital direct lines: Nawaloka 011-254-4444, Lanka Hospital 011-554-3000, Durdans 011-541-0000, Asiri 011-452-3300. Medical emergencies receive immediate attention.'
                },
                {
                    question: 'How can I report a crime or safety concern?',
                    answer: 'Use IGP WhatsApp +94 77 222 3456 for immediate assistance or call 119. Go to nearest police station for formal reports. Tourist Police stations in major areas have English-speaking officers. Take photos and keep documents as evidence. Get a police report for insurance claims.'
                },
                {
                    question: 'Where is the Department of Immigration?',
                    answer: 'Department of Immigration and Emigration: 41 Ananda Rajakaruna Mawatha, Colombo 10. Phone: 011-532-9700. Hours: Monday-Friday 8:30am-4:00pm. Go here for visa extensions. Arrive early to avoid queues. Bring passport, photos, and completed forms.'
                },
                {
                    question: 'How do I contact SLTDA for tourism complaints?',
                    answer: 'Sri Lanka Tourism Development Authority: 80 Galle Road, Colombo 3. Phone: 011-242-6900 | Email: feedback@srilanka.travel | Website: www.sltda.gov.lk. Report issues with licensed operators, guides, or tourism services. They can mediate disputes and investigate complaints.'
                },
                {
                    question: 'Is there a national tourist helpline?',
                    answer: 'The government offers tourist assistance through: Tourist Police (011-242-1052), SLTDA hotline (011-242-6900), and the IGP WhatsApp service (+94 77 222 3456). Airport tourist information desks provide guidance on arrival. Many hotels have concierge services for tourist assistance.'
                },
                {
                    question: 'How do I contact my airline in Sri Lanka?',
                    answer: 'Major airlines have Colombo offices: SriLankan Airlines 011-777-1979, Emirates 011-230-0001, Singapore Airlines 011-230-0757, Qatar Airways 011-230-2701. Airport information: 011-225-2861. Airlines can assist with rebooking, lost luggage, and flight queries. Airport representatives are available 24 hours.'
                },
                {
                    question: 'What about roadside assistance?',
                    answer: 'AAC (Automobile Association of Ceylon): 011-242-1528. Insurance companies often provide roadside assistance. Rental cars come with operator contact numbers. In case of breakdown, your driver or rental company should be your first contact. Police can assist in serious situations: 119.'
                }
            ]
        }
    ];

    const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
        const globalIndex = categoryIndex * 1000 + questionIndex;
        setOpenIndex(openIndex === globalIndex ? null : globalIndex);
    };

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) {
            return activeCategory
                ? faqCategories.filter(cat => cat.category === activeCategory)
                : faqCategories;
        }

        const query = searchQuery.toLowerCase();
        return faqCategories.map(category => ({
            ...category,
            questions: category.questions.filter(
                q => q.question.toLowerCase().includes(query) ||
                     q.answer.toLowerCase().includes(query)
            )
        })).filter(category => category.questions.length > 0);
    }, [searchQuery, activeCategory, faqCategories]);

    const totalQuestions = faqCategories.reduce((acc, cat) => acc + cat.questions.length, 0);

    return (
        <>
            <Helmet>
                <title>200+ FAQs for Sri Lanka Travel 2025-2026 | Recharge Travels</title>
                <meta name="description" content="Comprehensive Sri Lanka travel FAQ with 200+ questions covering driving permits, visa requirements, transport, safety, health, money, weather, and culture. Updated for 2025-2026." />
                <meta name="keywords" content="Sri Lanka travel FAQ, tourist visa Sri Lanka 2025, IDP Sri Lanka, driving permit airport, Sri Lanka safety, IGP WhatsApp hotline, visa-free countries Sri Lanka, train booking Sri Lanka, SIM card tourist" />
                <meta property="og:title" content="200+ FAQs for Sri Lanka Travel 2025-2026 | Recharge Travels" />
                <meta property="og:description" content="Comprehensive Sri Lanka travel FAQ with 200+ questions. Updated with August 2025 driving permits, visa-free entry for 7 countries, and IGP WhatsApp hotline." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.rechargetravels.com/faq" />
                <meta property="og:image" content="https://www.rechargetravels.com/logo-v2.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href="https://www.rechargetravels.com/faq" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "Do I need an International Driving Permit (IDP) to drive in Sri Lanka?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes, all foreign visitors must carry a valid IDP along with their home country driving license to drive legally in Sri Lanka. The IDP must be obtained before arrival from your home country's authorized motoring association."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Can I get a temporary driving permit at the airport?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes! As of August 2025, the Department of Motor Traffic operates a counter at Bandaranaike International Airport (BIA) where tourists can obtain a Recognition Permit. This service operates 24/7 and requires your valid foreign driving license, passport, and a small fee (approximately LKR 5,000)."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Can tourists drive three-wheelers (tuk-tuks) in Sri Lanka?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "No. As of 2024, tourists are prohibited from driving three-wheelers in Sri Lanka. This ban was implemented for safety reasons due to several accidents involving foreign drivers unfamiliar with local driving conditions."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Which countries have visa-free entry to Sri Lanka?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "As of 2024, citizens of India, China, Indonesia, Thailand, Malaysia, Japan, and Russia can enter Sri Lanka visa-free for up to 30 days. This policy was introduced to boost tourism and can be extended by 60 days at the Department of Immigration."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How do I apply for the Sri Lanka ETA?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Apply online at www.eta.gov.lk or through the official Sri Lanka ETA app. You'll need a valid passport, travel dates, and payment (typically $50 for most nationalities). Processing takes 24-48 hours normally."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What is the IGP WhatsApp hotline for tourists?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "The Inspector General of Police has established a direct WhatsApp hotline for tourists: +94 77 222 3456. This 24/7 service allows tourists to report crimes, seek assistance, or get information. Messages in English receive priority response."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Is Sri Lanka safe for tourists?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes, Sri Lanka is considered safe for tourists. The country has a strong tourism industry and visitors are generally welcomed warmly. Standard precautions apply: be aware of your surroundings, secure valuables, and use licensed tour operators."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How do I book train tickets in Sri Lanka?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Book online at www.railway.gov.lk or through the Sri Lanka Railways app. For popular routes like Colombo-Kandy-Ella, book 30 days in advance as observation deck seats sell out quickly."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How do I get a local SIM card in Sri Lanka?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Buy SIM cards at the airport arrival hall (Dialog, Mobitel, Airtel counters) or any mobile shop in town. You'll need your passport for registration. Tourist SIM packages typically include data, calls, and SMS for 30 days."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What's the best time to visit Sri Lanka?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Sri Lanka is a year-round destination! December-March: Best for west/south coast and hill country. May-September: Best for east coast and cultural triangle. The two monsoons affect opposite coasts, so there's always a sunny side."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What currency is used in Sri Lanka?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "The Sri Lankan Rupee (LKR) is the official currency. As of late 2024, approximately: 1 USD = 320 LKR, 1 EUR = 340 LKR, 1 GBP = 400 LKR."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What are the emergency numbers in Sri Lanka?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Police: 119 | Ambulance/Fire: 110 | Tourist Police: 011-242-1052 | IGP WhatsApp: +94 77 222 3456 | General Emergency: 1990"
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How much does a Sri Lanka tour cost?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Sri Lanka tours range from $50-200 per day. Budget tours start around $50-80/day, mid-range $100-150/day, luxury $200-500/day. A typical 7-day tour costs $500-2000 including accommodation, transport, and activities."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What vaccinations do I need for Sri Lanka?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "No mandatory vaccinations for most travelers. Recommended: Hepatitis A, Typhoid, Tetanus-Diphtheria. Consider Hepatitis B, Japanese Encephalitis, Rabies for extended stays. Malaria prophylaxis isn't usually needed for tourist areas."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Can I see leopards in Sri Lanka?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes! Yala National Park has the highest leopard density in the world. Best time: February-July during dry season. Morning and late afternoon safaris offer best sighting chances. Book with experienced guides for 90%+ sighting success."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Is tap water safe to drink in Sri Lanka?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "No, don't drink tap water. Buy bottled water (available everywhere, LKR 50-100). Most hotels provide free drinking water. Use bottled water for brushing teeth. Ice in tourist establishments is usually safe."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What should I wear to visit temples in Sri Lanka?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Cover shoulders and knees, remove shoes and hats. White clothing is traditional for temples. Avoid shorts, sleeveless tops, and revealing clothing. Sarongs/coverups available for rent at major temples. Photography restrictions apply at some sites."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How do I get from Colombo Airport to Kandy?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Options: 1) Private transfer (3-4 hours, $65-80) - most comfortable. 2) Express train from Colombo Fort (3.5 hours, $5-15). 3) Bus from Colombo central (4 hours, $3). Pre-book transfer for hassle-free arrival."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What is the Ella train journey?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "The Kandy to Ella train is rated one of the world's most scenic rail journeys. 7-hour ride through tea plantations, waterfalls, and mountains. Book observation deck seats 30 days ahead. Second class offers best views at reasonable price."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Can I use credit cards in Sri Lanka?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Major cards (Visa, Mastercard) accepted at hotels, restaurants, and large shops in tourist areas. Always carry cash for smaller vendors, local markets, and rural areas. ATMs widely available (limit ~LKR 40,000/transaction)."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What plug type does Sri Lanka use?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Sri Lanka uses Type D (India) and Type G (UK) plugs. Voltage is 230V/50Hz. Bring a universal adapter. Most hotels provide multiple socket types. USB charging ports increasingly common in newer hotels."
                                }
                            }
                        ]
                    })}
                </script>

                {/* Breadcrumb Schema */}
                <script type="application/ld+json">
                    {JSON.stringify(createBreadcrumbSchema([
                        { name: 'Home', url: COMPANY.url },
                        { name: 'FAQ', url: `${COMPANY.url}/faq` }
                    ]))}
                </script>

                {/* HowTo Schema: Getting a Visa */}
                <script type="application/ld+json">
                    {JSON.stringify(createHowToSchema(
                        'How to Get a Sri Lanka Visa (ETA)',
                        'Step-by-step guide to applying for the Sri Lanka Electronic Travel Authorization',
                        [
                            { name: 'Visit Official ETA Website', text: 'Go to www.eta.gov.lk or download the official Sri Lanka ETA app. Ensure you use the official government site to avoid scams.' },
                            { name: 'Fill Application Form', text: 'Enter your passport details, travel dates, Sri Lanka address (hotel name is fine), and contact information. Double-check all spellings match your passport exactly.' },
                            { name: 'Pay ETA Fee', text: 'Pay the $50 USD fee (most nationalities) using credit/debit card. Processing fee may apply. Keep payment confirmation.' },
                            { name: 'Receive ETA Approval', text: 'Approval typically comes via email within 24-48 hours. Download and print your ETA approval letter.' },
                            { name: 'Present at Immigration', text: 'Show your printed ETA approval, passport, and return ticket at Sri Lanka immigration. Visa is stamped for 30 days, extendable to 6 months.' }
                        ],
                        { totalTime: 'PT15M', estimatedCost: { value: 50, currency: 'USD' } }
                    ))}
                </script>

                {/* HowTo Schema: Booking a Safari */}
                <script type="application/ld+json">
                    {JSON.stringify(createHowToSchema(
                        'How to Book a Wildlife Safari in Sri Lanka',
                        'Complete guide to planning and booking your Sri Lanka safari experience',
                        [
                            { name: 'Choose Your Park', text: 'Yala for leopards, Udawalawe for elephants, Wilpattu for variety, Minneriya for elephant gatherings (Aug-Oct). Each park offers unique wildlife experiences.' },
                            { name: 'Select Safari Time', text: 'Morning safaris (5:30-11:00 AM) offer best wildlife activity and cooler temperatures. Afternoon safaris (2:30-6:30 PM) good for predator sightings.' },
                            { name: 'Book with Licensed Operator', text: 'Choose SLTDA-licensed operators like Recharge Travels. Verify their license, read reviews, and confirm pricing includes park fees, jeep, and guide.' },
                            { name: 'Prepare for Safari', text: 'Bring binoculars, camera with zoom lens, sunscreen, hat, and neutral-colored clothing. Wake early and have breakfast after morning safari.' },
                            { name: 'Enjoy Responsibly', text: 'Follow guide instructions, maintain silence near animals, never feed wildlife, and stay in the vehicle. Respect the environment for future visitors.' }
                        ],
                        { totalTime: 'PT10M', estimatedCost: { value: 85, currency: 'USD' } }
                    ))}
                </script>

                {/* Speakable Schema for Voice Search */}
                <script type="application/ld+json">
                    {JSON.stringify(createSpeakableSchema(
                        `${COMPANY.url}/faq`,
                        ['h1', '.faq-question', '.faq-answer', '.category-description']
                    ))}
                </script>

                {/* Organization Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TravelAgency",
                        "name": COMPANY.name,
                        "url": COMPANY.url,
                        "telephone": COMPANY.phone,
                        "email": COMPANY.email,
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": COMPANY.rating.value,
                            "reviewCount": COMPANY.rating.count
                        }
                    })}
                </script>
            </Helmet>

            <Header />

            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 text-white py-16 md:py-20 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            {/* Logo */}
                            <div className="mb-6 md:mb-8">
                                <img
                                    src="/logo-v2.png"
                                    alt="Recharge Travels"
                                    className="h-20 md:h-24 w-auto mx-auto object-contain drop-shadow-2xl"
                                />
                            </div>
                            <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
                                <HelpCircle className="w-8 h-8 md:w-10 md:h-10" />
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                                    Sri Lanka Travel FAQ
                                </h1>
                            </div>
                            <p className="text-lg md:text-xl lg:text-2xl opacity-90 mb-4 md:mb-6">
                                {totalQuestions}+ Questions Answered for 2025-2026
                            </p>
                            <p className="text-base md:text-lg opacity-80 mb-6 md:mb-8">
                                Updated with latest regulations including August 2025 airport driving permits and visa-free entry for 7 countries
                            </p>
                            <p className="text-sm md:text-base opacity-70">
                                Can't find your answer? WhatsApp us: <strong>+94 77 77 21 999</strong>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Search & Category Filter */}
                <section className="py-6 md:py-8 bg-white border-b sticky top-0 z-40 shadow-sm">
                    <div className="container mx-auto px-4">
                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto mb-4 md:mb-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search all FAQs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 md:py-4 rounded-full border-2 border-gray-200 focus:border-teal-500 focus:outline-none text-base md:text-lg transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category Pills */}
                        <div className="flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => setActiveCategory(null)}
                                className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                                    activeCategory === null
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All Topics
                            </button>
                            {faqCategories.map((cat) => (
                                <button
                                    key={cat.category}
                                    onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
                                    className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all flex items-center gap-1 md:gap-2 ${
                                        activeCategory === cat.category
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {cat.icon}
                                    <span className="hidden sm:inline">{cat.category}</span>
                                    <span className="sm:hidden">{cat.category.split(' ')[0]}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Content */}
                <section className="py-8 md:py-12 bg-gray-50">
                    <div className="container mx-auto px-4 max-w-4xl">
                        {filteredCategories.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-600 mb-4">No results found for "{searchQuery}"</p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="text-teal-600 hover:underline"
                                >
                                    Clear search
                                </button>
                            </div>
                        ) : (
                            filteredCategories.map((category, categoryIndex) => (
                                <div key={categoryIndex} className="mb-10 md:mb-12">
                                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                                        <span className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                                            {category.icon}
                                        </span>
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                                {category.category}
                                            </h2>
                                            <p className="text-sm md:text-base text-gray-600">{category.description}</p>
                                        </div>
                                        <span className="ml-auto bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs md:text-sm">
                                            {category.questions.length} FAQs
                                        </span>
                                    </div>

                                    <div className="space-y-3 md:space-y-4">
                                        {category.questions.map((item, questionIndex) => {
                                            const globalIndex = categoryIndex * 1000 + questionIndex;
                                            const isOpen = openIndex === globalIndex;

                                            return (
                                                <Card
                                                    key={questionIndex}
                                                    className="transition-all duration-300 hover:shadow-lg border-2 border-gray-200 hover:border-teal-300 bg-white"
                                                >
                                                    <CardContent className="p-0">
                                                        <button
                                                            onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                                                            className="w-full text-left p-4 md:p-6 flex items-start justify-between gap-3 md:gap-4 hover:bg-teal-50 transition-colors"
                                                        >
                                                            <div className="flex-1">
                                                                <h3 className="text-base md:text-lg font-bold text-gray-900">
                                                                    {item.question}
                                                                </h3>
                                                            </div>
                                                            <div className="flex-shrink-0 mt-1">
                                                                {isOpen ? (
                                                                    <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
                                                                ) : (
                                                                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                                                                )}
                                                            </div>
                                                        </button>

                                                        {isOpen && (
                                                            <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0 bg-white">
                                                                <div className="border-t-2 border-teal-100 pt-4">
                                                                    <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                                                                        {item.answer}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Quick Reference Box */}
                <section className="py-8 md:py-12 bg-white">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200">
                            <CardContent className="p-6 md:p-8">
                                <h3 className="text-xl md:text-2xl font-bold text-teal-800 mb-4 md:mb-6">Quick Reference: Key 2025 Updates</h3>
                                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Car className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-900">Airport Driving Permit</p>
                                                <p className="text-sm text-gray-700">DMT counter at BIA - 24/7 service (August 2025)</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FileText className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-900">Visa-Free Entry</p>
                                                <p className="text-sm text-gray-700">India, China, Indonesia, Thailand, Malaysia, Japan, Russia</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Shield className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-900">Tourist Safety Hotline</p>
                                                <p className="text-sm text-gray-700">IGP WhatsApp: +94 77 222 3456 (24/7)</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Car className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-900">Three-Wheeler Ban</p>
                                                <p className="text-sm text-gray-700">Tourists cannot drive tuk-tuks (safety regulation)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="py-12 md:py-16 bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                            Still Have Questions?
                        </h2>
                        <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
                            Our travel experts are here to help 24/7
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://wa.me/94777721999"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-teal-600 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2 shadow-lg"
                            >
                                WhatsApp Us Now
                            </a>
                            <a
                                href="mailto:info@rechargetravels.com"
                                className="bg-transparent border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-white hover:text-teal-600 transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg"
                            >
                                Email Us
                            </a>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
};

export default FAQ;
