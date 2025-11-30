
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { luxuryExperienceService } from '@/services/luxuryExperienceService';
import type { LuxuryExperience } from '@/types/luxury-experience';

const HoneymoonAdmin: React.FC = () => {
  const [experience, setExperience] = useState<Partial<LuxuryExperience>>({});
  const [loading, setLoading] = useState(true);
  const HONEYMOON_TOUR_ID = 'honeymoon-in-paradise'; // Unique ID for the document

  useEffect(() => {
    loadExperience();
  }, []);

  const loadExperience = async () => {
    try {
      setLoading(true);
      const data = await luxuryExperienceService.getExperienceBySlugForAdmin(HONEYMOON_TOUR_ID);
      if (data) {
        setExperience(data);
      } else {
        // Initialize with default structure if it doesn't exist
        setExperience({
          slug: HONEYMOON_TOUR_ID,
          title: 'Honeymoon in Paradise: Sri Lanka',
          price: { amount: 2499, per: 'couple' },
          inclusions: [],
          exclusions: [],
          itinerary: [],
          gallery: [],
        });
      }
    } catch (error) {
      console.error('Error loading experience:', error);
      toast.error('Failed to load honeymoon tour data.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExperience(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExperience(prev => ({
        ...prev,
        price: { ...prev.price, [name]: value }
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExperience(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!experience.slug) {
        toast.error('Slug is missing.');
        return;
      }
      console.log('Saving experience:', experience);
      await luxuryExperienceService.saveExperience(experience.slug, experience);
      toast.success('Honeymoon tour data saved successfully!');
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error('Failed to save honeymoon tour data.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Manage Honeymoon Tour</title>
      </Helmet>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Luxury Honeymoon Tour</h1>
        
        <div className="space-y-4 max-w-4xl">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input name="title" value={experience.title || ''} onChange={handleInputChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <Input name="subtitle" value={experience.subtitle || ''} onChange={handleInputChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Short Description</label>
            <Textarea name="shortDescription" value={experience.shortDescription || ''} onChange={handleInputChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Description</label>
            <Textarea name="fullDescription" rows={5} value={experience.fullDescription || ''} onChange={handleInputChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <Input name="duration" value={experience.duration || ''} onChange={handleInputChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price Amount</label>
              <Input type="number" name="amount" value={experience.price?.amount || 0} onChange={handlePriceChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price Per</label>
              <Input name="per" value={experience.price?.per || ''} onChange={handlePriceChange} />
            </div>
          </div>

          {/* Gallery */}
          <div>
            <h2 className="text-xl font-bold mb-2">Gallery</h2>
            {experience.gallery?.map((image, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Image URL"
                  value={image.url}
                  onChange={(e) => {
                    const newGallery = [...(experience.gallery || [])];
                    newGallery[index].url = e.target.value;
                    setExperience({ ...experience, gallery: newGallery });
                  }}
                />
                <Input
                  placeholder="Alt Text"
                  value={image.alt}
                  onChange={(e) => {
                    const newGallery = [...(experience.gallery || [])];
                    newGallery[index].alt = e.target.value;
                    setExperience({ ...experience, gallery: newGallery });
                  }}
                />
                <Button variant="destructive" onClick={() => {
                  const newGallery = [...(experience.gallery || [])];
                  newGallery.splice(index, 1);
                  setExperience({ ...experience, gallery: newGallery });
                }}>Remove</Button>
              </div>
            ))}
            <Button onClick={() => {
              const newGallery = [...(experience.gallery || []), { url: '', alt: '' }];
              setExperience({ ...experience, gallery: newGallery });
            }}>Add Gallery Image</Button>
          </div>

          {/* Inclusions */}
          <div>
            <h2 className="text-xl font-bold mb-2">Inclusions</h2>
            {experience.inclusions?.map((inclusion, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Inclusion Title"
                  value={inclusion.title}
                  onChange={(e) => {
                    const newInclusions = [...(experience.inclusions || [])];
                    newInclusions[index].title = e.target.value;
                    setExperience({ ...experience, inclusions: newInclusions });
                  }}
                />
                <Input
                  placeholder="Inclusion Description"
                  value={inclusion.description}
                  onChange={(e) => {
                    const newInclusions = [...(experience.inclusions || [])];
                    newInclusions[index].description = e.target.value;
                    setExperience({ ...experience, inclusions: newInclusions });
                  }}
                />
                <Button variant="destructive" onClick={() => {
                  const newInclusions = [...(experience.inclusions || [])];
                  newInclusions.splice(index, 1);
                  setExperience({ ...experience, inclusions: newInclusions });
                }}>Remove</Button>
              </div>
            ))}
            <Button onClick={() => {
              const newInclusions = [...(experience.inclusions || []), { title: '', description: '' }];
              setExperience({ ...experience, inclusions: newInclusions });
            }}>Add Inclusion</Button>
          </div>

          {/* Exclusions */}
          <div>
            <h2 className="text-xl font-bold mb-2">Exclusions</h2>
            {experience.exclusions?.map((exclusion, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Exclusion"
                  value={exclusion}
                  onChange={(e) => {
                    const newExclusions = [...(experience.exclusions || [])];
                    newExclusions[index] = e.target.value;
                    setExperience({ ...experience, exclusions: newExclusions });
                  }}
                />
                <Button variant="destructive" onClick={() => {
                  const newExclusions = [...(experience.exclusions || [])];
                  newExclusions.splice(index, 1);
                  setExperience({ ...experience, exclusions: newExclusions });
                }}>Remove</Button>
              </div>
            ))}
            <Button onClick={() => {
              const newExclusions = [...(experience.exclusions || []), ''];
              setExperience({ ...experience, exclusions: newExclusions });
            }}>Add Exclusion</Button>
          </div>

          {/* Itinerary */}
          <div>
            <h2 className="text-xl font-bold mb-2">Itinerary</h2>
            {experience.itinerary?.map((day, index) => (
              <div key={index} className="border p-4 rounded-md mb-4">
                <h3 className="font-semibold">Day {day.day}</h3>
                <Input
                  placeholder="Day Title"
                  value={day.title}
                  onChange={(e) => {
                    const newItinerary = [...(experience.itinerary || [])];
                    newItinerary[index].title = e.target.value;
                    setExperience({ ...experience, itinerary: newItinerary });
                  }}
                />
                <Textarea
                  placeholder="Day Description"
                  value={day.description}
                  onChange={(e) => {
                    const newItinerary = [...(experience.itinerary || [])];
                    newItinerary[index].description = e.target.value;
                    setExperience({ ...experience, itinerary: newItinerary });
                  }}
                />
                <Button variant="destructive" size="sm" onClick={() => {
                  const newItinerary = [...(experience.itinerary || [])];
                  newItinerary.splice(index, 1);
                  setExperience({ ...experience, itinerary: newItinerary });
                }}>Remove Day</Button>
              </div>
            ))}
            <Button onClick={() => {
              const newItinerary = [...(experience.itinerary || []), { day: (experience.itinerary?.length || 0) + 1, title: '', description: '', activities: [], meals: [] }];
              setExperience({ ...experience, itinerary: newItinerary });
            }}>Add Day</Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select name="status" value={experience.status || 'draft'} onChange={handleSelectChange} className="w-full p-2 border rounded-md">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </>
  );
};

export default HoneymoonAdmin;
