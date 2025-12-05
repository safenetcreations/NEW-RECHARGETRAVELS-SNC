import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, Scale, ShieldCheck, AlertTriangle, CreditCard, Calendar, RefreshCw, Ban, Globe, Mail, Phone } from 'lucide-react';

const TermsOfService = () => {
    const lastUpdated = 'December 5, 2025';
    const effectiveDate = 'December 5, 2025';

    return (
        <>
            <Helmet>
                <title>Terms of Service | Recharge Travels & Tours</title>
                <meta name="description" content="Read our terms of service for booking tours, hotels, and transportation in Sri Lanka. Understand your rights and obligations." />
            </Helmet>
            <Header />
            <main className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white py-20">
                    <div className="container mx-auto px-4 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
                            <Scale className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                            Please read these terms carefully before using our services.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 mt-4">
                            <span>Last updated: {lastUpdated}</span>
                            <span>•</span>
                            <span>Effective: {effectiveDate}</span>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="prose prose-lg max-w-none">

                            {/* Acceptance */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <ShieldCheck className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900 mt-0">Acceptance of Terms</h2>
                                        <p className="text-gray-600 mb-0">
                                            By accessing or using the services of Recharge Travels & Tours Pvt Ltd ("Company", "we", "us"),
                                            you agree to be bound by these Terms of Service. If you do not agree to these terms,
                                            please do not use our services.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Services */}
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Globe className="w-6 h-6 text-slate-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 m-0">Our Services</h2>
                                </div>
                                <p className="text-gray-600">
                                    We provide travel-related services including but not limited to:
                                </p>
                                <ul className="space-y-2 text-gray-600 mt-4">
                                    <li>Tour packages and customized itineraries</li>
                                    <li>Hotel and accommodation bookings</li>
                                    <li>Transportation services (private vehicles, group transport)</li>
                                    <li>Activity and experience bookings</li>
                                    <li>Travel consultation and planning</li>
                                </ul>
                            </div>

                            {/* Booking Terms */}
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Calendar className="w-6 h-6 text-emerald-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 m-0">Booking Terms</h2>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-800 mt-6">Reservations</h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li>All bookings are subject to availability</li>
                                    <li>A booking is confirmed only upon receipt of the required deposit</li>
                                    <li>Full payment is required before the service date unless otherwise agreed</li>
                                    <li>Prices are quoted in USD or LKR and are subject to change</li>
                                </ul>

                                <h3 className="text-lg font-semibold text-gray-800 mt-6">Deposits</h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li>Tours: 30% deposit required at booking</li>
                                    <li>Hotels: 50% deposit or as per hotel policy</li>
                                    <li>Transport: 25% deposit required</li>
                                    <li>Balance due 14 days before service date</li>
                                </ul>
                            </div>

                            {/* Cancellation */}
                            <div className="mb-10 bg-amber-50 border border-amber-100 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <RefreshCw className="w-6 h-6 text-amber-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 m-0">Cancellation & Refund Policy</h2>
                                </div>
                                <div className="space-y-4 text-gray-600">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-800">30+ days before</h4>
                                            <p className="text-sm">Full refund minus processing fee (5%)</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-800">15-29 days before</h4>
                                            <p className="text-sm">75% refund</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-800">7-14 days before</h4>
                                            <p className="text-sm">50% refund</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-800">Less than 7 days</h4>
                                            <p className="text-sm">No refund</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-amber-700">
                                        Note: Some services may have different cancellation policies.
                                        Please check your booking confirmation for specific terms.
                                    </p>
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <CreditCard className="w-6 h-6 text-slate-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 m-0">Payment Terms</h2>
                                </div>
                                <ul className="space-y-2 text-gray-600">
                                    <li>We accept major credit cards (Visa, MasterCard, Amex) and bank transfers</li>
                                    <li>All transactions are processed securely via Stripe</li>
                                    <li>Currency conversion rates are determined by your card issuer</li>
                                    <li>Additional fees may apply for certain payment methods</li>
                                </ul>
                            </div>

                            {/* Liability */}
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 m-0">Limitation of Liability</h2>
                                </div>
                                <p className="text-gray-600">
                                    To the maximum extent permitted by law:
                                </p>
                                <ul className="space-y-2 text-gray-600 mt-4">
                                    <li>We are not liable for any indirect, incidental, or consequential damages</li>
                                    <li>Our liability is limited to the amount paid for the service</li>
                                    <li>We are not responsible for third-party service provider issues</li>
                                    <li>Acts of God, natural disasters, or events beyond our control are excluded</li>
                                </ul>
                            </div>

                            {/* Prohibited */}
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Ban className="w-6 h-6 text-slate-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 m-0">Prohibited Activities</h2>
                                </div>
                                <p className="text-gray-600">You agree not to:</p>
                                <ul className="space-y-2 text-gray-600 mt-4">
                                    <li>Use our services for any illegal purpose</li>
                                    <li>Attempt to gain unauthorized access to our systems</li>
                                    <li>Interfere with or disrupt our services</li>
                                    <li>Copy, reproduce, or redistribute our content without permission</li>
                                    <li>Provide false or misleading information</li>
                                </ul>
                            </div>

                            {/* Intellectual Property */}
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <FileText className="w-6 h-6 text-slate-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 m-0">Intellectual Property</h2>
                                </div>
                                <p className="text-gray-600">
                                    All content on this website, including text, images, logos, and software, is the property of
                                    Recharge Travels & Tours Pvt Ltd and is protected by copyright and intellectual property laws.
                                    Unauthorized use, reproduction, or distribution is strictly prohibited.
                                </p>
                            </div>

                            {/* Governing Law */}
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Scale className="w-6 h-6 text-slate-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 m-0">Governing Law</h2>
                                </div>
                                <p className="text-gray-600">
                                    These terms are governed by the laws of the Democratic Socialist Republic of Sri Lanka.
                                    Any disputes shall be resolved in the courts of Colombo, Sri Lanka.
                                </p>
                            </div>

                            {/* Contact */}
                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                                <p className="text-gray-600 mb-4">
                                    For questions about these terms:
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-slate-600" />
                                        <a href="mailto:legal@rechargetravels.com" className="text-slate-700 hover:underline">
                                            legal@rechargetravels.com
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-slate-600" />
                                        <a href="tel:+94777721999" className="text-slate-700 hover:underline">
                                            +94 777 721 999
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default TermsOfService;
