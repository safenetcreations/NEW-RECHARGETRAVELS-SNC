
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const SEOFAQSection = () => {
  const faqs = [
    {
      question: "What is the best time to visit Sri Lanka?",
      answer: "Sri Lanka can be visited year-round due to its two monsoon seasons affecting different regions. December to March is ideal for the west and south coasts (Colombo, Galle, Mirissa) with dry, sunny weather. April to September is perfect for the east coast (Trincomalee, Batticaloa) and hill country (Nuwara Eliya, Ella). The shoulder months of April and October offer good weather across most of the island."
    },
    {
      question: "Do I need a visa to visit Sri Lanka?",
      answer: "Yes, most visitors need an Electronic Travel Authorization (ETA) to enter Sri Lanka. You can apply online before travel or obtain a visa on arrival at Colombo airport. Tourist visas are typically valid for 30 days and can be extended. You'll need a passport valid for at least 6 months, proof of return ticket, and accommodation details."
    },
    {
      question: "How many days do I need to explore Sri Lanka?",
      answer: "A minimum of 7-10 days allows you to see major highlights including Colombo, Kandy, Sigiriya, and either beaches or wildlife parks. For a comprehensive experience covering cultural sites, wildlife, beaches, and hill country, plan 14-21 days. Sri Lanka is compact, but traveling between regions takes time due to winding roads and traffic."
    },
    {
      question: "Is Sri Lanka safe for tourists?",
      answer: "Yes, Sri Lanka is generally very safe for tourists. The local people are friendly and helpful. Take normal precautions like avoiding isolated areas at night, keeping valuables secure, and being aware of your surroundings. The tourism police are present at major attractions. Solo female travelers should exercise additional caution but many visit safely."
    },
    {
      question: "What should I pack for Sri Lanka?",
      answer: "Pack lightweight, breathable clothing for the tropical climate. Bring modest clothing for temple visits (covering shoulders and knees), comfortable walking shoes, rain jacket during monsoon season, strong sunscreen (SPF 30+), insect repellent, any prescription medications, and a first aid kit. Don't forget your camera for the incredible scenery!"
    },
    {
      question: "What is the currency in Sri Lanka and can I use credit cards?",
      answer: "The currency is Sri Lankan Rupee (LKR). Credit cards are accepted at hotels, restaurants, and shops in tourist areas and major cities. However, cash is needed for local transport, street food, small shops, and temple donations. ATMs are widely available in cities and tourist areas. US Dollars and Euros can be exchanged at banks and licensed exchange counters."
    },
    {
      question: "What are the must-visit places in Sri Lanka?",
      answer: "Essential destinations include: Cultural Triangle (Sigiriya, Polonnaruwa, Dambulla), Kandy for the Temple of Tooth, Galle Fort for colonial architecture, Yala National Park for wildlife safaris, Nuwara Eliya and Ella for tea plantations and scenic trains, south coast beaches (Mirissa, Unawatuna) for relaxation and whale watching, and Colombo for modern Sri Lankan culture."
    },
    {
      question: "How do I get around Sri Lanka?",
      answer: "The most comfortable option is hiring a private car with driver, allowing flexibility and local knowledge. Trains offer scenic routes, especially in hill country, but can be slow. Buses are budget-friendly but crowded. Tuk-tuks are great for short distances in cities. Domestic flights connect major cities quickly. Most tourists choose private transport for convenience and time efficiency."
    },
    {
      question: "What food should I try in Sri Lanka?",
      answer: "Must-try Sri Lankan dishes include: rice and curry (national dish with various curries), hoppers (bowl-shaped pancakes), kottu roti (chopped flatbread stir-fry), string hoppers with curry, fresh seafood especially crab curry, tropical fruits like rambutan and king coconut, Ceylon tea, and traditional sweets like kavum and kokis during festivals."
    },
    {
      question: "Can I see wildlife in Sri Lanka?",
      answer: "Absolutely! Sri Lanka offers incredible wildlife viewing. Yala National Park is famous for leopards and elephants. Udawalawe specializes in elephant watching. Wilpattu offers diverse wildlife in a pristine setting. Minneriya and Kaudulla parks feature massive elephant gatherings. Sinharaja Forest Reserve is perfect for bird watching and endemic species. Mirissa offers whale and dolphin watching tours."
    },
    {
      question: "What cultural sites should I visit in Sri Lanka?",
      answer: "Key cultural sites include 8 UNESCO World Heritage Sites: Sigiriya Rock Fortress, Ancient Cities of Polonnaruwa and Anuradhapura, Dambulla Cave Temples, Kandy's Temple of Tooth Relic, Galle Fort, Sinharaja Forest Reserve, and Central Highlands. Each offers unique insights into Sri Lanka's 2,500-year history, Buddhist heritage, and colonial past."
    },
    {
      question: "Is it expensive to travel in Sri Lanka?",
      answer: "Sri Lanka offers excellent value for money. Budget travelers can manage on $20-30/day using local transport, guesthouses, and street food. Mid-range travelers spend $50-80/day for private transport, boutique hotels, and restaurant meals. Luxury travelers enjoy world-class resorts and private experiences from $150+/day. Compared to other tropical destinations, Sri Lanka provides great quality at reasonable prices."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="h-8 w-8 text-teal-600" />
            <h2 className="text-3xl font-bold text-granite-gray">
              Frequently Asked Questions About Sri Lanka Travel
            </h2>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Get answers to the most common questions about traveling to Sri Lanka. From visa requirements 
            to best destinations, we've compiled expert advice to help you plan your perfect Sri Lankan adventure.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="hover:bg-gray-50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-left">
                      <span className="text-lg text-granite-gray">{faq.question}</span>
                      <ChevronDown className="h-5 w-5 text-teal-600 transform transition-transform group-data-[state=open]:rotate-180" />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions about your Sri Lanka travel plans?
          </p>
          <p className="text-sm text-gray-500">
            Contact our travel experts for personalized advice and custom itinerary planning.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SEOFAQSection;
