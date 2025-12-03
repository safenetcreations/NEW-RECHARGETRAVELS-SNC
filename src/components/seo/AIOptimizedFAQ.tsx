import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface AIOptimizedFAQProps {
  faqs: FAQItem[];
  title?: string;
  description?: string;
  pageUrl?: string;
  showCategories?: boolean;
}

/**
 * AI-Optimized FAQ Component
 * 
 * Designed to maximize the chance of being cited by AI assistants:
 * 
 * 1. Uses FAQPage schema markup (required for Google AI Overviews)
 * 2. Clear question/answer format that AI can extract
 * 3. First sentence of each answer is a direct response
 * 4. Includes specific facts, numbers, and citations where possible
 * 5. Visually accessible for users and semantically clear for crawlers
 */
const AIOptimizedFAQ: React.FC<AIOptimizedFAQProps> = ({
  faqs,
  title = "Frequently Asked Questions",
  description,
  pageUrl,
  showCategories = false
}) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const baseUrl = 'https://www.rechargetravels.com';

  // Generate FAQ Schema for AI
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Group FAQs by category if showCategories is true
  const groupedFaqs = showCategories
    ? faqs.reduce((acc, faq) => {
        const category = faq.category || 'General';
        if (!acc[category]) acc[category] = [];
        acc[category].push(faq);
        return acc;
      }, {} as Record<string, FAQItem[]>)
    : { 'All Questions': faqs };

  return (
    <>
      {/* FAQ Schema for AI and Google */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        
        {/* Additional speakable content for voice assistants */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": [".faq-question", ".faq-answer-summary"]
            },
            "url": pageUrl ? `${baseUrl}${pageUrl}` : baseUrl
          })}
        </script>
      </Helmet>

      <section 
        className="py-16 bg-gradient-to-b from-slate-50 to-white"
        aria-labelledby="faq-title"
      >
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
              <HelpCircle className="w-4 h-4" />
              Quick Answers
            </div>
            <h2 
              id="faq-title" 
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
            >
              {title}
            </h2>
            {description && (
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>

          {/* FAQ List */}
          {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
            <div key={category} className="mb-8">
              {showCategories && Object.keys(groupedFaqs).length > 1 && (
                <h3 className="text-xl font-semibold text-slate-800 mb-4 pb-2 border-b">
                  {category}
                </h3>
              )}
              
              <div className="space-y-4">
                {categoryFaqs.map((faq, index) => {
                  const globalIndex = faqs.indexOf(faq);
                  const isOpen = openIndex === globalIndex;
                  
                  // Extract the first sentence for the summary
                  const answerSummary = faq.answer.split('.')[0] + '.';
                  
                  return (
                    <div
                      key={globalIndex}
                      className={`
                        border rounded-xl overflow-hidden transition-all duration-300
                        ${isOpen 
                          ? 'border-amber-300 bg-amber-50/50 shadow-md' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                        }
                      `}
                      itemScope
                      itemType="https://schema.org/Question"
                    >
                      {/* Question Button */}
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full flex items-center justify-between p-5 text-left"
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${globalIndex}`}
                      >
                        <h3 
                          className="faq-question text-lg font-semibold text-slate-900 pr-4"
                          itemProp="name"
                        >
                          {faq.question}
                        </h3>
                        <span className={`
                          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                          transition-colors duration-200
                          ${isOpen ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}
                        `}>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </span>
                      </button>

                      {/* Answer */}
                      <div
                        id={`faq-answer-${globalIndex}`}
                        className={`
                          overflow-hidden transition-all duration-300
                          ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                        `}
                        itemScope
                        itemType="https://schema.org/Answer"
                        itemProp="acceptedAnswer"
                      >
                        <div className="px-5 pb-5">
                          {/* Summary for AI (first sentence, highlighted) */}
                          <p 
                            className="faq-answer-summary text-amber-800 font-medium mb-2"
                            style={{ display: 'none' }}
                          >
                            {answerSummary}
                          </p>
                          
                          {/* Full Answer */}
                          <div 
                            className="text-slate-700 leading-relaxed prose prose-slate max-w-none"
                            itemProp="text"
                          >
                            {/* Bold the first sentence for emphasis */}
                            <p>
                              <strong className="text-slate-900">{answerSummary}</strong>
                              {' '}
                              {faq.answer.slice(answerSummary.length).trim()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* CTA Section */}
          <div className="mt-12 text-center p-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-3">
              Still Have Questions?
            </h3>
            <p className="text-amber-100 mb-6">
              Our travel experts are here to help plan your perfect Sri Lanka adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="tel:+94777721999"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Call +94 77 772 1999
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/**
 * Pre-built FAQ sets for common pages
 */
export const COMMON_FAQS = {
  sriLankaTravel: [
    {
      question: "What is the best time to visit Sri Lanka?",
      answer: "The best time to visit Sri Lanka depends on which region you're exploring. For the west and south coasts, visit December to April. For the east coast, visit April to September. The hill country is best January to April. Sri Lanka offers year-round travel opportunities by visiting different regions at different times.",
      category: "Planning"
    },
    {
      question: "Do I need a visa to visit Sri Lanka?",
      answer: "Most nationalities need an ETA (Electronic Travel Authorization) to visit Sri Lanka. The tourist ETA costs $50 USD for 30 days and can be applied online at eta.gov.lk. Processing takes 24-48 hours. Some nationalities like Singapore and Maldives get visa-free entry.",
      category: "Planning"
    },
    {
      question: "Is Sri Lanka safe for tourists?",
      answer: "Yes, Sri Lanka is generally very safe for tourists. It's one of the safest countries in South Asia with a welcoming culture and low crime rates against tourists. Standard travel precautions apply - be aware of your belongings in crowded areas and use registered transport. The tourism police provide additional security at major attractions.",
      category: "Safety"
    },
    {
      question: "How many days do I need in Sri Lanka?",
      answer: "We recommend 10-14 days to experience Sri Lanka's highlights, including the Cultural Triangle, hill country, and beaches. A minimum of 7 days allows you to see major attractions at a faster pace. For a comprehensive experience including off-the-beaten-path destinations, 3 weeks is ideal.",
      category: "Planning"
    },
    {
      question: "What currency is used in Sri Lanka?",
      answer: "Sri Lanka uses the Sri Lankan Rupee (LKR). As of 2024, 1 USD equals approximately 320 LKR. Credit cards are widely accepted at hotels, restaurants, and larger shops in tourist areas. ATMs are readily available in cities and towns. We recommend carrying cash for smaller vendors and rural areas.",
      category: "Practical"
    }
  ],
  
  safaris: [
    {
      question: "Which is the best safari park in Sri Lanka?",
      answer: "Yala National Park is the most popular for leopards (highest density in the world), while Udawalawe is best for elephants with guaranteed sightings. Wilpattu offers leopards with fewer crowds. Minneriya's 'The Gathering' (July-October) features up to 300 elephants. Your best choice depends on which animals you want to see and when you're visiting.",
      category: "Wildlife"
    },
    {
      question: "What animals can I see on safari in Sri Lanka?",
      answer: "Sri Lanka safaris offer leopards (Yala has the world's highest density), Asian elephants (over 6,000 wild), sloth bears, wild boar, spotted deer, sambar deer, water buffalo, crocodiles, and 400+ bird species. Marine safaris feature blue whales, sperm whales, and dolphins off the coast.",
      category: "Wildlife"
    },
    {
      question: "How much does a safari cost in Sri Lanka?",
      answer: "A typical safari costs $80-150 per person including jeep hire ($50-100 for 6-seat vehicle), park entrance ($15-25 per person), and guide fees ($10-20). Luxury private safaris with premium lodges range from $300-500 per person. Budget group tours start at $60 per person.",
      category: "Pricing"
    }
  ],
  
  transport: [
    {
      question: "How do I get from Colombo Airport to my hotel?",
      answer: "From Bandaranaike International Airport, you have several options: private transfer ($50-100 depending on destination), airport taxi counter (fixed rates, pay in advance), Uber/PickMe (app-based, $20-40 to Colombo), or public bus (cheapest, under $1 to Colombo but slower). Recharge Travels offers reliable airport transfers starting at $45.",
      category: "Transfers"
    },
    {
      question: "Is the train from Kandy to Ella worth it?",
      answer: "Yes, the Kandy to Ella train is absolutely worth it and is rated one of the world's most scenic train journeys. The 6-7 hour journey passes through emerald tea plantations, waterfalls, and crosses the famous Nine Arch Bridge. Book first or second class seats 30-45 days in advance as they sell out quickly.",
      category: "Trains"
    }
  ]
};

export default AIOptimizedFAQ;

