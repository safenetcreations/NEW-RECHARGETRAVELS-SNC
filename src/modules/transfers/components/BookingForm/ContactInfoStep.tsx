
import React from 'react';
import { FieldErrors } from 'react-hook-form';
import { BookingFormData } from '../../types';

interface ContactInfoStepProps {
  register: any;
  errors: FieldErrors<BookingFormData>;
}

export const ContactInfoStep: React.FC<ContactInfoStepProps> = ({
  register,
  errors
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Name *
        </label>
        <input
          type="text"
          {...register('contactName', { required: 'Name is required' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {errors.contactName && (
          <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          {...register('contactEmail', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {errors.contactEmail && (
          <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            {...register('contactPhone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                message: 'Invalid phone number'
              }
            })}
            placeholder="+94 77 772 1999"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.contactPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp Number (Optional)
          </label>
          <input
            type="tel"
            {...register('contactWhatsapp')}
            placeholder="+94 77 772 1999"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <p className="text-sm text-blue-700">
          We'll send booking confirmation and driver details to your email and phone.
        </p>
      </div>
    </div>
  );
};
