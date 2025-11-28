// Printable Itinerary Component with Google Map Route and Recharge Travel Branding
import { useRef, forwardRef, useImperativeHandle } from 'react';
import { MapPin, Calendar, Users, DollarSign, Clock, Hotel, Utensils, Car, Phone, Mail, Globe } from 'lucide-react';
import { GeneratedItinerary, TripPreferences } from '@/services/geminiTripPlannerService';

interface PrintableItineraryProps {
  itinerary: GeneratedItinerary;
  preferences: TripPreferences;
  vehicleDetails?: {
    type: string;
    dailyRate: number;
    totalDays: number;
  };
}

export interface PrintableItineraryHandle {
  print: () => void;
}

const PrintableItinerary = forwardRef<PrintableItineraryHandle, PrintableItineraryProps>(
  ({ itinerary, preferences, vehicleDetails }, ref) => {
    const printRef = useRef<HTMLDivElement>(null);

    // Get all unique locations for the map
    const locations = itinerary.days.map(day => day.location);
    const uniqueLocations = [...new Set(locations)];

    // Generate Google Maps static image URL with route
    const generateMapUrl = () => {
      const markers = uniqueLocations.map((loc, i) =>
        `markers=color:red%7Clabel:${i + 1}%7C${encodeURIComponent(loc + ', Sri Lanka')}`
      ).join('&');

      // Create path between locations
      const path = uniqueLocations.map(loc => encodeURIComponent(loc + ', Sri Lanka')).join('|');

      return `https://maps.googleapis.com/maps/api/staticmap?size=800x400&maptype=roadmap&${markers}&path=color:0x0000ff|weight:3|${path}&key=AIzaSyBMXM3xNrL8zKu1fi1dbdj0VbkJK2MRxgM`;
    };

    // Generate Google Maps embed URL for interactive map
    const generateEmbedUrl = () => {
      const waypoints = uniqueLocations.slice(1, -1).map(loc => encodeURIComponent(loc + ', Sri Lanka')).join('|');
      const origin = encodeURIComponent(uniqueLocations[0] + ', Sri Lanka');
      const destination = encodeURIComponent(uniqueLocations[uniqueLocations.length - 1] + ', Sri Lanka');

      return `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBMXM3xNrL8zKu1fi1dbdj0VbkJK2MRxgM&origin=${origin}&destination=${destination}&waypoints=${waypoints}&mode=driving`;
    };

    const handlePrint = () => {
      const printContent = printRef.current;
      if (!printContent) return;

      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${itinerary.title} - Recharge Travels</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background: #fff;
              }
              .print-container { max-width: 800px; margin: 0 auto; padding: 20px; }

              /* Header */
              .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 3px solid #0d9488;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .logo { display: flex; align-items: center; gap: 15px; }
              .logo-icon {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #0d9488, #7c3aed);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                font-weight: bold;
              }
              .company-name { font-size: 28px; font-weight: bold; color: #0d9488; }
              .company-tagline { font-size: 12px; color: #666; }
              .contact-info { text-align: right; font-size: 11px; color: #666; }

              /* Title Section */
              .title-section {
                background: linear-gradient(135deg, #f0fdfa, #faf5ff);
                border-radius: 16px;
                padding: 25px;
                margin-bottom: 25px;
              }
              .title { font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
              .summary { color: #4b5563; font-size: 14px; }
              .trip-stats {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
                margin-top: 20px;
              }
              .stat-box {
                background: white;
                border-radius: 10px;
                padding: 12px;
                text-align: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
              }
              .stat-label { font-size: 11px; color: #6b7280; text-transform: uppercase; }
              .stat-value { font-size: 20px; font-weight: bold; color: #0d9488; }

              /* Map Section */
              .map-section {
                margin-bottom: 25px;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              }
              .map-title {
                background: #0d9488;
                color: white;
                padding: 12px 20px;
                font-weight: bold;
              }
              .map-container { height: 300px; background: #f3f4f6; position: relative; }
              .map-placeholder {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: #6b7280;
              }
              .route-markers {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                padding: 15px 20px;
                background: #f9fafb;
              }
              .marker {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 6px 12px;
                background: white;
                border-radius: 20px;
                font-size: 12px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              .marker-number {
                width: 22px;
                height: 22px;
                background: #0d9488;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
              }

              /* Vehicle & Budget Section */
              .budget-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 25px;
              }
              .budget-card {
                background: #f9fafb;
                border-radius: 12px;
                padding: 20px;
              }
              .budget-card h3 {
                font-size: 14px;
                font-weight: 600;
                color: #374151;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              .budget-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px dashed #e5e7eb;
                font-size: 13px;
              }
              .budget-row:last-child { border: none; }
              .budget-total {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                font-weight: bold;
                font-size: 16px;
                border-top: 2px solid #0d9488;
                margin-top: 10px;
                color: #0d9488;
              }

              /* Day-by-Day Itinerary */
              .days-section { margin-bottom: 25px; }
              .day-card {
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                margin-bottom: 15px;
                overflow: hidden;
                page-break-inside: avoid;
              }
              .day-header {
                background: linear-gradient(135deg, #0d9488, #059669);
                color: white;
                padding: 12px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              .day-number { font-size: 18px; font-weight: bold; }
              .day-location { font-size: 14px; opacity: 0.9; }
              .day-content { padding: 15px 20px; }
              .activity {
                display: flex;
                gap: 15px;
                padding: 10px 0;
                border-bottom: 1px solid #f3f4f6;
              }
              .activity:last-child { border: none; }
              .activity-time {
                min-width: 70px;
                font-size: 12px;
                font-weight: 600;
                color: #0d9488;
              }
              .activity-details { flex: 1; }
              .activity-name { font-weight: 600; font-size: 13px; color: #1f2937; }
              .activity-desc { font-size: 12px; color: #6b7280; }
              .activity-meta { font-size: 11px; color: #9ca3af; margin-top: 4px; }

              .day-footer {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                padding: 15px 20px;
                background: #f9fafb;
              }
              .footer-item { font-size: 12px; }
              .footer-label { color: #6b7280; font-weight: 500; }
              .footer-value { color: #1f2937; }

              /* Highlights */
              .highlights {
                background: #faf5ff;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 25px;
              }
              .highlights h3 { color: #7c3aed; margin-bottom: 12px; }
              .highlight-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
              }
              .highlight-item {
                background: white;
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 12px;
                color: #6b21a8;
                border: 1px solid #ddd6fe;
              }

              /* Footer */
              .footer {
                border-top: 2px solid #e5e7eb;
                padding-top: 20px;
                margin-top: 30px;
                text-align: center;
              }
              .footer-logo {
                font-size: 20px;
                font-weight: bold;
                color: #0d9488;
                margin-bottom: 10px;
              }
              .footer-text { font-size: 11px; color: #6b7280; }
              .footer-contact {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin-top: 15px;
                font-size: 12px;
                color: #4b5563;
              }

              /* Print Styles */
              @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .print-container { padding: 0; }
                .day-card { page-break-inside: avoid; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };

    useImperativeHandle(ref, () => ({
      print: handlePrint
    }));

    return (
      <div ref={printRef} className="print-container">
        {/* Header with Logo */}
        <div className="header">
          <div className="logo">
            <div className="logo-icon">RT</div>
            <div>
              <div className="company-name">Recharge Travels</div>
              <div className="company-tagline">Your Premium Sri Lanka Experience</div>
            </div>
          </div>
          <div className="contact-info">
            <div>+94 77 772 1999</div>
            <div>info@rechargetravels.com</div>
            <div>www.rechargetravels.com</div>
          </div>
        </div>

        {/* Title Section */}
        <div className="title-section">
          <div className="title">{itinerary.title}</div>
          <div className="summary">{itinerary.summary}</div>
          <div className="trip-stats">
            <div className="stat-box">
              <div className="stat-label">Duration</div>
              <div className="stat-value">{itinerary.duration} Days</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Travelers</div>
              <div className="stat-value">{preferences.travelers.adults + preferences.travelers.children}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Budget</div>
              <div className="stat-value" style={{ textTransform: 'capitalize' }}>{preferences.budget}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Total Cost</div>
              <div className="stat-value">${itinerary.totalCost.total}</div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <div className="map-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📍</span> Your Journey Route
            </span>
          </div>
          <div className="map-container">
            <iframe
              src={generateEmbedUrl()}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="route-markers">
            {uniqueLocations.map((location, index) => (
              <div key={location} className="marker">
                <div className="marker-number">{index + 1}</div>
                <span>{location}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle & Budget Breakdown */}
        <div className="budget-section">
          <div className="budget-card">
            <h3>
              <span>🚗</span> Vehicle & Transport
            </h3>
            <div className="budget-row">
              <span>Vehicle Type</span>
              <span>{vehicleDetails?.type || 'Private Car with AC'}</span>
            </div>
            <div className="budget-row">
              <span>Daily Rate</span>
              <span>${vehicleDetails?.dailyRate || 50}/day</span>
            </div>
            <div className="budget-row">
              <span>Duration</span>
              <span>{itinerary.duration} days</span>
            </div>
            <div className="budget-row">
              <span>Driver Accommodation</span>
              <span>Included</span>
            </div>
            <div className="budget-row">
              <span>Fuel</span>
              <span>Included</span>
            </div>
            <div className="budget-total">
              <span>Transport Total</span>
              <span>${itinerary.totalCost.transport}</span>
            </div>
          </div>

          <div className="budget-card">
            <h3>
              <span>💰</span> Cost Breakdown
            </h3>
            <div className="budget-row">
              <span>Accommodation</span>
              <span>${itinerary.totalCost.accommodation}</span>
            </div>
            <div className="budget-row">
              <span>Activities & Entrances</span>
              <span>${itinerary.totalCost.activities}</span>
            </div>
            <div className="budget-row">
              <span>Transportation</span>
              <span>${itinerary.totalCost.transport}</span>
            </div>
            <div className="budget-row">
              <span>Meals</span>
              <span>${itinerary.totalCost.meals}</span>
            </div>
            <div className="budget-total">
              <span>Grand Total</span>
              <span>${itinerary.totalCost.total}</span>
            </div>
          </div>
        </div>

        {/* Trip Highlights */}
        <div className="highlights">
          <h3>✨ Trip Highlights</h3>
          <div className="highlight-list">
            {itinerary.highlights.map((highlight, i) => (
              <div key={i} className="highlight-item">{highlight}</div>
            ))}
          </div>
        </div>

        {/* Day by Day Itinerary */}
        <div className="days-section">
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>
            📅 Day-by-Day Itinerary
          </h3>

          {itinerary.days.map((day) => (
            <div key={day.day} className="day-card">
              <div className="day-header">
                <div>
                  <div className="day-number">Day {day.day}</div>
                  <div className="day-location">{day.location}</div>
                </div>
                <div style={{ fontSize: '13px' }}>{day.date}</div>
              </div>

              <div className="day-content">
                {day.activities.map((activity, i) => (
                  <div key={i} className="activity">
                    <div className="activity-time">{activity.time}</div>
                    <div className="activity-details">
                      <div className="activity-name">{activity.activity}</div>
                      <div className="activity-desc">{activity.description}</div>
                      <div className="activity-meta">
                        Duration: {activity.duration}
                        {activity.cost > 0 && ` • Cost: $${activity.cost}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="day-footer">
                <div className="footer-item">
                  <div className="footer-label">🏨 Accommodation</div>
                  <div className="footer-value">{day.accommodation.name}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    {day.accommodation.type} • ${day.accommodation.price}/night
                  </div>
                </div>
                <div className="footer-item">
                  <div className="footer-label">🍽️ Meals</div>
                  <div className="footer-value" style={{ fontSize: '11px' }}>
                    {typeof day.meals === 'object' ? (
                      <>
                        <div>Breakfast: {day.meals.breakfast}</div>
                        <div>Lunch: {day.meals.lunch}</div>
                        <div>Dinner: {day.meals.dinner}</div>
                      </>
                    ) : (
                      Array.isArray(day.meals) ? day.meals.join(' • ') : 'Included'
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Insights */}
        {itinerary.aiInsights && itinerary.aiInsights.length > 0 && (
          <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '20px', marginBottom: '25px' }}>
            <h3 style={{ color: '#15803d', marginBottom: '12px' }}>💡 Travel Tips</h3>
            <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#166534' }}>
              {itinerary.aiInsights.map((insight, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>{insight}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="footer">
          <div className="footer-logo">Recharge Travels</div>
          <div className="footer-text">
            This itinerary was generated by our AI Trip Planner. Prices are estimates and may vary.
            <br />
            Contact us for a confirmed quote and to book your journey.
          </div>
          <div className="footer-contact">
            <span>📞 +94 77 772 1999</span>
            <span>📧 info@rechargetravels.com</span>
            <span>🌐 www.rechargetravels.com</span>
          </div>
          <div style={{ marginTop: '15px', fontSize: '10px', color: '#9ca3af' }}>
            © {new Date().getFullYear()} Recharge Travels Sri Lanka. All rights reserved.
          </div>
        </div>
      </div>
    );
  }
);

PrintableItinerary.displayName = 'PrintableItinerary';

export default PrintableItinerary;
