
import { dbService, authService, storageService } from '@/lib/firebase-services'

export async function getDriversByVerificationStatus(status?: string) {
  let query = supabase
    .from('drivers')
    .select('*')
    .eq('is_active', true)

  if (status) {
    query = query.eq('overall_verification_status', status)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function updateDriverVerification(
  driverId: string,
  updates: Record<string, any>,
  adminId: string,
  adminComments?: string
) {
  // Update driver record
  const { error: driverError } = await supabase
    .from('drivers')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', driverId)

  if (driverError) throw driverError

  // Create audit record for each verification update
  for (const [field, value] of Object.entries(updates)) {
    if (field.includes('verification_status')) {
      await supabase
        .from('admin_verifications')
        .insert({
          admin_id: adminId,
          driver_id: driverId,
          verification_type: field,
          new_status: value,
          admin_comments: adminComments
        })
    }
  }
}
