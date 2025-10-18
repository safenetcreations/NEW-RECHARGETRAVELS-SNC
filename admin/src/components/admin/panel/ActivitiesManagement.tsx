import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import ActivityFormDialog from './ActivityFormDialog';
import { firebaseActivityService, Activity } from '../../../services/firebaseActivityService';

interface ActivitiesManagementProps {
  className?: string;
}

const ActivitiesManagement: React.FC<ActivitiesManagementProps> = ({ className }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(
        activity =>
          activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
  }, [activities, searchTerm]);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const data = await firebaseActivityService.getAllActivities();
      setActivities(data);
      setFilteredActivities(data);
      toast.success(`Loaded ${data.length} activities successfully`);
    } catch (error) {
      console.error('Error loading activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedActivity(null);
    setIsFormOpen(true);
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsFormOpen(true);
  };

  const handleDelete = async (activityId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await firebaseActivityService.deleteActivity(activityId);
      toast.success('Activity deleted successfully');
      loadActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
    }
  };

  const handleFormSubmit = async (activityData: Partial<Activity>) => {
    try {
      if (selectedActivity) {
        await firebaseActivityService.updateActivity(selectedActivity.id, activityData);
        toast.success('Activity updated successfully');
      } else {
        await firebaseActivityService.createActivity(activityData as Omit<Activity, 'id' | 'createdAt'>);
        toast.success('Activity created successfully');
      }
      setIsFormOpen(false);
      loadActivities();
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Failed to save activity');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="mb-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Activities Management
              </CardTitle>
              <p className="text-gray-600">
                Manage all activities
              </p>
            </div>
            <Button
              onClick={handleCreate}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Activity
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="mb-6 shadow-md">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search activities by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <Card
            key={activity.id}
            className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group"
          >
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {activity.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(activity)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(activity.id, activity.name)}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <Card className="shadow-md">
          <CardContent className="py-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activities Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your filters'
                : 'Get started by creating your first activity'}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Activity
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <ActivityFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        activity={selectedActivity}
      />
    </div>
  );
};

export default ActivitiesManagement;
