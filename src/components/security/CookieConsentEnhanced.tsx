import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, Settings, X, ChevronDown, ChevronUp, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

/**
 * ENHANCED COOKIE CONSENT SYSTEM
 * 
 * GDPR/CCPA Compliant Cookie Consent with:
 * - Granular cookie preferences (Analytics, Marketing, Functional)
 * - Strictly Necessary cookies locked to "On"
 * - Explicit opt-in for non-essential cookies
 * - Timestamped consent with version tracking
 * - Legal audit trail in localStorage
 * - Responsive design with smooth animations
 */

interface CookiePreferences {
    necessary: boolean;      // Always true, cannot be disabled
    analytics: boolean;      // Google Analytics, etc.
    marketing: boolean;      // Ad tracking, remarketing
    functional: boolean;     // Preferences, enhanced features
}

interface ConsentRecord {
    preferences: CookiePreferences;
    timestamp: string;
    version: string;
    userAgent: string;
    consentId: string;
}

const CONSENT_VERSION = '1.0.0';
const CONSENT_KEY = 'cookie_consent';
const CONSENT_HISTORY_KEY = 'cookie_consent_history';

const generateConsentId = () => {
    return `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const CookieConsentEnhanced: React.FC = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false,
    });

    // Check if consent already given
    useEffect(() => {
        const storedConsent = localStorage.getItem(CONSENT_KEY);
        if (storedConsent) {
            try {
                const parsed: ConsentRecord = JSON.parse(storedConsent);
                // Check if consent version matches
                if (parsed.version === CONSENT_VERSION) {
                    setPreferences(parsed.preferences);
                    applyPreferences(parsed.preferences);
                } else {
                    // Version changed, show banner again
                    setShowBanner(true);
                }
            } catch {
                setShowBanner(true);
            }
        } else {
            // No consent, show banner after slight delay for better UX
            setTimeout(() => setShowBanner(true), 1500);
        }
    }, []);

    // Apply cookie preferences
    const applyPreferences = useCallback((prefs: CookiePreferences) => {
        // Analytics cookies
        if (prefs.analytics) {
            // Enable Google Analytics
            (window as any).gtag?.('consent', 'update', {
                'analytics_storage': 'granted'
            });
        } else {
            // Disable Google Analytics
            (window as any).gtag?.('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }

        // Marketing cookies
        if (prefs.marketing) {
            (window as any).gtag?.('consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted'
            });
        } else {
            (window as any).gtag?.('consent', 'update', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
            });
        }

        // Functional cookies
        if (prefs.functional) {
            (window as any).gtag?.('consent', 'update', {
                'functionality_storage': 'granted',
                'personalization_storage': 'granted'
            });
        } else {
            (window as any).gtag?.('consent', 'update', {
                'functionality_storage': 'denied',
                'personalization_storage': 'denied'
            });
        }

        // Dispatch custom event for other scripts to listen
        window.dispatchEvent(new CustomEvent('cookieConsentUpdate', { detail: prefs }));
    }, []);

    // Save consent with audit trail
    const saveConsent = useCallback((prefs: CookiePreferences) => {
        const consentRecord: ConsentRecord = {
            preferences: prefs,
            timestamp: new Date().toISOString(),
            version: CONSENT_VERSION,
            userAgent: navigator.userAgent,
            consentId: generateConsentId(),
        };

        // Save current consent
        localStorage.setItem(CONSENT_KEY, JSON.stringify(consentRecord));

        // Add to consent history for audit trail
        const historyStr = localStorage.getItem(CONSENT_HISTORY_KEY);
        const history: ConsentRecord[] = historyStr ? JSON.parse(historyStr) : [];
        history.push(consentRecord);
        // Keep only last 10 consent records
        if (history.length > 10) history.shift();
        localStorage.setItem(CONSENT_HISTORY_KEY, JSON.stringify(history));

        // Apply preferences
        applyPreferences(prefs);
        setShowBanner(false);
    }, [applyPreferences]);

    // Accept all cookies
    const handleAcceptAll = () => {
        const allAccepted: CookiePreferences = {
            necessary: true,
            analytics: true,
            marketing: true,
            functional: true,
        };
        setPreferences(allAccepted);
        saveConsent(allAccepted);
    };

    // Accept only necessary
    const handleRejectAll = () => {
        const necessaryOnly: CookiePreferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false,
        };
        setPreferences(necessaryOnly);
        saveConsent(necessaryOnly);
    };

    // Save custom preferences
    const handleSavePreferences = () => {
        saveConsent(preferences);
    };

    // Toggle individual preference
    const togglePreference = (key: keyof CookiePreferences) => {
        if (key === 'necessary') return; // Cannot toggle necessary
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!showBanner) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
            >
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-100">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-emerald-100 rounded-xl">
                                <Cookie className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-emerald-600" />
                                    Your Privacy Matters
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                                    You can choose which cookies to accept below.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowBanner(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Cookie Details (Expandable) */}
                    <AnimatePresence>
                        {showDetails && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 space-y-4 bg-gray-50 border-b border-gray-100">
                                    {/* Strictly Necessary */}
                                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium text-gray-900">Strictly Necessary</h4>
                                                <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">Required</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Essential for the website to function. Cannot be disabled.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="w-5 h-5 text-emerald-500" />
                                            <span className="text-sm font-medium text-emerald-600">Always On</span>
                                        </div>
                                    </div>

                                    {/* Analytics */}
                                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">Analytics Cookies</h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Help us understand how visitors interact with our website.
                                            </p>
                                        </div>
                                        <Switch
                                            checked={preferences.analytics}
                                            onCheckedChange={() => togglePreference('analytics')}
                                        />
                                    </div>

                                    {/* Marketing */}
                                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">Marketing Cookies</h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Used to deliver personalized ads and track ad campaign performance.
                                            </p>
                                        </div>
                                        <Switch
                                            checked={preferences.marketing}
                                            onCheckedChange={() => togglePreference('marketing')}
                                        />
                                    </div>

                                    {/* Functional */}
                                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">Functional Cookies</h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Enable enhanced functionality and personalization features.
                                            </p>
                                        </div>
                                        <Switch
                                            checked={preferences.functional}
                                            onCheckedChange={() => togglePreference('functional')}
                                        />
                                    </div>

                                    {/* Legal Links */}
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 pt-2">
                                        <a href="/privacy-policy" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                            Privacy Policy
                                        </a>
                                        <a href="/cookie-policy" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                            Cookie Policy
                                        </a>
                                        <a href="/terms-of-service" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                            Terms of Service
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowDetails(!showDetails)}
                            className="w-full md:w-auto order-3 md:order-1 text-gray-600"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            {showDetails ? 'Hide' : 'Customize'}
                            {showDetails ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                        </Button>

                        <div className="flex-1" />

                        <Button
                            variant="outline"
                            onClick={handleRejectAll}
                            className="w-full md:w-auto order-2 text-gray-600"
                        >
                            Reject All
                        </Button>

                        {showDetails ? (
                            <Button
                                onClick={handleSavePreferences}
                                className="w-full md:w-auto order-1 md:order-3 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                Save Preferences
                            </Button>
                        ) : (
                            <Button
                                onClick={handleAcceptAll}
                                className="w-full md:w-auto order-1 md:order-3 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                Accept All
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CookieConsentEnhanced;

// Utility hook to check consent status
export const useCookieConsent = () => {
    const [consent, setConsent] = useState<CookiePreferences | null>(null);

    useEffect(() => {
        const storedConsent = localStorage.getItem(CONSENT_KEY);
        if (storedConsent) {
            try {
                const parsed: ConsentRecord = JSON.parse(storedConsent);
                setConsent(parsed.preferences);
            } catch {
                setConsent(null);
            }
        }

        // Listen for consent updates
        const handleUpdate = (e: CustomEvent<CookiePreferences>) => {
            setConsent(e.detail);
        };

        window.addEventListener('cookieConsentUpdate', handleUpdate as EventListener);
        return () => window.removeEventListener('cookieConsentUpdate', handleUpdate as EventListener);
    }, []);

    return consent;
};
