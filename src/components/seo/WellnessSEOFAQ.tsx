
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const WellnessSEOFAQ = () => {
  const wellnessFaqs = [
    {
      question: "What makes Sri Lankan Ayurveda different from other wellness traditions?",
      answer: "Sri Lankan Ayurveda is unique because it represents the world's oldest organized medical system, with the first hospitals established over 2,000 years ago. Our tradition combines authentic Ayurvedic principles with indigenous Sinhala medical practices, creating treatments using over 3,000 native medicinal plants. Unlike modern adaptations elsewhere, Sri Lankan Ayurveda maintains strict adherence to ancient texts and traditional preparation methods passed down through generations of royal physicians."
    },
    {
      question: "How long should I stay for an effective Ayurvedic wellness retreat?",
      answer: "For optimal results, traditional Ayurvedic treatments require minimum 7-14 days, with 21-28 days being ideal for complete body detoxification and rejuvenation. Panchakarma (five-action detox) typically needs 14-21 days, while specific treatments for chronic conditions may require 28-42 days. Shorter 3-7 day packages offer relaxation and introduction to Ayurveda but won't provide deep therapeutic benefits that traditional treatments are designed for."
    },
    {
      question: "What is Panchakarma and why is it considered the ultimate detox?",
      answer: "Panchakarma is a comprehensive five-step detoxification process developed over 2,500 years ago. It includes Vamana (therapeutic vomiting), Virechana (purgation), Basti (medicated enemas), Nasya (nasal treatments), and Raktamokshana (bloodletting). This ancient process removes deep-seated toxins, balances doshas (body energies), and rejuvenates cellular function. Sri Lankan Panchakarma follows original texts with authentic herbal preparations, making it more effective than modern simplified versions."
    },
    {
      question: "Are Sri Lankan wellness treatments suitable for specific health conditions?",
      answer: "Yes, traditional Sri Lankan Ayurveda addresses numerous conditions including arthritis, digestive disorders, stress-related ailments, skin conditions, respiratory issues, and chronic fatigue. However, treatments are personalized based on individual constitution (Prakriti) and current imbalances (Vikriti). Our certified physicians conduct thorough consultations including pulse diagnosis, body analysis, and lifestyle assessment before creating customized treatment protocols. Always consult healthcare providers before travel if you have serious medical conditions."
    },
    {
      question: "What should I expect during my first Ayurvedic consultation?",
      answer: "Your initial consultation involves comprehensive assessment by a qualified Ayurvedic physician including detailed medical history, lifestyle analysis, pulse diagnosis (Nadi Pariksha), physical examination, and dosha constitution analysis. The doctor determines your Prakriti (natural constitution) and Vikriti (current imbalances), then creates personalized treatment plans including specific therapies, dietary recommendations, daily routines, and herbal medicines. This process typically takes 60-90 minutes and forms the foundation of your entire wellness journey."
    },
    {
      question: "Can I combine different wellness packages or treatments?",
      answer: "Absolutely! Our wellness experts specialize in creating hybrid programs combining Ayurvedic treatments with yoga, meditation, spa therapies, and nature healing. Popular combinations include Ayurveda + Yoga retreats, Spa + Traditional healing packages, or Nature wellness + Cultural experiences. However, certain intensive treatments like Panchakarma require dedicated focus and shouldn't be combined with demanding activities. Our physicians will recommend optimal combinations based on your health goals and time availability."
    },
    {
      question: "What dietary restrictions should I follow during wellness treatments?",
      answer: "Ayurvedic wellness requires specific dietary guidelines based on your dosha type and treatment plan. Generally, you'll follow sattvic (pure) diet avoiding processed foods, excessive spices, alcohol, caffeine, and non-vegetarian items during intensive treatments. Fresh, organic, locally-sourced ingredients prepared according to Ayurvedic principles support healing. Our retreat centers provide specialized Ayurvedic cuisine designed to enhance treatment effectiveness. Dietary plans are personalized - some constitutions may require different restrictions."
    },
    {
      question: "How do I prepare for an Ayurvedic wellness retreat?",
      answer: "Preparation begins 1-2 weeks before arrival: gradually reduce caffeine, alcohol, processed foods, and heavy meals. Increase water intake, practice gentle yoga or meditation, and establish regular sleep patterns. Arrive with comfortable cotton clothing, avoid synthetic fabrics. Bring minimal jewelry and cosmetics as treatments often require removal. Mentally prepare for lifestyle changes - Ayurvedic retreats involve early rising, scheduled meal times, and periods of silence for deeper healing. Complete pre-arrival health questionnaires honestly for optimal treatment planning."
    },
    {
      question: "What credentials should I look for in Ayurvedic practitioners?",
      answer: "Authentic Sri Lankan Ayurvedic practitioners should have formal education from recognized institutions like Institute of Indigenous Medicine, University of Colombo, or Gampaha Wickramarachchi Ayurveda Institute. Look for BAMS (Bachelor of Ayurvedic Medicine and Surgery) or higher qualifications, registration with Sri Lanka Medical Council's Ayurveda Board, and experience in traditional treatments. Genuine practitioners undergo years of study including Sanskrit, traditional texts, pulse diagnosis, and supervised clinical practice. Avoid self-proclaimed healers without proper credentials."
    },
    {
      question: "Are there any side effects or risks with traditional treatments?",
      answer: "When administered by qualified practitioners, traditional Ayurvedic treatments are generally safe with minimal side effects. However, intensive detox procedures like Panchakarma may cause temporary symptoms like fatigue, mild headaches, or digestive changes as toxins are eliminated. Some herbal medicines may interact with modern medications. Pregnant women, people with serious heart conditions, or those on multiple medications need special precautions. Always disclose complete medical history and current medications to your Ayurvedic physician."
    },
    {
      question: "How much do authentic wellness packages cost in Sri Lanka?",
      answer: "Authentic wellness packages range from $50-150/day for basic Ayurvedic treatments at simple retreats, $150-400/day for luxury spa-integrated programs, and $400-800/day for ultra-premium private wellness experiences. Costs depend on accommodation level, treatment intensity, practitioner qualifications, and included services. Traditional village-based authentic centers cost less but offer genuine experiences, while luxury resorts provide comfort with authentic treatments. Remember, cheaper options may compromise on authenticity or practitioner quality."
    },
    {
      question: "What's the best time of year for wellness retreats in Sri Lanka?",
      answer: "Sri Lanka's tropical climate allows year-round wellness experiences, but timing affects comfort and treatment effectiveness. December-March is ideal for west/south coast retreats with dry, sunny weather perfect for outdoor yoga and beach meditation. April-September suits hill country and east coast centers with cooler temperatures ideal for intensive treatments. Monsoon periods (May-July west coast, October-December east coast) can enhance certain therapies as humidity supports herbal steam treatments and oil absorption."
    },
    {
      question: "Can wellness treatments help with mental health and stress?",
      answer: "Traditional Sri Lankan wellness approaches mental health holistically through Satvavajaya Chikitsa (psychotherapy), Yoga, meditation, and specialized treatments like Shirodhara (continuous oil pouring) and Shirobasti (oil pooling on head). These methods balance Vata dosha responsible for nervous system function, reduce cortisol levels, and promote deep relaxation. Combined with Ayurvedic lifestyle practices, dietary changes, and herbal medicines, wellness retreats effectively address anxiety, depression, insomnia, and stress-related disorders through natural, time-tested methods."
    },
    {
      question: "How do I maintain wellness benefits after returning home?",
      answer: "Sustaining wellness benefits requires integrating Ayurvedic principles into daily life: maintain regular sleep-wake cycles, practice morning yoga/meditation, follow dietary guidelines for your dosha type, and use prescribed herbal supplements. Our physicians provide detailed post-retreat plans including daily routines (Dinacharya), seasonal adjustments (Ritucharya), and lifestyle modifications. Many retreats offer follow-up consultations via video calls, herbal medicine shipping, and online support groups to help maintain your transformation long-term."
    },
    {
      question: "What makes luxury wellness different from basic Ayurvedic treatments?",
      answer: "Luxury wellness combines authentic traditional treatments with premium accommodations, personalized service, and enhanced experiences. While treatment authenticity remains the same, luxury packages offer private consultation rooms, exclusive practitioner access, premium organic ingredients, spa-like environments, gourmet Ayurvedic cuisine, and additional services like yoga instruction, cultural tours, and transportation. Basic treatments focus purely on therapeutic aspects with simpler accommodations but maintain the same traditional authenticity and healing effectiveness."
    },
    {
      question: "Are wellness retreats suitable for beginners to Ayurveda?",
      answer: "Absolutely! Many wellness packages are specifically designed for Ayurveda beginners, starting with gentle introductory treatments, educational sessions about dosha types and Ayurvedic principles, and gradual introduction to lifestyle practices. Beginner-friendly programs include shorter durations (5-7 days), less intensive treatments, and more educational components. Experienced practitioners guide newcomers through the process, explaining each treatment's purpose and benefits. However, even beginner programs maintain authenticity and can provide significant health benefits."
    },
    {
      question: "How do traditional Sri Lankan massages differ from spa massages?",
      answer: "Traditional Sri Lankan massages (Abhyanga) are therapeutic treatments using specific herbal oils, particular techniques, and precise timing based on individual constitution and health needs. Unlike relaxation-focused spa massages, traditional massages target marma points (vital energy centers), follow specific stroke patterns mentioned in ancient texts, and use medicated oils prepared according to classical formulations. The pressure, duration, and oil selection are prescribed by Ayurvedic physicians as part of overall treatment protocols, making them medicinal rather than merely relaxing."
    },
    {
      question: "What herbal medicines are commonly used in Sri Lankan wellness?",
      answer: "Sri Lankan wellness utilizes over 3,000 indigenous medicinal plants including Gotukola (Centella asiatica) for brain health, Komarika (Aloe vera) for digestive issues, Bulu (Terminalia bellirica) for respiratory conditions, and Aralu (Terminalia chebula) for detoxification. Classical formulations like Dashamularishta, Saraswatharishta, and Brahmi Ghrita are prepared using traditional methods. Fresh herbs are often grown on-site in retreat medicinal gardens, ensuring potency and authenticity. All medicines are prepared by qualified pharmacists following ancient texts and modern safety standards."
    },
    {
      question: "Can I bring family members who aren't interested in intensive treatments?",
      answer: "Yes! Many wellness retreats accommodate families with varying interests by offering flexible programs. Non-participating family members can enjoy luxury accommodations, cultural tours, beach activities, regular spa services, yoga classes, and Sri Lankan cuisine while you undergo intensive treatments. Some retreats provide family wellness programs with age-appropriate treatments for children and gentle introductory sessions for skeptical partners. This allows everyone to benefit from the serene environment while respecting individual comfort levels with traditional treatments."
    },
    {
      question: "What should I know about Sri Lankan wellness retreat etiquette?",
      answer: "Wellness retreat etiquette reflects respect for ancient traditions: arrive punctually for treatments, maintain silence in designated quiet zones, dress modestly (cover shoulders/knees), remove shoes before entering treatment rooms, avoid strong perfumes/deodorants during oil treatments, follow meal timing schedules, and respect practitioners' guidance. Many retreats encourage digital detox - limited phone use helps deepen the healing experience. Tipping is appreciated but not mandatory. Most importantly, approach treatments with open mind and patience as traditional healing works gradually but profoundly."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <HelpCircle className="h-8 w-8 text-emerald-600" />
            <h2 className="text-4xl md:text-5xl font-serif text-emerald-900">
              Complete Wellness & Ayurveda Guide
            </h2>
          </div>
          <p className="text-xl text-emerald-700 max-w-4xl mx-auto leading-relaxed">
            Comprehensive answers to everything you need to know about Sri Lanka's ancient wellness traditions, 
            authentic Ayurvedic treatments, and transformative healing experiences rooted in 2,500+ years of medical heritage.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-4">
          {wellnessFaqs.map((faq, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-emerald-100">
              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="hover:bg-emerald-50/50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-left">
                      <span className="text-lg text-emerald-900 font-semibold leading-relaxed">{faq.question}</span>
                      <ChevronDown className="h-5 w-5 text-emerald-600 transform transition-transform group-data-[state=open]:rotate-180 flex-shrink-0 ml-4" />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-6">
                    <p className="text-emerald-800 leading-relaxed text-base">{faq.answer}</p>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-emerald-200">
          <h3 className="text-2xl font-serif text-emerald-900 mb-4">
            Ready to Begin Your Wellness Journey?
          </h3>
          <p className="text-emerald-700 mb-6 max-w-2xl mx-auto">
            Our wellness experts are available to answer your specific questions and help design 
            the perfect healing experience based on your individual needs and health goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors">
              Speak to Wellness Expert
            </button>
            <button className="px-8 py-3 border-2 border-emerald-600 text-emerald-600 rounded-full font-semibold hover:bg-emerald-50 transition-colors">
              Download Wellness Guide
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WellnessSEOFAQ;
