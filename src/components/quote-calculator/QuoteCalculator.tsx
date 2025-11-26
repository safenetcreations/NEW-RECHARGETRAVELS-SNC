/**
 * RECHARGE TRAVELS - Quote Calculator Component
 * =============================================
 * Main component with multi-step booking flow
 */

import React, { useState } from 'react';
import { useQuoteCalculator } from '@/hooks/useQuoteCalculator';
import {
  DESTINATIONS,
  VEHICLES,
  ACCOMMODATION_TIERS,
  ACTIVITIES,
  ADDITIONAL_SERVICES,
} from '@/config/quoteCalculatorPricing';
import { Quote } from '@/utils/quoteCalculatorLogic';
import './QuoteCalculator.css';

// ============================================
// MAIN COMPONENT
// ============================================
const QuoteCalculator: React.FC = () => {
  const {
    trip,
    quote,
    isCalculating,
    errors,
    step,
    quickEstimate,
    recommendedVehicle,
    suggestedDays,
    isStepComplete,
    updateTrip,
    toggleDestination,
    toggleActivity,
    toggleService,
    calculateQuote,
    resetForm,
    nextStep,
    prevStep,
    goToStep,
    formatPrice,
  } = useQuoteCalculator();

  const steps = [
    { num: 1, title: 'Travelers & Dates', icon: '👥' },
    { num: 2, title: 'Destinations', icon: '📍' },
    { num: 3, title: 'Transport', icon: '🚗' },
    { num: 4, title: 'Accommodation', icon: '🏨' },
    { num: 5, title: 'Activities & Review', icon: '🎯' },
  ];

  return (
    <section className="quote-calculator-section py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="quote-calculator">
        <div className="calculator-header">
          <h2>Plan Your Sri Lanka Adventure</h2>
          <p>Get an instant quote for your custom tour</p>
        </div>

        <StepProgress steps={steps} currentStep={step} goToStep={goToStep} />

        <div className="calculator-content">
          {quickEstimate && (
            <div className="price-preview">
              <span className="label">Estimated from</span>
              <span className="price">{formatPrice(quickEstimate.low)}</span>
              <span className="per-person">
                ({formatPrice(quickEstimate.perPerson)}/person)
              </span>
            </div>
          )}

          <div className="step-content">
            {step === 1 && (
              <TravelersDateStep
                trip={trip}
                updateTrip={updateTrip}
                suggestedDays={suggestedDays}
              />
            )}

            {step === 2 && (
              <DestinationsStep
                selectedDestinations={trip.destinations}
                toggleDestination={toggleDestination}
                suggestedDays={suggestedDays}
              />
            )}

            {step === 3 && (
              <TransportStep
                trip={trip}
                updateTrip={updateTrip}
                recommendedVehicle={recommendedVehicle}
              />
            )}

            {step === 4 && (
              <AccommodationStep
                trip={trip}
                updateTrip={updateTrip}
              />
            )}

            {step === 5 && (
              <ActivitiesReviewStep
                trip={trip}
                toggleActivity={toggleActivity}
                toggleService={toggleService}
                quote={quote}
                calculateQuote={calculateQuote}
                isCalculating={isCalculating}
                formatPrice={formatPrice}
                updateTrip={updateTrip}
              />
            )}
          </div>

          {errors.length > 0 && (
            <div className="error-messages">
              {errors.map((error, i) => (
                <p key={i} className="error">⚠️ {error}</p>
              ))}
            </div>
          )}

          <div className="step-navigation">
            {step > 1 && (
              <button onClick={prevStep} className="btn-secondary">
                ← Previous
              </button>
            )}

            {step < 5 && (
              <button
                onClick={nextStep}
                className="btn-primary"
                disabled={!isStepComplete}
              >
                Next →
              </button>
            )}

            {step === 5 && !quote && (
              <button
                onClick={calculateQuote}
                className="btn-primary btn-large"
                disabled={isCalculating}
              >
                {isCalculating ? 'Calculating...' : '💰 Get My Quote'}
              </button>
            )}
          </div>
        </div>

        {quote && (
          <QuoteSummary
            quote={quote}
            formatPrice={formatPrice}
            onReset={resetForm}
          />
        )}
      </div>
    </section>
  );
};

// ============================================
// STEP PROGRESS COMPONENT
// ============================================
interface StepProgressProps {
  steps: { num: number; title: string; icon: string }[];
  currentStep: number;
  goToStep: (step: number) => void;
}

const StepProgress: React.FC<StepProgressProps> = ({ steps, currentStep, goToStep }) => (
  <div className="step-progress">
    {steps.map((s, index) => (
      <React.Fragment key={s.num}>
        <div
          className={`step ${currentStep >= s.num ? 'active' : ''} ${currentStep === s.num ? 'current' : ''}`}
          onClick={() => currentStep > s.num && goToStep(s.num)}
        >
          <span className="step-icon">{s.icon}</span>
          <span className="step-title">{s.title}</span>
        </div>
        {index < steps.length - 1 && <div className="step-line" />}
      </React.Fragment>
    ))}
  </div>
);

// ============================================
// STEP 1: TRAVELERS & DATES
// ============================================
interface TravelersDateStepProps {
  trip: ReturnType<typeof useQuoteCalculator>['trip'];
  updateTrip: ReturnType<typeof useQuoteCalculator>['updateTrip'];
  suggestedDays: number;
}

const TravelersDateStep: React.FC<TravelersDateStepProps> = ({ trip, updateTrip, suggestedDays }) => {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="step-form">
      <h3>Who's Traveling?</h3>

      <div className="form-row">
        <div className="form-group">
          <label>Adults (12+)</label>
          <div className="number-input">
            <button
              onClick={() => updateTrip('adults', Math.max(1, trip.adults - 1))}
              disabled={trip.adults <= 1}
            >
              −
            </button>
            <span>{trip.adults}</span>
            <button onClick={() => updateTrip('adults', trip.adults + 1)}>+</button>
          </div>
        </div>

        <div className="form-group">
          <label>Children (2-11)</label>
          <div className="number-input">
            <button
              onClick={() => updateTrip('children', Math.max(0, trip.children - 1))}
              disabled={trip.children <= 0}
            >
              −
            </button>
            <span>{trip.children}</span>
            <button onClick={() => updateTrip('children', trip.children + 1)}>+</button>
          </div>
        </div>
      </div>

      <h3>When Are You Traveling?</h3>

      <div className="form-row">
        <div className="form-group">
          <label>Arrival Date</label>
          <input
            type="date"
            value={trip.startDate}
            min={minDateStr}
            onChange={(e) => updateTrip('startDate', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Trip Duration (Days)</label>
          <select
            value={trip.days}
            onChange={(e) => updateTrip('days', parseInt(e.target.value))}
          >
            <option value="">Select duration</option>
            {[...Array(21)].map((_, i) => (
              <option key={i + 3} value={i + 3}>
                {i + 3} Days / {i + 2} Nights
                {i + 3 === suggestedDays && trip.destinations.length > 0 ? ' (Recommended)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {trip.startDate && trip.days > 0 && (
        <div className="date-summary">
          📅 <strong>{trip.startDate}</strong> to <strong>{trip.endDate}</strong>
          <span className="nights-badge">{trip.nights} nights</span>
        </div>
      )}
    </div>
  );
};

// ============================================
// STEP 2: DESTINATIONS
// ============================================
interface DestinationsStepProps {
  selectedDestinations: string[];
  toggleDestination: (id: string) => void;
  suggestedDays: number;
}

const DestinationsStep: React.FC<DestinationsStepProps> = ({ selectedDestinations, toggleDestination, suggestedDays }) => {
  const [filter, setFilter] = useState('all');

  const regions = [...new Set(Object.values(DESTINATIONS).map(d => d.region))];

  const filteredDestinations = Object.entries(DESTINATIONS).filter(([, dest]) =>
    filter === 'all' || dest.region === filter
  );

  return (
    <div className="step-form">
      <h3>Where Do You Want to Go?</h3>
      <p className="step-description">Select the places you'd like to visit. We'll plan the best route.</p>

      <div className="region-filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {regions.map(region => (
          <button
            key={region}
            className={filter === region ? 'active' : ''}
            onClick={() => setFilter(region)}
          >
            {region}
          </button>
        ))}
      </div>

      <div className="destinations-grid">
        {filteredDestinations.map(([id, dest]) => (
          <div
            key={id}
            className={`destination-card ${selectedDestinations.includes(id) ? 'selected' : ''}`}
            onClick={() => toggleDestination(id)}
          >
            <span className="dest-icon">{dest.icon}</span>
            <span className="dest-name">{dest.name}</span>
            <span className="dest-region">{dest.region}</span>
            {dest.entranceFee?.adult > 0 && (
              <span className="dest-fee">${dest.entranceFee.adult} entry</span>
            )}
            {selectedDestinations.includes(id) && (
              <span className="check-mark">✓</span>
            )}
          </div>
        ))}
      </div>

      {selectedDestinations.length > 0 && (
        <div className="selection-summary">
          <p>
            <strong>{selectedDestinations.length}</strong> destinations selected
            {suggestedDays > 0 && (
              <span> • Suggested: <strong>{suggestedDays}+ days</strong></span>
            )}
          </p>
          <div className="selected-tags">
            {selectedDestinations.map(id => (
              <span key={id} className="tag">
                {DESTINATIONS[id]?.icon} {DESTINATIONS[id]?.name}
                <button onClick={() => toggleDestination(id)}>×</button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// STEP 3: TRANSPORT
// ============================================
interface TransportStepProps {
  trip: ReturnType<typeof useQuoteCalculator>['trip'];
  updateTrip: ReturnType<typeof useQuoteCalculator>['updateTrip'];
  recommendedVehicle: ReturnType<typeof useQuoteCalculator>['recommendedVehicle'];
}

const TransportStep: React.FC<TransportStepProps> = ({ trip, updateTrip, recommendedVehicle }) => {
  const totalPax = trip.adults + trip.children;

  return (
    <div className="step-form">
      <h3>Choose Your Vehicle</h3>
      <p className="step-description">
        For {totalPax} traveler{totalPax > 1 ? 's' : ''}, we recommend:
        <strong> {recommendedVehicle?.name}</strong>
      </p>

      <div className="vehicles-grid">
        {Object.entries(VEHICLES).map(([id, vehicle]) => {
          const isTooSmall = vehicle.maxPassengers < totalPax;
          const isRecommended = recommendedVehicle?.id === id;

          return (
            <div
              key={id}
              className={`vehicle-card ${trip.vehicle === id ? 'selected' : ''} ${isTooSmall ? 'disabled' : ''}`}
              onClick={() => !isTooSmall && updateTrip('vehicle', id)}
            >
              {isRecommended && <span className="recommended-badge">Recommended</span>}
              <h4>{vehicle.name}</h4>
              <div className="vehicle-specs">
                <span>👥 Up to {vehicle.maxPassengers} passengers</span>
                <span>🧳 {vehicle.maxLuggage} large bags</span>
              </div>
              <div className="vehicle-features">
                {vehicle.features.map((f, i) => (
                  <span key={i} className="feature-tag">{f}</span>
                ))}
              </div>
              <div className="vehicle-price">
                <span className="price">${vehicle.pricePerDay}</span>
                <span className="period">/day</span>
              </div>
              {isTooSmall && (
                <div className="too-small-notice">
                  Too small for your group
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="transfer-options">
        <h4>Airport Transfers</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={trip.airportPickup}
            onChange={(e) => updateTrip('airportPickup', e.target.checked)}
          />
          Airport Pickup ($35) - Meet & greet with name board
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={trip.airportDropoff}
            onChange={(e) => updateTrip('airportDropoff', e.target.checked)}
          />
          Airport Drop-off ($35) - Comfortable transfer to airport
        </label>
      </div>
    </div>
  );
};

// ============================================
// STEP 4: ACCOMMODATION
// ============================================
interface AccommodationStepProps {
  trip: ReturnType<typeof useQuoteCalculator>['trip'];
  updateTrip: ReturnType<typeof useQuoteCalculator>['updateTrip'];
}

const AccommodationStep: React.FC<AccommodationStepProps> = ({ trip, updateTrip }) => {
  return (
    <div className="step-form">
      <h3>Select Your Accommodation Level</h3>
      <p className="step-description">
        All options include breakfast and AC rooms. We'll book the best available hotels in each location.
      </p>

      <div className="accommodation-grid">
        {Object.entries(ACCOMMODATION_TIERS).map(([id, tier]) => (
          <div
            key={id}
            className={`accommodation-card ${trip.accommodationTier === id ? 'selected' : ''}`}
            onClick={() => updateTrip('accommodationTier', id)}
          >
            <h4>{tier.name}</h4>
            <p className="description">{tier.description}</p>

            <div className="includes">
              <strong>Includes:</strong>
              <ul>
                {tier.includes.map((item, i) => (
                  <li key={i}>✓ {item}</li>
                ))}
              </ul>
            </div>

            <div className="sample-hotels">
              <strong>Examples:</strong> {tier.sampleHotels.join(', ')}
            </div>

            <div className="price">
              <span className="amount">From ${tier.pricePerNight.double}</span>
              <span className="period">/night (double)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// STEP 5: ACTIVITIES & REVIEW
// ============================================
interface ActivitiesReviewStepProps {
  trip: ReturnType<typeof useQuoteCalculator>['trip'];
  toggleActivity: (id: string) => void;
  toggleService: (id: string) => void;
  quote: Quote | null;
  calculateQuote: () => Quote | null;
  isCalculating: boolean;
  formatPrice: (amount: number) => string;
  updateTrip: ReturnType<typeof useQuoteCalculator>['updateTrip'];
}

const ActivitiesReviewStep: React.FC<ActivitiesReviewStepProps> = ({
  trip,
  toggleActivity,
  toggleService,
  formatPrice,
  updateTrip,
}) => {
  const relevantActivities = Object.entries(ACTIVITIES).filter(([, activity]) =>
    !activity.destination ||
    trip.destinations.includes(activity.destination) ||
    activity.destination === 'various'
  );

  const activityCategories = relevantActivities.reduce((acc, [id, activity]) => {
    const cat = activity.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ id, ...activity });
    return acc;
  }, {} as Record<string, Array<{ id: string } & typeof ACTIVITIES[string]>>);

  const categoryLabels: Record<string, string> = {
    safari: '🐆 Safari & Wildlife',
    water: '🌊 Water Activities',
    adventure: '🎢 Adventure',
    cultural: '🛕 Cultural Experiences',
    wellness: '🧘 Wellness',
    experience: '✨ Unique Experiences',
  };

  return (
    <div className="step-form">
      <h3>Add Activities & Experiences</h3>
      <p className="step-description">Optional: Enhance your trip with unique experiences</p>

      <div className="activities-section">
        {Object.entries(activityCategories).map(([category, activities]) => (
          <div key={category} className="activity-category">
            <h4>{categoryLabels[category] || category}</h4>
            <div className="activities-list">
              {activities.map(activity => (
                <label key={activity.id} className="activity-item">
                  <input
                    type="checkbox"
                    checked={trip.activities.includes(activity.id)}
                    onChange={() => toggleActivity(activity.id)}
                  />
                  <div className="activity-info">
                    <span className="name">{activity.name}</span>
                    <span className="duration">{activity.duration}</span>
                  </div>
                  <span className="price">
                    ${typeof activity.pricePerPerson === 'object'
                      ? activity.pricePerPerson.secondClass
                      : activity.pricePerPerson}/person
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="services-section">
        <h4>🛎️ Additional Services</h4>
        <div className="services-list">
          {['guide', 'photographer', 'wifi', 'simCard'].map(serviceId => {
            const service = ADDITIONAL_SERVICES[serviceId];
            if (!service) return null;

            return (
              <label key={serviceId} className="service-item">
                <input
                  type="checkbox"
                  checked={trip.services.includes(serviceId)}
                  onChange={() => toggleService(serviceId)}
                />
                <div className="service-info">
                  <span className="name">{service.name}</span>
                  <span className="description">{service.description}</span>
                </div>
                <span className="price">
                  ${service.pricePerDay || service.price}
                  {service.pricePerDay ? '/day' : ''}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="trip-preview">
        <h4>📋 Your Trip Summary</h4>
        <div className="preview-grid">
          <div className="preview-item">
            <span className="label">Travelers</span>
            <span className="value">{trip.adults} Adults, {trip.children} Children</span>
          </div>
          <div className="preview-item">
            <span className="label">Duration</span>
            <span className="value">{trip.days} Days / {trip.nights} Nights</span>
          </div>
          <div className="preview-item">
            <span className="label">Dates</span>
            <span className="value">{trip.startDate} → {trip.endDate}</span>
          </div>
          <div className="preview-item">
            <span className="label">Destinations</span>
            <span className="value">
              {trip.destinations.map(id => DESTINATIONS[id]?.name).join(' → ')}
            </span>
          </div>
          <div className="preview-item">
            <span className="label">Vehicle</span>
            <span className="value">{VEHICLES[trip.vehicle]?.name}</span>
          </div>
          <div className="preview-item">
            <span className="label">Accommodation</span>
            <span className="value">{ACCOMMODATION_TIERS[trip.accommodationTier]?.name}</span>
          </div>
        </div>
      </div>

      <div className="special-requests">
        <h4>💬 Special Requests (Optional)</h4>
        <textarea
          placeholder="Any dietary requirements, accessibility needs, special occasions, or other requests..."
          value={trip.specialRequests}
          onChange={(e) => updateTrip('specialRequests', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};

// ============================================
// QUOTE SUMMARY COMPONENT
// ============================================
interface QuoteSummaryProps {
  quote: Quote;
  formatPrice: (amount: number) => string;
  onReset: () => void;
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({ quote, formatPrice, onReset }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="quote-summary">
      <div className="quote-header">
        <h2>🎉 Your Custom Quote</h2>
        <p className="quote-id">Quote #{quote.quoteId}</p>
        <p className="valid-until">Valid until: {new Date(quote.validUntil).toLocaleDateString()}</p>
      </div>

      <div className="main-price">
        <div className="total">
          <span className="label">Total Trip Cost</span>
          <span className="amount">{formatPrice(quote.totals.grandTotal)}</span>
        </div>
        <div className="per-metrics">
          <span>{formatPrice(quote.totals.perPerson)} per person</span>
          <span>{formatPrice(quote.totals.perDay)} per day</span>
        </div>
      </div>

      <div className="currency-options">
        {Object.entries(quote.totals.currencies).map(([currency, amount]) => (
          <span key={currency} className="currency-tag">
            {currency}: {amount.toLocaleString()}
          </span>
        ))}
      </div>

      <div className="payment-terms">
        <div className="deposit">
          <span className="label">Book Now (20% Deposit)</span>
          <span className="amount">{formatPrice(quote.payment.deposit)}</span>
        </div>
        <div className="balance">
          <span className="label">Balance (Due 30 days before)</span>
          <span className="amount">{formatPrice(quote.payment.balance)}</span>
        </div>
      </div>

      <button
        className="toggle-details"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Hide' : 'Show'} Detailed Breakdown
      </button>

      {showDetails && (
        <div className="detailed-breakdown">
          {quote.breakdown.transport.items.length > 0 && (
            <div className="breakdown-section">
              <h4>🚗 Transport</h4>
              {quote.breakdown.transport.items.map((item, i) => (
                <div key={i} className="line-item">
                  <span className="name">{item.name}</span>
                  <span className="price">{formatPrice(item.total)}</span>
                </div>
              ))}
              <div className="subtotal">
                <span>Subtotal</span>
                <span>{formatPrice(quote.breakdown.transport.subtotal)}</span>
              </div>
            </div>
          )}

          {quote.breakdown.accommodation.items.length > 0 && (
            <div className="breakdown-section">
              <h4>🏨 Accommodation</h4>
              {quote.breakdown.accommodation.items.map((item, i) => (
                <div key={i} className="line-item">
                  <span className="name">{item.name} ({item.quantity})</span>
                  <span className="price">{formatPrice(item.total)}</span>
                </div>
              ))}
              <div className="subtotal">
                <span>Subtotal</span>
                <span>{formatPrice(quote.breakdown.accommodation.subtotal)}</span>
              </div>
            </div>
          )}

          {quote.breakdown.entranceFees.items.length > 0 && (
            <div className="breakdown-section">
              <h4>🎫 Entrance Fees</h4>
              {quote.breakdown.entranceFees.items.map((item, i) => (
                <div key={i} className="line-item">
                  <span className="name">{item.name} x{item.quantity}</span>
                  <span className="price">{formatPrice(item.total)}</span>
                </div>
              ))}
              <div className="subtotal">
                <span>Subtotal</span>
                <span>{formatPrice(quote.breakdown.entranceFees.subtotal)}</span>
              </div>
            </div>
          )}

          {quote.breakdown.activities.items.length > 0 && (
            <div className="breakdown-section">
              <h4>🎯 Activities</h4>
              {quote.breakdown.activities.items.map((item, i) => (
                <div key={i} className="line-item">
                  <span className="name">{item.name} x{item.quantity}</span>
                  <span className="price">{formatPrice(item.total)}</span>
                </div>
              ))}
              <div className="subtotal">
                <span>Subtotal</span>
                <span>{formatPrice(quote.breakdown.activities.subtotal)}</span>
              </div>
            </div>
          )}

          {quote.breakdown.discounts.items.length > 0 && (
            <div className="breakdown-section discounts">
              <h4>🏷️ Discounts Applied</h4>
              {quote.breakdown.discounts.items.map((item, i) => (
                <div key={i} className="line-item discount">
                  <span className="name">{item.name}</span>
                  <span className="price">-{formatPrice(Math.abs(item.total))}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="inclusions-exclusions">
        <div className="inclusions">
          <h4>✅ What's Included</h4>
          <ul>
            {quote.inclusions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="exclusions">
          <h4>❌ Not Included</h4>
          <ul>
            {quote.exclusions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="quote-actions">
        <button className="btn-primary btn-large">
          📧 Send Quote to Email
        </button>
        <button className="btn-secondary btn-large">
          💳 Book Now (Pay Deposit)
        </button>
        <button className="btn-whatsapp">
          💬 Discuss on WhatsApp
        </button>
        <button className="btn-outline" onClick={onReset}>
          Start New Quote
        </button>
      </div>

      <div className="trust-badges">
        <span>🛡️ SLTDA Licensed</span>
        <span>⭐ 4.9/5 TripAdvisor</span>
        <span>🔒 Secure Payment</span>
        <span>💯 Best Price Guarantee</span>
      </div>
    </div>
  );
};

export default QuoteCalculator;
