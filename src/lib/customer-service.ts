
import { dbService, authService, storageService } from '@/lib/firebase-services'
import type { Customer } from '@/types/driver-booking'

export async function getOrCreateCustomer(userId: string, email: string): Promise<Customer> {
  // First check if customer exists
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (existingCustomer) {
    return existingCustomer
  }

  // Create customer if doesn't exist
  const { data: newCustomer, error } = await supabase
    .from('customers')
    .insert({
      user_id: userId,
      first_name: '',
      last_name: '',
      phone_number: '',
      preferred_language: 'en'
    })
    .select('*')
    .single()

  if (error) throw error
  return newCustomer
}
