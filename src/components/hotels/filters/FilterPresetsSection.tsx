
import React from 'react'
import { Save, Bookmark, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FilterPreset } from '@/hooks/useFilterPresets'

interface FilterPresetsSectionProps {
  presets: FilterPreset[]
  presetName: string
  setPresetName: (name: string) => void
  showPresetDialog: boolean
  setShowPresetDialog: (show: boolean) => void
  activeFiltersCount: number
  handleSavePreset: () => void
  handleLoadPreset: (presetId: string) => void
  handleDeletePreset: (presetId: string, presetName: string) => void
}

const FilterPresetsSection: React.FC<FilterPresetsSectionProps> = ({
  presets,
  presetName,
  setPresetName,
  showPresetDialog,
  setShowPresetDialog,
  activeFiltersCount,
  handleSavePreset,
  handleLoadPreset,
  handleDeletePreset
}) => (
  <div className="space-y-4">
    <div className="flex flex-col sm:flex-row gap-2">
      <Dialog open={showPresetDialog} onOpenChange={setShowPresetDialog}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 transition-all hover:scale-[1.02]"
            disabled={activeFiltersCount === 0}
          >
            <Save className="w-4 h-4" />
            Save Current
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Filter Preset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter preset name..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
            />
            <div className="flex gap-2">
              <Button onClick={handleSavePreset} className="flex-1">
                Save Preset
              </Button>
              <Button variant="outline" onClick={() => setShowPresetDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    {presets.length > 0 && (
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700">Saved Presets</h5>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {presets.map(preset => (
            <div key={preset.id} className="flex items-center justify-between p-2 bg-gray-50 rounded transition-all hover:bg-gray-100">
              <button
                onClick={() => handleLoadPreset(preset.id)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors flex-1 text-left"
              >
                <Bookmark className="w-3 h-3" />
                {preset.name}
              </button>
              <button
                onClick={() => handleDeletePreset(preset.id, preset.name)}
                className="text-red-500 hover:text-red-700 p-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)

export default FilterPresetsSection
