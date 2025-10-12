import { dbService, storageService } from '@/lib/firebase-services';
import type { LuxuryExperience, CustomExperienceRequest, ExperienceCategory } from '@/types/luxury-experience';

class LuxuryExperienceService {
  private collection = 'luxuryExperiences';
  private requestsCollection = 'customExperienceRequests';

  // Get all published experiences
  async getExperiences(category?: ExperienceCategory): Promise<LuxuryExperience[]> {
    const filters = [{ field: 'status', operator: '==', value: 'published' }];
    if (category) {
      filters.push({ field: 'category', operator: '==', value: category });
    }
    
    return await dbService.list(this.collection, filters, 'featured', 50) as LuxuryExperience[];
  }

  // Get featured experiences for homepage
  async getFeaturedExperiences(limit = 6): Promise<LuxuryExperience[]> {
    const filters = [
      { field: 'status', operator: '==', value: 'published' },
      { field: 'featured', operator: '==', value: true }
    ];
    
    return await dbService.list(this.collection, filters, 'updatedAt', limit) as LuxuryExperience[];
  }

  // Get single experience by slug
  async getExperienceBySlug(slug: string): Promise<LuxuryExperience | null> {
    const filters = [
      { field: 'slug', operator: '==', value: slug },
      { field: 'status', operator: '==', value: 'published' }
    ];
    
    const experiences = await dbService.list(this.collection, filters, undefined, 1) as LuxuryExperience[];
    return experiences[0] || null;
  }

  // Get experience by ID (for admin)
  async getExperienceById(id: string): Promise<LuxuryExperience | null> {
    return await dbService.get(this.collection, id) as LuxuryExperience;
  }

  // Create new experience (admin)
  async createExperience(data: Omit<LuxuryExperience, 'id' | 'createdAt' | 'updatedAt'>): Promise<LuxuryExperience> {
    const slug = this.generateSlug(data.title);
    const experience = {
      ...data,
      slug,
      status: data.status || 'draft',
      featured: data.featured || false,
      popular: data.popular || false,
      new: data.new || false
    };
    
    return await dbService.create(this.collection, experience) as LuxuryExperience;
  }

  // Update experience (admin)
  async updateExperience(id: string, data: Partial<LuxuryExperience>): Promise<LuxuryExperience> {
    if (data.title) {
      data.slug = this.generateSlug(data.title);
    }
    
    return await dbService.update(this.collection, id, data) as LuxuryExperience;
  }

  // Delete experience (admin)
  async deleteExperience(id: string): Promise<void> {
    // Get experience to delete associated images
    const experience = await this.getExperienceById(id);
    if (experience) {
      // Delete hero image
      if (experience.heroImage) {
        try {
          await storageService.delete(experience.heroImage);
        } catch (error) {
          console.error('Error deleting hero image:', error);
        }
      }
      
      // Delete gallery images
      if (experience.gallery) {
        for (const image of experience.gallery) {
          try {
            await storageService.delete(image.url);
          } catch (error) {
            console.error('Error deleting gallery image:', error);
          }
        }
      }
    }
    
    await dbService.delete(this.collection, id);
  }

  // Upload experience image
  async uploadImage(file: File, experienceId: string, type: 'hero' | 'gallery'): Promise<string> {
    const path = `experiences/${experienceId}/${type}/${Date.now()}-${file.name}`;
    const result = await storageService.upload(path, file);
    return result.url;
  }

  // Submit custom experience request
  async submitCustomRequest(data: Omit<CustomExperienceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<CustomExperienceRequest> {
    const request = {
      ...data,
      status: 'new' as const
    };
    
    return await dbService.create(this.requestsCollection, request) as CustomExperienceRequest;
  }

  // Get custom requests (admin)
  async getCustomRequests(status?: string): Promise<CustomExperienceRequest[]> {
    const filters = status ? [{ field: 'status', operator: '==', value: status }] : undefined;
    return await dbService.list(this.requestsCollection, filters, 'createdAt', 100) as CustomExperienceRequest[];
  }

  // Update custom request status (admin)
  async updateRequestStatus(id: string, status: CustomExperienceRequest['status'], notes?: string, assignedTo?: string): Promise<void> {
    const updates: any = { status };
    if (notes) updates.notes = notes;
    if (assignedTo) updates.assignedTo = assignedTo;
    if (status === 'contacted') updates.respondedAt = new Date();
    
    await dbService.update(this.requestsCollection, id, updates);
  }

  // Get experience categories
  getCategories(): Array<{ value: ExperienceCategory; label: string; description: string }> {
    return [
      {
        value: 'luxury-safari',
        label: 'Luxury Safari',
        description: 'Private game drives with expert naturalists'
      },
      {
        value: 'photography-tours',
        label: 'Photography Tours',
        description: 'Capture Sri Lanka\'s beauty with professionals'
      },
      {
        value: 'cultural-immersion',
        label: 'Cultural Immersion',
        description: 'Authentic temple ceremonies and village life'
      },
      {
        value: 'wellness-retreats',
        label: 'Wellness Retreats',
        description: 'Ayurvedic spa and yoga in serene settings'
      },
      {
        value: 'adventure-expeditions',
        label: 'Adventure Expeditions',
        description: 'Helicopter tours and exclusive hiking'
      },
      {
        value: 'marine-adventures',
        label: 'Marine Adventures',
        description: 'Private yacht charters and diving'
      },
      {
        value: 'culinary-journeys',
        label: 'Culinary Journeys',
        description: 'Chef-led tours and cooking masterclasses'
      },
      {
        value: 'romantic-escapes',
        label: 'Romantic Escapes',
        description: 'Intimate experiences for couples'
      },
      {
        value: 'family-adventures',
        label: 'Family Adventures',
        description: 'Kid-friendly luxury experiences'
      },
      {
        value: 'exclusive-access',
        label: 'Exclusive Access',
        description: 'Behind-the-scenes and VIP experiences'
      }
    ];
  }

  // Helper to generate URL-friendly slug
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Search experiences
  async searchExperiences(query: string): Promise<LuxuryExperience[]> {
    // In a real implementation, you'd use a search service
    // For now, we'll get all and filter client-side
    const all = await this.getExperiences();
    const lowercaseQuery = query.toLowerCase();
    
    return all.filter(exp => 
      exp.title.toLowerCase().includes(lowercaseQuery) ||
      exp.shortDescription.toLowerCase().includes(lowercaseQuery) ||
      exp.category.includes(lowercaseQuery)
    );
  }

  // Get popular experiences
  async getPopularExperiences(limit = 4): Promise<LuxuryExperience[]> {
    const filters = [
      { field: 'status', operator: '==', value: 'published' },
      { field: 'popular', operator: '==', value: true }
    ];
    
    return await dbService.list(this.collection, filters, 'updatedAt', limit) as LuxuryExperience[];
  }

  // Get new experiences
  async getNewExperiences(limit = 4): Promise<LuxuryExperience[]> {
    const filters = [
      { field: 'status', operator: '==', value: 'published' },
      { field: 'new', operator: '==', value: true }
    ];
    
    return await dbService.list(this.collection, filters, 'publishedAt', limit) as LuxuryExperience[];
  }
}

export const luxuryExperienceService = new LuxuryExperienceService();
