import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Mail, Plus, Pencil, Trash2, Save, X, RefreshCw, Eye, Copy, MessageCircle, Phone, Send, FileText, Download } from 'lucide-react';

interface EmailTemplate {
    id?: string;
    name: string;
    subject: string;
    body: string;
    type: 'booking_confirmed' | 'alternative_offered' | 'payment_received' | 'reminder' | 'thank_you' | 'cancelled';
    isActive: boolean;
}

const defaultTemplates: Omit<EmailTemplate, 'id'>[] = [
    {
        name: 'Booking Confirmed',
        type: 'booking_confirmed',
        subject: 'Your Vehicle Booking is Confirmed! - Recharge Travels',
        body: 'Dear {{customerName}},\n\nGreat news! Your vehicle booking has been confirmed.\n\n📅 Booking Details:\n• Vehicle: {{categoryName}} - {{variantName}}\n• Pickup: {{pickupDate}} at {{pickupLocation}}\n• Return: {{returnDate}}\n• Duration: {{totalDays}} days\n• Driver: {{driverOption}}\n\n💰 Total: ${{estimatedPrice}}\n\nNext Steps:\n1. Complete your payment within 24 hours\n2. Payment Link: {{paymentLink}}\n3. You\'ll receive your booking voucher after payment\n\nNeed help? Contact us:\n📱 WhatsApp: +94 77 123 4567\n📧 Email: bookings@rechargetravels.com\n\nSafe travels!\nRecharge Travels Team',
        isActive: true
    },
    {
        name: 'Alternative Offered',
        type: 'alternative_offered',
        subject: 'Alternative Vehicle Options Available - Recharge Travels',
        body: 'Dear {{customerName}},\n\nThank you for your booking request. Unfortunately, your first choice is not available for the requested dates.\n\n🔄 We have alternatives for you:\n{{alternativeOffer}}\n\n📅 Your Original Request:\n• Vehicle: {{categoryName}} - {{variantName}}\n• Dates: {{pickupDate}} to {{returnDate}}\n\nPlease reply to this email or contact us to confirm your preference.\n\nBest regards,\nRecharge Travels Team',
        isActive: true
    },
    {
        name: 'Payment Received',
        type: 'payment_received',
        subject: '✅ Payment Confirmed - Your Booking Voucher',
        body: 'Dear {{customerName}},\n\nYour payment has been received! Your booking is now complete.\n\n🎫 BOOKING VOUCHER\nConfirmation #: {{bookingId}}\n\n📅 Trip Details:\n• Vehicle: {{categoryName}} - {{variantName}}\n• Pickup: {{pickupDate}} at {{pickupLocation}}\n• Return: {{returnDate}}\n• Driver: {{driverName}} ({{driverPhone}})\n\n💳 Payment: ${{estimatedPrice}} - PAID\n\n📋 Important:\n• Bring your passport and this voucher\n• Driver will contact you 24hrs before pickup\n• For self-drive: Bring your temporary driving license\n\nEmergency Contact: +94 77 123 4567\n\nHave a wonderful trip!\nRecharge Travels Team',
        isActive: true
    }
];

const VehicleEmailTemplates: React.FC = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [editing, setEditing] = useState<EmailTemplate | null>(null);
    const [preview, setPreview] = useState<EmailTemplate | null>(null);
    const [showWhatsApp, setShowWhatsApp] = useState(false);
    const [whatsAppNumber, setWhatsAppNumber] = useState('');
    const [whatsAppMessage, setWhatsAppMessage] = useState('');

    useEffect(() => { loadTemplates(); }, []);

    const loadTemplates = async () => {
        setLoading(true);
        try {
            const snap = await getDocs(collection(db, 'vehicleEmailTemplates'));
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as EmailTemplate[];
            setTemplates(data.length > 0 ? data : []);
        } catch (e) {
            toast({ title: 'Error', variant: 'destructive' });
        }
        setLoading(false);
    };

    const saveTemplate = async (template: EmailTemplate) => {
        try {
            const { id, ...data } = template;
            if (id) {
                await updateDoc(doc(db, 'vehicleEmailTemplates', id), data);
            } else {
                await addDoc(collection(db, 'vehicleEmailTemplates'), data);
            }
            toast({ title: 'Template saved' });
            await loadTemplates();
            setEditing(null);
        } catch (e) {
            toast({ title: 'Error saving', variant: 'destructive' });
        }
    };

    const deleteTemplate = async (id: string) => {
        if (!confirm('Delete this template?')) return;
        try {
            await deleteDoc(doc(db, 'vehicleEmailTemplates', id));
            toast({ title: 'Deleted' });
            await loadTemplates();
        } catch (e) {
            toast({ title: 'Error', variant: 'destructive' });
        }
    };

    const initializeDefaults = async () => {
        try {
            for (const t of defaultTemplates) {
                await addDoc(collection(db, 'vehicleEmailTemplates'), t);
            }
            toast({ title: 'Default templates created!' });
            await loadTemplates();
        } catch (e) {
            toast({ title: 'Error', variant: 'destructive' });
        }
    };

    const sendWhatsApp = () => {
        const encoded = encodeURIComponent(whatsAppMessage);
        const phone = whatsAppNumber.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
        setShowWhatsApp(false);
    };

    const generateContract = (booking: any) => {
        const contract = `
VEHICLE RENTAL AGREEMENT
========================
Contract #: ${booking?.bookingId || 'VR-2024-XXXX'}
Date: ${new Date().toLocaleDateString()}

PARTIES:
Lessor: Recharge Travels (Pvt) Ltd
Lessee: ${booking?.customerName || '{{customerName}}'}
Passport: ${booking?.passportNumber || '{{passportNumber}}'}

VEHICLE DETAILS:
Category: ${booking?.categoryName || '{{categoryName}}'}
Type: ${booking?.variantName || '{{variantName}}'}
Driver: ${booking?.withDriver ? 'Included' : 'Self-Drive'}

RENTAL PERIOD:
Start: ${booking?.pickupDate || '{{pickupDate}}'} 
End: ${booking?.returnDate || '{{returnDate}}'}
Location: ${booking?.pickupLocation || '{{pickupLocation}}'}

PAYMENT:
Total Amount: $${booking?.estimatedPrice || '{{estimatedPrice}}'}
Status: Paid

TERMS & CONDITIONS:
1. The lessee agrees to use the vehicle responsibly
2. Fuel policy: Full-to-Full
3. Insurance coverage included
4. 24/7 roadside assistance provided
5. Valid passport and license required

SIGNATURES:
Lessor: ___________________ Date: ___________
Lessee: ___________________ Date: ___________

Recharge Travels | +94 77 123 4567 | www.rechargetravels.com
    `;

        const blob = new Blob([contract], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rental-contract-${Date.now()}.txt`;
        a.click();
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-amber-600" /></div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Mail className="w-8 h-8 text-amber-500" />
                        Email Templates & Communications
                    </h1>
                    <p className="text-gray-500">Manage email templates, WhatsApp, and contracts</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowWhatsApp(true)}>
                        <MessageCircle className="w-4 h-4 mr-2" />WhatsApp
                    </Button>
                    <Button variant="outline" onClick={() => generateContract({})}>
                        <FileText className="w-4 h-4 mr-2" />Generate Contract
                    </Button>
                    <Button onClick={() => setEditing({ name: '', subject: '', body: '', type: 'booking_confirmed', isActive: true })}>
                        <Plus className="w-4 h-4 mr-2" />New Template
                    </Button>
                </div>
            </div>

            {templates.length === 0 && (
                <div className="bg-amber-50 rounded-xl p-6 text-center border border-amber-200">
                    <Mail className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-2">No Email Templates</h3>
                    <p className="text-gray-600 mb-4">Create templates for booking confirmations, reminders, and more.</p>
                    <Button onClick={initializeDefaults}>
                        <Plus className="w-4 h-4 mr-2" />Initialize Default Templates
                    </Button>
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map(t => (
                    <div key={t.id} className="bg-white rounded-xl p-4 border shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-semibold">{t.name}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded ${t.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                    {t.type.replace('_', ' ')}
                                </span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-xs ${t.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                {t.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 truncate">{t.subject}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{t.body.substring(0, 100)}...</p>
                        <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" onClick={() => setPreview(t)}><Eye className="w-4 h-4" /></Button>
                            <Button variant="outline" size="sm" onClick={() => setEditing(t)}><Pencil className="w-4 h-4" /></Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteTemplate(t.id!)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-xl font-semibold mb-4">{editing.id ? 'Edit' : 'New'} Email Template</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Template Name</Label><Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
                                <div><Label>Type</Label>
                                    <select className="w-full border rounded-lg p-2" value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value as any })}>
                                        <option value="booking_confirmed">Booking Confirmed</option>
                                        <option value="alternative_offered">Alternative Offered</option>
                                        <option value="payment_received">Payment Received</option>
                                        <option value="reminder">Reminder</option>
                                        <option value="thank_you">Thank You</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <div><Label>Subject</Label><Input value={editing.subject} onChange={e => setEditing({ ...editing, subject: e.target.value })} /></div>
                            <div><Label>Body (Use {`{{variableName}}`} for dynamic content)</Label>
                                <Textarea rows={12} value={editing.body} onChange={e => setEditing({ ...editing, body: e.target.value })} />
                            </div>
                            <p className="text-xs text-gray-500">Variables: {`{{customerName}}, {{categoryName}}, {{variantName}}, {{pickupDate}}, {{returnDate}}, {{pickupLocation}}, {{totalDays}}, {{estimatedPrice}}, {{bookingId}}, {{paymentLink}}, {{alternativeOffer}}, {{driverName}}, {{driverPhone}}`}</p>
                            <div className="flex items-center gap-2"><Switch checked={editing.isActive} onCheckedChange={c => setEditing({ ...editing, isActive: c })} /><Label>Active</Label></div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                            <Button onClick={() => saveTemplate(editing)}><Save className="w-4 h-4 mr-2" />Save</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {preview && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-semibold">Preview: {preview.name}</h2>
                            <Button variant="ghost" size="sm" onClick={() => setPreview(null)}><X className="w-5 h-5" /></Button>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-500">Subject:</p>
                            <p className="font-medium">{preview.subject}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm">{preview.body}</div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => { navigator.clipboard.writeText(preview.body); toast({ title: 'Copied!' }); }}>
                                <Copy className="w-4 h-4 mr-2" />Copy
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* WhatsApp Modal */}
            {showWhatsApp && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <MessageCircle className="w-6 h-6 text-green-500" />
                            Send WhatsApp Message
                        </h2>
                        <div className="space-y-4">
                            <div><Label>Phone Number (with country code)</Label>
                                <Input value={whatsAppNumber} onChange={e => setWhatsAppNumber(e.target.value)} placeholder="+94771234567" />
                            </div>
                            <div><Label>Message</Label>
                                <Textarea rows={6} value={whatsAppMessage} onChange={e => setWhatsAppMessage(e.target.value)} placeholder="Type your message..." />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="outline" onClick={() => setShowWhatsApp(false)}>Cancel</Button>
                            <Button className="bg-green-500 hover:bg-green-600" onClick={sendWhatsApp}>
                                <Send className="w-4 h-4 mr-2" />Send via WhatsApp
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleEmailTemplates;
