
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, MapPin, Users, Clock, Mail, Phone, Globe } from 'lucide-react';

const CulturalHeritageTours = () => {
  const [activeSection, setActiveSection] = useState('tours');
  const [bookingForm, setBookingForm] = useState({
    tourPackage: '',
    fullName: '',
    email: '',
    phone: '',
    travelers: 1,
    startDate: '',
    specialRequests: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const tours = [
    {
      id: 'cultural-triangle',
      name: 'The Cultural Triangle Classic',
      duration: '7 Days / 6 Nights',
      price: 750,
      highlights: [
        'Ascend the magnificent Sigiriya Rock Fortress',
        'Explore the sprawling ruins of Polonnaruwa',
        'Discover the Temple of the Tooth Relic in Kandy',
        'Scenic train journey through tea country'
      ]
    },
    {
      id: 'living-heritage',
      name: "Sri Lanka's Living Heritage",
      duration: '10 Days / 9 Nights',
      price: 950,
      highlights: [
        'Authentic Hiriwadunna village tour',
        'Hands-on Batik making workshop',
        'Private cooking class with local families',
        'Remote Meemure village exploration'
      ]
    },
    {
      id: 'ancient-kingdoms',
      name: 'Ancient Kingdoms & Colonial Coasts',
      duration: '12 Days / 11 Nights',
      price: 1250,
      highlights: [
        "Discover Anuradhapura's ancient capital",
        'Wildlife safari in Yala National Park',
        'Explore UNESCO World Heritage Galle Fort',
        'Complete Sri Lankan cultural experience'
      ]
    }
  ];

  const heritageSites = [
    {
      name: 'Sigiriya Rock Fortress',
      hours: '7:00 AM - 5:30 PM',
      price: '~$30 USD',
      duration: '3-4 hours',
      note: 'Early morning visit recommended'
    },
    {
      name: 'Temple of the Tooth, Kandy',
      hours: '5:30 AM - 8:00 PM',
      price: '~$7 USD',
      duration: '1.5-2 hours',
      note: 'Puja Times: 5:30 AM, 9:30 AM, 6:30 PM'
    },
    {
      name: 'Dambulla Cave Temple',
      hours: '7:00 AM - 7:00 PM',
      price: '~$10-14 USD',
      duration: '1.5-2 hours',
      note: 'Modest dress required'
    },
    {
      name: 'Polonnaruwa Ancient City',
      hours: '7:00 AM - 5:00 PM',
      price: '~$30-35 USD',
      duration: '4-5 hours',
      note: 'Bicycle rental recommended'
    },
    {
      name: 'Anuradhapura Sacred City',
      hours: '7:00 AM - 6:00 PM',
      price: '~$25-35 USD',
      duration: 'Full day',
      note: 'Tuk-tuk recommended'
    },
    {
      name: 'Galle Fort',
      hours: '24 hours (fort area)',
      price: 'Free',
      duration: 'Half to full day',
      note: 'Sunset walk on ramparts'
    }
  ];

  const handleBookingSubmit = () => {
    if (!bookingForm.tourPackage || !bookingForm.fullName || !bookingForm.email || 
        !bookingForm.phone || !bookingForm.startDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    setShowSuccess(true);
    setTimeout(() => {
      setBookingForm({
        tourPackage: '',
        fullName: '',
        email: '',
        phone: '',
        travelers: 1,
        startDate: '',
        specialRequests: ''
      });
      setShowSuccess(false);
    }, 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectTourForBooking = (tourName: string) => {
    setActiveSection('booking');
    setBookingForm(prev => ({
      ...prev,
      tourPackage: tourName
    }));
  };

  return (
    <>
      <Helmet>
        <title>Cultural Heritage Tours - Recharge Travels</title>
        <meta name="description" content="Explore Sri Lanka's rich cultural heritage with our expertly guided tours. Visit UNESCO World Heritage sites and experience authentic Sri Lankan culture." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#FFF8DC] to-[#FAF0E6]" style={{ fontFamily: 'Crimson Text, serif' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Pattern Background */}
        <div className="fixed inset-0 pointer-events-none opacity-30" 
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(139, 20, 52, 0.03) 35px, rgba(139, 20, 52, 0.03) 70px),
              repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(244, 185, 66, 0.03) 35px, rgba(244, 185, 66, 0.03) 70px)
            `
          }}
        />

        {/* Header */}
        <header className="relative bg-gradient-to-r from-[#8B1434] to-[#C65D00] text-[#FFF8DC] py-16 shadow-lg overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D4AF37] via-[#F4B942] to-[#D4AF37]" />
          <div className="max-w-6xl mx-auto px-8 text-center">
            <h1 className="text-5xl font-bold mb-4 tracking-wider drop-shadow-lg" style={{ fontFamily: 'Cinzel, serif' }}>
              Cultural Heritage Tours
            </h1>
            <p className="text-xl italic opacity-90">Discover Sri Lanka's Ancient Treasures</p>
          </div>
        </header>

        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-[#4A2C2A] shadow-md">
          <div className="max-w-6xl mx-auto px-8 flex justify-center gap-8 flex-wrap">
            {[
              { id: 'tours', label: 'Cultural Tours' },
              { id: 'sites', label: 'Heritage Sites' },
              { id: 'booking', label: 'Book Your Journey' },
              { id: 'contact', label: 'Contact Us' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`py-4 px-6 text-[#FFF8DC] text-lg transition-all duration-300 border-b-2 hover:bg-[#D4AF37]/10 ${
                  activeSection === item.id ? 'border-[#D4AF37]' : 'border-transparent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-8 py-8">
          {/* Tours Section */}
          {activeSection === 'tours' && (
            <section style={{ animation: 'fadeIn 0.5s ease-in' }}>
              <h2 className="text-4xl text-center text-[#8B1434] mb-8 relative pb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                Cultural Tour Packages
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              </h2>
              
              <div className="text-center text-3xl text-[#D4AF37] mb-8">❋ ✦ ❋</div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tours.map(tour => (
                  <div key={tour.id} className="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-[#D4AF37] hover:transform hover:-translate-y-1 transition-all duration-300">
                    <div className="bg-gradient-to-r from-[#C65D00] to-[#F4B942] text-white p-6 text-center">
                      <h3 className="text-2xl mb-2" style={{ fontFamily: 'Cinzel, serif' }}>{tour.name}</h3>
                      <p className="opacity-90">{tour.duration}</p>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl text-[#8B1434] mb-3 font-semibold">Highlights:</h4>
                      <ul className="space-y-2 mb-6">
                        {tour.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-[#D4AF37] text-xl mr-2">❋</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-center text-2xl text-[#8B1434] font-bold mb-4">
                        Starting from ${tour.price} per person
                      </p>
                      <button
                        onClick={() => selectTourForBooking(tour.name)}
                        className="w-full py-3 bg-gradient-to-r from-[#8B1434] to-[#C65D00] text-white rounded transition-all duration-300 hover:scale-105 hover:shadow-lg text-lg font-semibold"
                      >
                        Book This Tour
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Heritage Sites Section */}
          {activeSection === 'sites' && (
            <section style={{ animation: 'fadeIn 0.5s ease-in' }}>
              <h2 className="text-4xl text-center text-[#8B1434] mb-8 relative pb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                UNESCO World Heritage Sites
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              </h2>
              
              <div className="text-center text-3xl text-[#D4AF37] mb-8">❋ ✦ ❋</div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heritageSites.map((site, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#D4AF37] hover:transform hover:translate-x-1 transition-all duration-300">
                    <h3 className="text-xl text-[#8B1434] mb-3 font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
                      {site.name}
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <p><span className="text-[#C65D00] font-semibold">Opening Hours:</span> {site.hours}</p>
                      <p><span className="text-[#C65D00] font-semibold">Entry Fee:</span> {site.price}</p>
                      <p><span className="text-[#C65D00] font-semibold">Duration:</span> {site.duration}</p>
                      {site.note && (
                        <p className="text-[#C65D00] italic">{site.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Booking Section */}
          {activeSection === 'booking' && (
            <section style={{ animation: 'fadeIn 0.5s ease-in' }}>
              <h2 className="text-4xl text-center text-[#8B1434] mb-8 relative pb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                Book Your Cultural Journey
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              </h2>
              
              <div className="text-center text-3xl text-[#D4AF37] mb-8">❋ ✦ ❋</div>
              
              <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg border-2 border-[#D4AF37]">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[#8B1434] font-semibold mb-2">Select Tour Package</label>
                    <select
                      name="tourPackage"
                      value={bookingForm.tourPackage}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded focus:border-[#D4AF37] focus:outline-none transition-colors"
                    >
                      <option value="">Choose your adventure...</option>
                      {tours.map(tour => (
                        <option key={tour.id} value={tour.name}>
                          {tour.name} ({tour.duration})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[#8B1434] font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={bookingForm.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[#8B1434] font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={bookingForm.email}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[#8B1434] font-semibold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingForm.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[#8B1434] font-semibold mb-2">Number of Travelers</label>
                    <input
                      type="number"
                      name="travelers"
                      value={bookingForm.travelers}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[#8B1434] font-semibold mb-2">Preferred Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={bookingForm.startDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full p-3 border-2 border-gray-300 rounded focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-[#8B1434] font-semibold mb-2">Special Requests</label>
                  <textarea
                    name="specialRequests"
                    value={bookingForm.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Dietary requirements, accessibility needs, special interests..."
                    className="w-full p-3 border-2 border-gray-300 rounded focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>
                
                <button
                  onClick={handleBookingSubmit}
                  className="w-full py-3 bg-gradient-to-r from-[#8B1434] to-[#C65D00] text-white rounded transition-all duration-300 hover:scale-105 hover:shadow-lg text-lg font-semibold"
                >
                  Submit Booking Request
                </button>
                
                {showSuccess && (
                  <div className="mt-6 p-4 bg-[#228B22] text-white rounded text-center" style={{ animation: 'fadeIn 0.5s ease-in' }}>
                    Thank you for your booking request! We will contact you within 24 hours.
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Contact Section */}
          {activeSection === 'contact' && (
            <section style={{ animation: 'fadeIn 0.5s ease-in' }}>
              <h2 className="text-4xl text-center text-[#8B1434] mb-8 relative pb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                Contact Recharge Travels
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              </h2>
              
              <div className="text-center text-3xl text-[#D4AF37] mb-8">❋ ✦ ❋</div>
              
              <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-[#D4AF37] text-center max-w-2xl mx-auto">
                <h3 className="text-2xl text-[#8B1434] mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
                  We're Here to Help Plan Your Journey
                </h3>
                
                <div className="space-y-3 text-lg">
                  <p className="flex items-center justify-center gap-2">
                    <MapPin className="text-[#C65D00]" size={20} />
                    <strong>Office:</strong> Galle Road, Colombo, Sri Lanka
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Phone className="text-[#C65D00]" size={20} />
                    <strong>Phone:</strong> +94 11 234 5678
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Mail className="text-[#C65D00]" size={20} />
                    <strong>Email:</strong> info@rechargetravels.lk
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Globe className="text-[#C65D00]" size={20} />
                    <strong>WhatsApp:</strong> +94 77 123 4567
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Clock className="text-[#C65D00]" size={20} />
                    <strong>Operating Hours:</strong> 365 days a year
                  </p>
                </div>
                
                <div className="text-2xl text-[#D4AF37] my-6">❋</div>
                
                <p className="italic text-gray-700 text-lg">
                  "To provide our valued customers with a courteous, comfortable, safe and memorable tour service all around Sri Lanka, on an affordable budget"
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default CulturalHeritageTours;
