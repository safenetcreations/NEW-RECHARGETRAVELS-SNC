import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Train, User, Loader2, CheckCircle2 } from 'lucide-react';
import { createBooking, sendConfirmationEmail } from '@/services/allBookingService';

const formSchema = z.object({
    route: z.string().min(1, 'Route is required'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time preference is required'),
    passengers: z.string().min(1, 'Passenger count is required'),
    class: z.enum(['1st-class', '2nd-class', 'observation']),
    returnDate: z.string().optional(),
    contactName: z.string().min(1, 'Name is required'),
    contactEmail: z.string().email('Valid email is required'),
    contactPhone: z.string().min(1, 'Phone is required'),
});

const TrainBookingForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ref, setRef] = useState('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            class: '1st-class',
            passengers: '2'
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await createBooking('train', {
                ...data,
                passengers: parseInt(data.passengers)
            });

            if (result.success && result.bookingId) {
                setRef(result.bookingReference || '');
                setSuccess(true);
                await sendConfirmationEmail(result.bookingId, 'train');
                toast.success('Train Ticket Request Sent!');
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
                <h3 className="text-2xl font-bold">Ticket Request Received!</h3>
                <p>Reference: <span className="font-mono font-bold text-blue-600">{ref}</span></p>
                <p className="text-gray-500">We will check availability and confirm your seats shortly.</p>
                <Button onClick={() => { setSuccess(false); form.reset(); }} variant="outline">Book Another</Button>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="route"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Route</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select Route" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="colombo-kandy">Colombo to Kandy (Hill Country)</SelectItem>
                                    <SelectItem value="kandy-ella">Kandy to Ella (Scenic)</SelectItem>
                                    <SelectItem value="colombo-galle">Colombo to Galle (Coastal)</SelectItem>
                                    <SelectItem value="colombo-jaffna">Colombo to Jaffna (North)</SelectItem>
                                    <SelectItem value="ella-colombo">Ella to Colombo</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Travel Date</FormLabel>
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
                                <FormLabel>Preferred Time</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Time" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="morning">Morning (05:00 - 11:00)</SelectItem>
                                        <SelectItem value="afternoon">Afternoon (12:00 - 17:00)</SelectItem>
                                        <SelectItem value="night">Night Mail (19:00+)</SelectItem>
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
                        name="passengers"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Passengers</FormLabel>
                                <FormControl><Input type="number" min="1" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="class"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Class</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="1st-class">1st Class (AC)</SelectItem>
                                        <SelectItem value="observation">Observation Saloon</SelectItem>
                                        <SelectItem value="2nd-class">2nd Class (Reserved)</SelectItem>
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

                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request Train Tickets'}
                </Button>
            </form>
        </Form>
    );
};

export default TrainBookingForm;
