
import { dbService, authService, storageService } from '@/lib/firebase-services';

export async function getWildlifeReviews(itemType: string, itemId?: string) {
  try {
    let query = supabase
      .from('wildlife_reviews')
      .select(`
        *,
        profiles(full_name, avatar_url)
      `)
      .eq('item_type', itemType);

    if (itemId) {
      query = query.eq('item_id', itemId);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false }) as any;

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createWildlifeReview(reviewData: {
  booking_id: string;
  item_type: string;
  item_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  photos?: string[];
}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User must be logged in') };
    }

    const { data, error } = await supabase
      .from('wildlife_reviews')
      .insert({
        user_id: user.id,
        ...reviewData,
        photos: reviewData.photos || []
      })
      .select()
      .single() as any;

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}
