import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, FileText, Cookie, Lock, Eye, Database, Globe, Mail, Phone, Calendar } from 'lucide-react';

const PrivacyPolicy = () => {
    const lastUpdated = 'December 5, 2025';

    return (
        <>
            <Helmet>
                <title>Privacy Policy | Recharge Travels & Tours</title>
                <meta name="description" content="Learn how Recharge Travels & Tours collects, uses, and protects your personal information. GDPR and CCPA compliant privacy practices." />
            </Helmet>
            <Header />
            <main className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-20">
                    <div className="container mx-auto px-4 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                        <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
                            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                        </p>
                        <p className="text-sm text-emerald-200 mt-4">Last updated: {lastUpdated}</p>
                    </div>
                </section>

                {/* Content */}
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="prose prose-lg max-w-none">

                            {/* Introduction */}
                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <FileText className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h2 className="text-xl font-semibold text-emerald-900 mt-0">Introduction</h2>
                                        <p className="text-gray-600 mb-0">
                                            Recharge Travels & Tours Pvt Ltd ("we", "us", "our") is committed to protecting your privacy.
                                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
                                            visit our website rechargetravels.com and use our services.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Information We Collect */}
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Database className="w-6 h-6 text-emerald-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 m-0">Information We Collect</h2>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-800 mt-6">Personal Information</h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li><strong>Identity Data:</strong> Name, username, title, date of birth, nationality</li>
                                    <li><strong>Contact Data:</strong> Email address, phone number, billing and shipping addresses</li>
                                    <li><strong>Financial Data:</strong> Payment card details (processed securely via Stripe)</li>
                                    <li><strong>Transaction Data:</strong> Details of products/services you have purchased from us</li>
                                    <li><strong>Technical Data:</strong> IP address, browser type, device information, time zone</li>
                                    <li><strong>Profile Data:</strong> Your preferences, feedback, and survey responses</li>
                                    <li><strong>Usage Data:</strong> How you use our website, products, and services</li>
                                </ul>

                                <h3 className="text-lg font-semibold text-gray-800 mt-6">Special Categories of Data</h3>
                                <p className="text-gray-600">
                                    For certain tours (e.g., temple visits, wellness retreats), we may collect information about dietary
                                    requirements or health conditions. This data is collected only with your explicit consent and is
                                    processed solely to provide the requested services.
                                </p>
                            </div>

                            {/* How We Use Your Information */}
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Eye className="w-6 h-6 text-emerald-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 m-0">How We Use Your Information</h2>
                                </div>
                                <ul className="space-y-2 text-gray-600">
                                    <li>To process and manage your bookings and reservations</li>
                                    <li>To send booking confirmations, updates, and travel documents</li>
                                    <li>To provide customer support and respond to inquiries</li>
                                    <li>To process payments securely</li>
                                    <li>To send promotional communications (with your consent)</li>
                                    <li>To improve our website and services</li>
                                    <li>To comply with legal obligations</li>
                                    <li>To detect and prevent fraud</li>
                                </ul>
                            </div>

                            {/* Legal Basis (GDPR) */}
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Globe className="w-6 h-6 text-emerald-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 m-0">Legal Basis for Processing (GDPR)</h2>
                                </div>
                                <ul className="space-y-2 text-gray-600">
                                    <li><strong>Contract:</strong> Processing necessary to fulfill our contract with you</li>
                                    <li><strong>Consent:</strong> Where you have given explicit consent</li>
                                    <li><strong>Legitimate Interests:</strong> Processing necessary for our legitimate business interests</li>
                                    <li><strong>Legal Obligation:</strong> Processing necessary to comply with the law</li>
                                </ul>
                            </div>

                            {/* Your Rights */}
                            <div className="mb-10 bg-blue-50 border border-blue-100 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Lock className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 m-0">Your Rights (GDPR & CCPA)</h2>
                                </div>
                                <p className="text-gray-600 mb-4">Under GDPR and CCPA, you have the following rights:</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-lg border border-blue-100">
                                        <h4 className="font-semibold text-gray-800">Right to Access</h4>
                                        <p className="text-sm text-gray-600">Request a copy of your personal data</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-blue-100">
                                        <h4 className="font-semibold text-gray-800">Right to Rectification</h4>
                                        <p className="text-sm text-gray-600">Request correction of inaccurate data</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-blue-100">
                                        <h4 className="font-semibold text-gray-800">Right to Erasure</h4>
                                        <p className="text-sm text-gray-600">Request deletion of your data</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-blue-100">
                                        <h4 className="font-semibold text-gray-800">Right to Restrict Processing</h4>
                                        <p className="text-sm text-gray-600">Request limitation of processing</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-blue-100">
                                        <h4 className="font-semibold text-gray-800">Right to Data Portability</h4>
                                        <p className="text-sm text-gray-600">Receive your data in a portable format</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-blue-100">
                                        <h4 className="font-semibold text-gray-800">Right to Object</h4>
                                        <p className="text-sm text-gray-600">Object to processing for marketing</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">
                                    To exercise any of these rights, contact us at privacy@rechargetravels.com
                                </p>
                            </div>

                            {/* Data Security */}
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Lock className="w-6 h-6 text-emerald-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 m-0">Data Security</h2>
                                </div>
                                <p className="text-gray-600">
                                    We implement appropriate technical and organizational measures to protect your personal data, including:
                                </p>
                                <ul className="space-y-2 text-gray-600 mt-4">
                                    <li>SSL/TLS encryption for all data transmission</li>
                                    <li>Secure payment processing via PCI-DSS compliant providers</li>
                                    <li>Regular security audits and penetration testing</li>
                                    <li>Access controls and authentication measures</li>
                                    <li>Employee training on data protection</li>
                                </ul>
                            </div>

                            {/* Data Retention */}
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Calendar className="w-6 h-6 text-emerald-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 m-0">Data Retention</h2>
                                </div>
                                <p className="text-gray-600">
                                    We retain your personal data only for as long as necessary:
                                </p>
                                <ul className="space-y-2 text-gray-600 mt-4">
                                    <li>Booking records: 7 years (legal/tax requirements)</li>
                                    <li>Marketing preferences: Until withdrawal of consent</li>
                                    <li>Website analytics: 26 months</li>
                                    <li>Customer support records: 3 years</li>
                                </ul>
                            </div>

                            {/* Contact */}
                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                                <p className="text-gray-600 mb-4">
                                    For any privacy-related inquiries or to exercise your rights:
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-emerald-600" />
                                        <a href="mailto:privacy@rechargetravels.com" className="text-emerald-600 hover:underline">
                                            privacy@rechargetravels.com
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-emerald-600" />
                                        <a href="tel:+94777721999" className="text-emerald-600 hover:underline">
                                            +94 777 721 999
                                        </a>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">
                                    Recharge Travels & Tours Pvt Ltd<br />
                                    Colombo, Jaffna, Sri Lanka
                                </p>
                            </div>

                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;
