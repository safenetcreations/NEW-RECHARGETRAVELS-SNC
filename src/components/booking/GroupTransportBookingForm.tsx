import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Bus, Users, User, Loader2, CheckCircle2 } from 'lucide-react';
import { createBooking, sendConfirmationEmail } from '@/services/allBookingService';

const formSchema = z.object({
    pickupLocation: z.string().min(1, 'Pickup is required'),
    dropoffLocation: z.string().min(1, 'Dropoff is required'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    passengers: z.string().min(1, 'Passenger count is required'),
    vehicleType: z.enum(['minibus', 'large-bus', 'coach']),
    occasion: z.string().optional(),
    contactName: z.string().min(1, 'Name is required'),
    contactEmail: z.string().email('Valid email is required'),
    contactPhone: z.string().min(1, 'Phone is required'),
});

const GroupTransportBookingForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ref, setRef] = useState('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            vehicleType: 'minibus',
            passengers: '10'
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await createBooking('group-transport', {
                ...data,
                passengers: parseInt(data.passengers)
            });

            if (result.success && result.bookingId) {
                setRef(result.bookingReference || '');
                setSuccess(true);
                await sendConfirmationEmail(result.bookingId, 'group-transport');
                toast.success('Group Transport Requested!');
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
                <h3 className="text-2xl font-bold">Group Booking Received!</h3>
                <p>Reference: <span className="font-mono font-bold text-blue-600">{ref}</span></p>
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
                        name="pickupLocation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pickup Location</FormLabel>
                                <FormControl><Input placeholder="e.g. Colombo" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dropoffLocation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Destination</FormLabel>
                                <FormControl><Input placeholder="e.g. Galle" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Time</FormLabel>
                                <FormControl><Input type="time" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="passengers"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Passengers</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="vehicleType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vehicle Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="minibus">Minibus (9-15 seats)</SelectItem>
                                        <SelectItem value="large-bus">Large Bus (16-30 seats)</SelectItem>
                                        <SelectItem value="coach">Luxury Coach (30+ seats)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

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
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl><Input placeholder="+94..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-900" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request Group Quote'}
                </Button>
            </form>
        </Form>
    );
};

export default GroupTransportBookingForm;
