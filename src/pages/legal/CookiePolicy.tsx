import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Cookie, Shield, Settings, Info, CheckCircle, XCircle, Clock, Globe, Mail, Database } from 'lucide-react';

const CookiePolicy = () => {
    const lastUpdated = 'December 5, 2025';

    const cookieTypes = [
        {
            name: 'Strictly Necessary',
            icon: Shield,
            color: 'emerald',
            required: true,
            description: 'Essential cookies for basic website functionality and security.',
            examples: [
                { name: '__Host-session', purpose: 'Session management', duration: 'Session' },
                { name: 'csrf_token', purpose: 'Security protection', duration: 'Session' },
                { name: 'cookie_consent', purpose: 'Consent preferences', duration: '1 year' },
            ]
        },
        {
            name: 'Analytics',
            icon: Database,
            color: 'blue',
            required: false,
            description: 'Help us understand how visitors interact with our website.',
            examples: [
                { name: '_ga', purpose: 'Google Analytics tracking', duration: '2 years' },
                { name: '_gid', purpose: 'User distinction', duration: '24 hours' },
                { name: '_gat', purpose: 'Throttle request rate', duration: '1 minute' },
            ]
        },
        {
            name: 'Marketing',
            icon: Globe,
            color: 'purple',
            required: false,
            description: 'Used to deliver personalized advertisements and track campaigns.',
            examples: [
                { name: '_fbp', purpose: 'Facebook tracking', duration: '3 months' },
                { name: '_gcl_au', purpose: 'Google Ads conversion', duration: '3 months' },
                { name: 'NID', purpose: 'Google preferences', duration: '6 months' },
            ]
        },
        {
            name: 'Functional',
            icon: Settings,
            color: 'orange',
            required: false,
            description: 'Enable enhanced functionality and personalization features.',
            examples: [
                { name: 'language', purpose: 'Language preference', duration: '1 year' },
                { name: 'currency', purpose: 'Currency preference', duration: '1 year' },
                { name: 'recently_viewed', purpose: 'Recently viewed items', duration: '30 days' },
            ]
        },
    ];

    return (
        <>
            <Helmet>
                <title>Cookie Policy | Recharge Travels & Tours</title>
                <meta name="description" content="Learn about the cookies we use on our website. Understand how to manage your cookie preferences for a better browsing experience." />
            </Helmet>
            <Header />
            <main className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 text-white py-20">
                    <div className="container mx-auto px-4 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
                            <Cookie className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
                        <p className="text-lg text-amber-100 max-w-2xl mx-auto">
                            This policy explains what cookies are, how we use them, and how you can control them.
                        </p>
                        <p className="text-sm text-amber-200 mt-4">Last updated: {lastUpdated}</p>
                    </div>
                </section>

                {/* Content */}
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-4xl">

                        {/* What Are Cookies */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <Info className="w-6 h-6 text-amber-600" />
                                <h2 className="text-2xl font-bold text-gray-900">What Are Cookies?</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Cookies are small text files that are placed on your computer or mobile device when you visit a website.
                                They are widely used to make websites work more efficiently and provide information to website owners.
                            </p>
                            <p className="text-gray-600 leading-relaxed mt-4">
                                Cookies can be "persistent" (remaining on your device until deleted) or "session" cookies
                                (deleted when you close your browser).
                            </p>
                        </div>

                        {/* Cookie Types */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookies We Use</h2>
                            <div className="space-y-6">
                                {cookieTypes.map((type, idx) => (
                                    <div key={idx} className={`border rounded-2xl overflow-hidden ${type.required ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200'
                                        }`}>
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg bg-${type.color}-100`}>
                                                        <type.icon className={`w-5 h-5 text-${type.color}-600`} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">{type.name} Cookies</h3>
                                                        <p className="text-sm text-gray-500">{type.description}</p>
                                                    </div>
                                                </div>
                                                {type.required ? (
                                                    <span className="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Required
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                                        Optional
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-4 overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="text-left text-gray-500 border-b border-gray-200">
                                                            <th className="pb-2 font-medium">Cookie Name</th>
                                                            <th className="pb-2 font-medium">Purpose</th>
                                                            <th className="pb-2 font-medium">Duration</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-gray-600">
                                                        {type.examples.map((cookie, i) => (
                                                            <tr key={i} className="border-b border-gray-100 last:border-0">
                                                                <td className="py-2 font-mono text-xs">{cookie.name}</td>
                                                                <td className="py-2">{cookie.purpose}</td>
                                                                <td className="py-2 flex items-center gap-1">
                                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                                    {cookie.duration}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Managing Cookies */}
                        <div className="mb-12 bg-blue-50 border border-blue-100 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Settings className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-gray-900">Managing Your Cookie Preferences</h2>
                            </div>
                            <p className="text-gray-600 mb-4">You can control cookies in several ways:</p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>Cookie Banner:</strong> Use our cookie consent banner to customize your preferences</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>Browser Settings:</strong> Most browsers allow you to control cookies through settings</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>Opt-Out Tools:</strong> Use tools like <a href="https://optout.aboutads.info" className="text-blue-600 hover:underline">aboutads.info</a> for ad tracking</span>
                                </li>
                            </ul>
                            <p className="text-sm text-gray-500 mt-4">
                                Note: Disabling certain cookies may affect your experience on our website.
                            </p>
                        </div>

                        {/* Third-Party Cookies */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <Globe className="w-6 h-6 text-amber-600" />
                                <h2 className="text-2xl font-bold text-gray-900">Third-Party Cookies</h2>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Some cookies are placed by third-party services that appear on our pages:
                            </p>
                            <ul className="space-y-2 text-gray-600">
                                <li><strong>Google Analytics:</strong> Website analytics and user behavior</li>
                                <li><strong>Google Maps:</strong> Interactive maps for destination locations</li>
                                <li><strong>Facebook Pixel:</strong> Ad tracking and remarketing</li>
                                <li><strong>Stripe:</strong> Secure payment processing</li>
                            </ul>
                            <p className="text-gray-600 mt-4">
                                These third parties have their own privacy policies. We encourage you to review them.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Cookies?</h2>
                            <p className="text-gray-600 mb-4">
                                If you have any questions about our use of cookies, please contact us:
                            </p>
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-amber-600" />
                                <a href="mailto:privacy@rechargetravels.com" className="text-amber-600 hover:underline">
                                    privacy@rechargetravels.com
                                </a>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default CookiePolicy;
