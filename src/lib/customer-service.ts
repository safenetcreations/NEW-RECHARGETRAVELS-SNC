
import { dbService, authService, storageService } from '@/lib/firebase-services'
import type { Customer } from '@/types/driver-booking'

export async function getOrCreateCustomer(userId: string, email: string): Promise<Customer> {
  try {
    // First check if customer exists
    const customers = await dbService.list('customers', [
      { field: 'user_id', operator: '==', value: userId }
    ]);

    if (customers && customers.length > 0) {
      return customers[0] as Customer;
    }

    // Create customer if doesn't exist
    const newCustomer = await dbService.create('customers', {
      user_id: userId,
      email: email,
      first_name: '',
      last_name: '',
      phone_number: '',
      preferred_language: 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    return newCustomer as Customer;
  } catch (error) {
    console.error('Error in getOrCreateCustomer:', error);
    throw error;
  }
}
