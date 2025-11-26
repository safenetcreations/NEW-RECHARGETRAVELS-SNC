
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { GripVertical, Plus, Minus, Clock, MapPin } from 'lucide-react'

interface Site {
  id: string
  name: string
  description: string
  duration: string
  highlights: string[]
  image: string
}

interface CircuitBuilderProps {
  sites: Site[]
  selectedSites: string[]
  onSitesChange: (sites: string[]) => void
}

const CircuitBuilder: React.FC<CircuitBuilderProps> = ({
  sites,
  selectedSites,
  onSitesChange
}) => {
  const [availableSites, setAvailableSites] = useState(
    sites.filter(site => !selectedSites.includes(site.id))
  )

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(selectedSites)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onSitesChange(items)
  }

  const addSite = (siteId: string) => {
    onSitesChange([...selectedSites, siteId])
    setAvailableSites(prev => prev.filter(site => site.id !== siteId))
  }

  const removeSite = (siteId: string) => {
    onSitesChange(selectedSites.filter(id => id !== siteId))
    const site = sites.find(s => s.id === siteId)
    if (site) {
      setAvailableSites(prev => [...prev, site])
    }
  }

  const selectedSiteData = selectedSites.map(id => sites.find(site => site.id === id)!).filter(Boolean)

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Available Sites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Available Cultural Sites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableSites.map((site) => (
              <div key={site.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <img 
                  src={site.image} 
                  alt={site.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{site.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{site.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{site.duration}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => addSite(site.id)}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Circuit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Your Cultural Circuit ({selectedSites.length} sites)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="selected-sites">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {selectedSiteData.map((site, index) => (
                    <Draggable key={site.id} draggableId={site.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center gap-4 p-4 border rounded-lg bg-amber-50 border-amber-200"
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <GripVertical className="w-5 h-5" />
                          </div>
                          
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                            Day {index + 1}
                          </Badge>
                          
                          <img 
                            src={site.image} 
                            alt={site.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm">{site.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{site.duration}</span>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeSite(site.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          {selectedSites.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Drag sites here to build your custom cultural circuit</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CircuitBuilder
