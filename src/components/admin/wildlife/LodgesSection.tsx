
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getLodges, type Lodge } from '@/services/wildlifeService';
import LodgeModal from './LodgeModal';

const LodgesSection: React.FC = () => {
  const [lodges, setLodges] = useState<Lodge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLodge, setSelectedLodge] = useState<Lodge | null>(null);

  useEffect(() => {
    loadLodges();
  }, []);

  const loadLodges = async () => {
    setLoading(true);
    try {
      const { data } = await getLodges();
      setLodges(data || []);
    } catch (error) {
      console.error('Error loading lodges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lodge: Lodge) => {
    setSelectedLodge(lodge);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedLodge(null);
    setShowModal(true);
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading lodges...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Manage Lodges & Hotels</CardTitle>
            <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Lodge
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Lodge Name</th>
                  <th className="text-left p-4 font-semibold">Location</th>
                  <th className="text-left p-4 font-semibold">Category</th>
                  <th className="text-left p-4 font-semibold">Price/Night</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lodges.map((lodge) => (
                  <tr key={lodge.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{lodge.name}</td>
                    <td className="p-4">{lodge.location}</td>
                    <td className="p-4">{lodge.lodge_categories?.name || 'N/A'}</td>
                    <td className="p-4">${lodge.price_per_night}</td>
                    <td className="p-4">
                      <Badge variant={lodge.is_active ? "default" : "secondary"}>
                        {lodge.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(lodge)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <LodgeModal
          lodge={selectedLodge}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={loadLodges}
        />
      )}
    </div>
  );
};

export default LodgesSection;
