
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

const AboutRechargeTravel = () => {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      if (target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault()
        const element = document.querySelector(target.getAttribute('href')!)
        element?.scrollIntoView({ behavior: 'smooth' })
      }
    }

    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('.timeline-content, .achievement-card, .vehicle-card, .review-card').forEach((el) => {
      el.classList.add('fade-in-element')
      observer.observe(el)
    })

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', handleAnchorClick)
    })

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener('click', handleAnchorClick)
      })
    }
  }, [])

  const openAdmin = () => {
    const adminPanel = document.getElementById('adminPanel')
    if (adminPanel) {
      adminPanel.style.display = 'block'
      document.body.style.overflow = 'hidden'
    }
  }

  const closeAdmin = () => {
    const adminPanel = document.getElementById('adminPanel')
    if (adminPanel) {
      adminPanel.style.display = 'none'
      document.body.style.overflow = 'auto'
    }
  }

  const saveContent = () => {
    alert('Content saved successfully! In a production environment, this would update your database.')
    closeAdmin()
  }

  return (
    <>
      <Helmet>
        <title>About Recharge Travels - Our Journey Since 2014 | Recharge Travels</title>
        <meta name="description" content="Discover the inspiring journey of Recharge Travels since 2014. From humble beginnings to becoming Sri Lanka's premier tourist operator, learn about our resilience and commitment to excellence." />
      </Helmet>

      <style>{`
        :root {
          --primary-blue: #0066cc;
          --accent-gold: #ffa500;
          --dark-gray: #333333;
          --light-gray: #f5f5f5;
          --success-green: #28a745;
          --danger-red: #dc3545;
        }

        .fade-in-element {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }

        .animate-fade-in-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-recharge {
          height: 100vh;
          background: linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-gold) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .hero-recharge::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
          background-size: cover;
        }

        .hero-content-recharge {
          text-align: center;
          color: white;
          z-index: 1;
          max-width: 800px;
          padding: 0 20px;
          animation: fadeInUp 1.5s ease;
        }

        .stats-recharge {
          display: flex;
          gap: 50px;
          justify-content: center;
          margin-top: 3rem;
          flex-wrap: wrap;
        }

        .stat-item-recharge {
          text-align: center;
        }

        .stat-number-recharge {
          font-size: 3rem;
          font-weight: bold;
          display: block;
        }

        .timeline-section-recharge {
          padding: 80px 20px;
          background: var(--light-gray);
        }

        .timeline-recharge {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .timeline-recharge::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--primary-blue);
          transform: translateX(-50%);
        }

        .timeline-item-recharge {
          position: relative;
          padding: 30px 0;
        }

        .timeline-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          width: 45%;
          position: relative;
          transition: all 0.3s ease;
        }

        .timeline-item-recharge:nth-child(even) .timeline-content {
          margin-left: auto;
        }

        .timeline-content:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }

        .timeline-year-recharge {
          position: absolute;
          top: 30px;
          width: 100px;
          height: 100px;
          background: var(--accent-gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.5rem;
          color: white;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .timeline-content.crisis {
          border-left: 5px solid var(--danger-red);
        }

        .timeline-content.success {
          border-left: 5px solid var(--success-green);
        }

        .timeline-images-recharge {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 20px;
        }

        .timeline-image-recharge {
          width: 100%;
          height: 150px;
          background: var(--light-gray);
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 0.9rem;
        }

        .achievements-recharge {
          padding: 80px 20px;
          background: white;
        }

        .achievement-grid-recharge {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .achievement-card {
          background: linear-gradient(135deg, var(--primary-blue), var(--accent-gold));
          color: white;
          padding: 40px;
          border-radius: 15px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .achievement-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .fleet-recharge {
          padding: 80px 20px;
          background: var(--light-gray);
        }

        .fleet-gallery-recharge {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .vehicle-card {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .vehicle-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }

        .vehicle-image-recharge {
          width: 100%;
          height: 200px;
          background: var(--light-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
        }

        .reviews-recharge {
          padding: 80px 20px;
          background: white;
        }

        .review-platforms-recharge {
          display: flex;
          justify-content: center;
          gap: 50px;
          margin-bottom: 50px;
          flex-wrap: wrap;
        }

        .platform-icon-recharge {
          width: 80px;
          height: 80px;
          background: var(--primary-blue);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          margin: 0 auto 10px;
        }

        .review-grid-recharge {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .review-card {
          background: var(--light-gray);
          padding: 30px;
          border-radius: 10px;
          position: relative;
        }

        .admin-panel-recharge {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.9);
          z-index: 2000;
          overflow-y: auto;
        }

        .admin-content-recharge {
          background: white;
          max-width: 1200px;
          margin: 50px auto;
          padding: 40px;
          border-radius: 10px;
        }

        @media (max-width: 768px) {
          .hero-content-recharge h1 {
            font-size: 2.5rem;
          }

          .stats-recharge {
            flex-direction: column;
            gap: 20px;
          }

          .timeline-recharge::before {
            left: 30px;
          }

          .timeline-content {
            width: calc(100% - 80px);
            margin-left: 80px !important;
          }

          .timeline-year-recharge {
            left: 30px;
            width: 60px;
            height: 60px;
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero Section */}
        <section className="hero-recharge" id="home">
          <div className="hero-content-recharge">
            <h1 className="text-6xl mb-4 font-bold">Recharge Travels</h1>
            <p className="text-2xl mb-8 opacity-90">A Journey of Resilience Since 2014</p>
            <div className="stats-recharge">
              <div className="stat-item-recharge">
                <span className="stat-number-recharge">11+</span>
                <span className="text-lg opacity-80">Years of Service</span>
              </div>
              <div className="stat-item-recharge">
                <span className="stat-number-recharge">50+</span>
                <span className="text-lg opacity-80">Vehicles</span>
              </div>
              <div className="stat-item-recharge">
                <span className="stat-number-recharge">60+</span>
                <span className="text-lg opacity-80">Professional Drivers</span>
              </div>
              <div className="stat-item-recharge">
                <span className="stat-number-recharge">15,000+</span>
                <span className="text-lg opacity-80">Happy Travelers</span>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-blue-600 bg-opacity-95 backdrop-blur-sm z-50 px-12 py-4 shadow-lg">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="text-2xl font-bold text-white">Recharge Travels</div>
            <ul className="flex gap-8 list-none">
              <li><a href="#home" className="text-white hover:text-yellow-400 transition-colors duration-300">Home</a></li>
              <li><a href="#timeline" className="text-white hover:text-yellow-400 transition-colors duration-300">Our Journey</a></li>
              <li><a href="#achievements" className="text-white hover:text-yellow-400 transition-colors duration-300">Achievements</a></li>
              <li><a href="#fleet" className="text-white hover:text-yellow-400 transition-colors duration-300">Our Fleet</a></li>
              <li><a href="#reviews" className="text-white hover:text-yellow-400 transition-colors duration-300">Reviews</a></li>
              <li><button onClick={openAdmin} className="bg-yellow-400 text-blue-600 px-5 py-2 rounded-full font-bold hover:transform hover:-translate-y-1 transition-all duration-300">Admin Panel</button></li>
            </ul>
          </div>
        </nav>

        {/* Timeline Section */}
        <section className="timeline-section-recharge" id="timeline">
          <h2 className="text-5xl font-bold text-center mb-12 text-blue-600">Our Journey Through Time</h2>
          <div className="timeline-recharge">
            {/* 2014 */}
            <div className="timeline-item-recharge">
              <div className="timeline-year-recharge">2014</div>
              <div className="timeline-content success fade-in-element">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">The Beginning</h3>
                <p className="mb-4">Recharge Travels was founded in Colombo with a vision to provide exceptional travel services. Starting with humble beginnings, we set out to redefine tourism in Sri Lanka.</p>
                <div className="timeline-images-recharge">
                  <div className="timeline-image-recharge">First Office Photo</div>
                  <div className="timeline-image-recharge">Founding Team</div>
                </div>
              </div>
            </div>

            {/* 2015 */}
            <div className="timeline-item-recharge">
              <div className="timeline-year-recharge">2015</div>
              <div className="timeline-content success fade-in-element">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">Expansion & Recognition</h3>
                <p className="mb-4">Opened our second office in Colombo Bambalapitiya and received official approval from the Sri Lankan Tourism Board as a certified travel agency. This marked our official entry into the professional tourism sector.</p>
                <div className="timeline-images-recharge">
                  <div className="timeline-image-recharge">Tourism Board Certificate</div>
                  <div className="timeline-image-recharge">Bambalapitiya Office</div>
                </div>
              </div>
            </div>

            {/* 2018 */}
            <div className="timeline-item-recharge">
              <div className="timeline-year-recharge">2018</div>
              <div className="timeline-content success fade-in-element">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">Major Milestone</h3>
                <p className="mb-4">Opened our flagship operation base in Katunayake on over 2 acres of land near CMB Airport. The facility was inaugurated by Tourism Minister John Amarathunga with MP Selvam Adaikalanathan in attendance. Our fleet grew to 50+ vehicles with 60 professional drivers.</p>
                <div className="timeline-images-recharge">
                  <div className="timeline-image-recharge">Grand Opening Ceremony</div>
                  <div className="timeline-image-recharge">Fleet at Katunayake</div>
                  <div className="timeline-image-recharge">Minister's Visit</div>
                  <div className="timeline-image-recharge">Operations Center</div>
                </div>
              </div>
            </div>

            {/* 2017-2019 Awards */}
            <div className="timeline-item-recharge">
              <div className="timeline-year-recharge">2017-19</div>
              <div className="timeline-content success fade-in-element">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">Excellence Recognized</h3>
                <p className="mb-4">Received TripAdvisor Certificate of Excellence for three consecutive years (2017, 2018, 2019). Opened our Jaffna branch at Cargills Square. Established partnerships with major platforms including GetTransfer and Booking.com.</p>
                <div className="timeline-images-recharge">
                  <div className="timeline-image-recharge">TripAdvisor Awards</div>
                  <div className="timeline-image-recharge">Jaffna Branch</div>
                </div>
              </div>
            </div>

            {/* 2019 Crisis & Recovery */}
            <div className="timeline-item-recharge">
              <div className="timeline-year-recharge">2019</div>
              <div className="timeline-content crisis fade-in-element">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">Crisis & Remarkable Recovery</h3>
                <p className="mb-4">April's Easter bombings severely impacted tourism. However, in August, we secured a major contract with the Bohra Muslim community, providing 50 buses and transporting over 15,000 people across Sri Lanka for 2 weeks. This helped us recover and grow stronger.</p>
                <div className="timeline-images-recharge">
                  <div className="timeline-image-recharge">Bohra Event Fleet</div>
                  <div className="timeline-image-recharge">Community Service</div>
                </div>
              </div>
            </div>

            {/* 2020-2022 Pandemic */}
            <div className="timeline-item-recharge">
              <div className="timeline-year-recharge">2020-22</div>
              <div className="timeline-content crisis fade-in-element">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">Pandemic Challenges</h3>
                <p className="mb-4">COVID-19 forced airport closure from February 2020. Six months of complete curfew led to vehicles being stolen and office vandalism. Despite these setbacks, we persevered and began our slow recovery in 2022.</p>
                <div className="timeline-images-recharge">
                  <div className="timeline-image-recharge">Empty Airport</div>
                  <div className="timeline-image-recharge">Team During Crisis</div>
                </div>
              </div>
            </div>

            {/* 2022-2024 Economic Crisis */}
            <div className="timeline-item-recharge">
              <div className="timeline-year-recharge">2022-24</div>
              <div className="timeline-content crisis fade-in-element">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">Economic Challenges</h3>
                <p className="mb-4">Sri Lanka's worst economic crisis created unprecedented challenges. Despite immense pressure on operations and vehicle payments, we maintained our commitment to service and kept our core team together.</p>
                <div className="timeline-images-recharge">
                  <div className="timeline-image-recharge">Team Resilience</div>
                  <div className="timeline-image-recharge">Adaptation Strategies</div>
                </div>
              </div>
            </div>

            {/* 2025 Comeback */}
            <div className="timeline-item-recharge">
              <div className="timeline-year-recharge">2025</div>
              <div className="timeline-content success fade-in-element">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">The Phoenix Rises</h3>
                <p className="mb-4">Mid-2025 marks our triumphant return! With renewed energy and determination, Recharge Travels is back to reclaim our position as Sri Lanka's premier tourist operator. Our journey of resilience continues stronger than ever.</p>
                <div className="timeline-images-recharge">
                  <div className="timeline-image-recharge">New Beginning</div>
                  <div className="timeline-image-recharge">Future Vision</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="achievements-recharge" id="achievements">
          <h2 className="text-5xl font-bold text-center mb-12 text-blue-600">Our Achievements</h2>
          <div className="achievement-grid-recharge">
            <div className="achievement-card fade-in-element">
              <div className="text-5xl mb-5">🏆</div>
              <h3 className="text-2xl font-semibold mb-4">TripAdvisor Excellence</h3>
              <p>Certificate of Excellence winner for 3 consecutive years (2017-2019)</p>
            </div>
            <div className="achievement-card fade-in-element">
              <div className="text-5xl mb-5">🤝</div>
              <h3 className="text-2xl font-semibold mb-4">Major Partnerships</h3>
              <p>Trusted partner of GetTransfer, Booking.com, and other global platforms</p>
            </div>
            <div className="achievement-card fade-in-element">
              <div className="text-5xl mb-5">🚌</div>
              <h3 className="text-2xl font-semibold mb-4">Large Scale Operations</h3>
              <p>Successfully managed transport for 15,000+ people in a single event</p>
            </div>
            <div className="achievement-card fade-in-element">
              <div className="text-5xl mb-5">⭐</div>
              <h3 className="text-2xl font-semibold mb-4">Customer Satisfaction</h3>
              <p>Thousands of positive reviews across all major platforms</p>
            </div>
            <div className="achievement-card fade-in-element">
              <div className="text-5xl mb-5">✈️</div>
              <h3 className="text-2xl font-semibold mb-4">Airport Specialists</h3>
              <p>24/7 airport transfer services with strategic location near CMB</p>
            </div>
            <div className="achievement-card fade-in-element">
              <div className="text-5xl mb-5">🌍</div>
              <h3 className="text-2xl font-semibold mb-4">Island-Wide Coverage</h3>
              <p>Operations in Colombo, Katunayake, and Jaffna</p>
            </div>
          </div>
        </section>

        {/* Fleet Section */}
        <section className="fleet-recharge" id="fleet">
          <h2 className="text-5xl font-bold text-center mb-12 text-blue-600">Our Fleet</h2>
          <div className="fleet-gallery-recharge">
            <div className="vehicle-card fade-in-element">
              <div className="vehicle-image-recharge">Luxury Car Photo</div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Luxury Sedans</h3>
                <p className="text-gray-600">Premium vehicles for executive travel</p>
              </div>
            </div>
            <div className="vehicle-card fade-in-element">
              <div className="vehicle-image-recharge">SUV Photo</div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">SUVs</h3>
                <p className="text-gray-600">Comfortable vehicles for family tours</p>
              </div>
            </div>
            <div className="vehicle-card fade-in-element">
              <div className="vehicle-image-recharge">Van Photo</div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Tourist Vans</h3>
                <p className="text-gray-600">Spacious vans for group travel</p>
              </div>
            </div>
            <div className="vehicle-card fade-in-element">
              <div className="vehicle-image-recharge">Bus Photo</div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Tourist Buses</h3>
                <p className="text-gray-600">Large capacity buses for events</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="reviews-recharge" id="reviews">
          <h2 className="text-5xl font-bold text-center mb-12 text-blue-600">What Our Customers Say</h2>
          <div className="review-platforms-recharge">
            <div className="text-center">
              <div className="platform-icon-recharge">T</div>
              <p className="font-semibold">TripAdvisor</p>
            </div>
            <div className="text-center">
              <div className="platform-icon-recharge">G</div>
              <p className="font-semibold">Google Reviews</p>
            </div>
            <div className="text-center">
              <div className="platform-icon-recharge">F</div>
              <p className="font-semibold">Facebook</p>
            </div>
          </div>
          <div className="review-grid-recharge">
            <div className="review-card fade-in-element">
              <div className="text-yellow-400 text-xl mb-4">★★★★★</div>
              <p className="italic mb-4">"Excellent service! Professional drivers and well-maintained vehicles. Highly recommended for airport transfers."</p>
              <p className="font-bold text-blue-600">- John D., TripAdvisor</p>
            </div>
            <div className="review-card fade-in-element">
              <div className="text-yellow-400 text-xl mb-4">★★★★★</div>
              <p className="italic mb-4">"Used Recharge Travels for our family vacation. They made our Sri Lanka tour unforgettable!"</p>
              <p className="font-bold text-blue-600">- Sarah M., Google</p>
            </div>
            <div className="review-card fade-in-element">
              <div className="text-yellow-400 text-xl mb-4">★★★★★</div>
              <p className="italic mb-4">"Reliable and punctual. They handled our large group event transportation perfectly."</p>
              <p className="font-bold text-blue-600">- Ahmed K., Facebook</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center gap-12 mb-8 flex-wrap">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Colombo Office</h3>
                <p>Bambalapitiya, Colombo</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Katunayake HQ</h3>
                <p>Near CMB Airport</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Jaffna Branch</h3>
                <p>Cargills Square, Jaffna</p>
              </div>
            </div>
            <p>&copy; 2025 Recharge Travels. Rising Stronger Than Ever.</p>
          </div>
        </footer>

        {/* Admin Panel */}
        <div className="admin-panel-recharge" id="adminPanel">
          <div className="admin-content-recharge">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-blue-600">Admin Panel - Content Management</h2>
              <button onClick={closeAdmin} className="text-4xl text-gray-600 hover:text-gray-800">&times;</button>
            </div>

            {/* Timeline Event Upload */}
            <div className="mb-10 p-8 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-semibold text-blue-600 mb-6">Add Timeline Event</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-2 font-bold">Year</label>
                  <input type="text" placeholder="e.g., 2025" className="w-full p-3 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block mb-2 font-bold">Event Type</label>
                  <select className="w-full p-3 border border-gray-300 rounded-md">
                    <option>Success</option>
                    <option>Crisis</option>
                    <option>Milestone</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-bold">Event Title</label>
                <input type="text" placeholder="e.g., Grand Opening" className="w-full p-3 border border-gray-300 rounded-md" />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-bold">Description</label>
                <textarea placeholder="Describe the event..." className="w-full p-3 border border-gray-300 rounded-md min-h-24 resize-y" />
              </div>
              <div>
                <label htmlFor="timeline-images" className="inline-block px-5 py-3 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-yellow-400 transition-colors">
                  Upload Event Photos
                </label>
                <input type="file" id="timeline-images" multiple accept="image/*" className="hidden" />
              </div>
            </div>

            {/* Vehicle Upload */}
            <div className="mb-10 p-8 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-semibold text-blue-600 mb-6">Add Vehicle</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-2 font-bold">Vehicle Type</label>
                  <input type="text" placeholder="e.g., Luxury Sedan" className="w-full p-3 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block mb-2 font-bold">Model</label>
                  <input type="text" placeholder="e.g., Toyota Camry" className="w-full p-3 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-bold">Description</label>
                <textarea placeholder="Vehicle features and capacity..." className="w-full p-3 border border-gray-300 rounded-md min-h-24 resize-y" />
              </div>
              <div>
                <label htmlFor="vehicle-image" className="inline-block px-5 py-3 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-yellow-400 transition-colors">
                  Upload Vehicle Photo
                </label>
                <input type="file" id="vehicle-image" accept="image/*" className="hidden" />
              </div>
            </div>

            <button onClick={saveContent} className="bg-green-600 text-white px-10 py-4 rounded-md text-lg font-semibold hover:transform hover:-translate-y-1 transition-all duration-300">
              Save All Content
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutRechargeTravel
