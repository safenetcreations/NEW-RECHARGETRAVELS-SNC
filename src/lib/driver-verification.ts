
import { dbService, authService, storageService } from '@/lib/firebase-services'

export async function getDriversByVerificationStatus(status?: string) {
  try {
    const filters: Array<{ field: string; operator: string; value: any }> = [
      { field: 'is_active', operator: '==', value: true }
    ];

    if (status) {
      filters.push({ field: 'overall_verification_status', operator: '==', value: status });
    }

    const drivers = await dbService.list('drivers', filters, 'created_at', undefined);
    return drivers || [];
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw error;
  }
}

export async function updateDriverVerification(
  driverId: string,
  updates: Record<string, any>,
  adminId: string,
  adminComments?: string
) {
  try {
    // Update driver record
    await dbService.update('drivers', driverId, {
      ...updates,
      updated_at: new Date().toISOString()
    });

    // Create audit record for each verification update
    for (const [field, value] of Object.entries(updates)) {
      if (field.includes('verification_status')) {
        await dbService.create('admin_verifications', {
          admin_id: adminId,
          driver_id: driverId,
          verification_type: field,
          new_status: value,
          admin_comments: adminComments,
          created_at: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.error('Error updating driver verification:', error);
    throw error;
  }
}
