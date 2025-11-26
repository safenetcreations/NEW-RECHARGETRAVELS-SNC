import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Map, Calendar, Users, User, Mail, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { createBooking, sendConfirmationEmail } from '@/services/allBookingService';

const formSchema = z.object({
    destinations: z.string().min(1, 'Destination is required'),
    duration: z.string().min(1, 'Duration is required'),
    startDate: z.string().min(1, 'Start date is required'),
    travelers: z.string().min(1, 'Number of travelers is required'),
    budget: z.string().optional(),
    interests: z.string().optional(),
    contactName: z.string().min(1, 'Name is required'),
    contactEmail: z.string().email('Valid email is required'),
    contactPhone: z.string().min(1, 'Phone is required'),
    specialRequests: z.string().optional(),
});

const PrivateTourBookingForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ref, setRef] = useState('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            travelers: '2',
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await createBooking('private-tour', {
                ...data,
                travelers: parseInt(data.travelers)
            });

            if (result.success && result.bookingId) {
                setRef(result.bookingReference || '');
                setSuccess(true);
                await sendConfirmationEmail(result.bookingId, 'private-tour');
                toast.success('Tour Request Sent!');
            }
        } catch (error) {
            toast.error('Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-8 space-y-4">
                <div className="flex justify-center"><CheckCircle2 className="w-16 h-16 text-green-600" /></div>
                <h3 className="text-2xl font-bold">Request Received!</h3>
                <p>Reference: <span className="font-mono font-bold text-blue-600">{ref}</span></p>
                <p className="text-gray-500">We'll craft your perfect itinerary and contact you shortly.</p>
                <Button onClick={() => { setSuccess(false); form.reset(); }} variant="outline">Book Another</Button>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="destinations"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Destinations / Regions</FormLabel>
                                <FormControl><Input placeholder="e.g. Sigiriya, Kandy, Ella" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration (Days)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {[3, 5, 7, 10, 14, 21].map(d => <SelectItem key={d} value={d.toString()}>{d} Days</SelectItem>)}
                                        <SelectItem value="custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Preferred Start Date</FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="travelers"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Travelers</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5, 6, 8, 10].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                                        <SelectItem value="10+">10+ Group</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Interests</FormLabel>
                            <FormControl><Input placeholder="e.g. Wildlife, Culture, Beach, Hiking" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4 border-t pt-4 mt-4">
                    <h4 className="font-medium flex items-center gap-2"><User className="w-4 h-4" /> Contact Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="contactName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input placeholder="email@example.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contactPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone/WhatsApp</FormLabel>
                                    <FormControl><Input placeholder="+94..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request Custom Tour'}
                </Button>
            </form>
        </Form>
    );
};

export default PrivateTourBookingForm;
