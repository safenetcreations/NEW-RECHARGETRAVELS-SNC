import { useState } from 'react'
import { Eye, Camera } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

interface SampleShotListProps {
  sampleShots: any[] | null
}

const SampleShotList = ({ sampleShots }: SampleShotListProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (!sampleShots || !Array.isArray(sampleShots) || sampleShots.length === 0) {
    return (
      <div className="text-center py-8">
        <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Sample shots will be updated soon.</p>
      </div>
    )
  }

  // For now, using placeholder images since the sample shots are just text descriptions
  const placeholderImages = [
    '/images/photography/sample-1.jpg',
    '/images/photography/sample-2.jpg', 
    '/images/photography/sample-3.jpg',
    '/images/photography/sample-4.jpg',
    '/images/photography/sample-5.jpg',
    '/images/photography/sample-6.jpg'
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Expected Photo Opportunities</h3>
        <p className="text-muted-foreground">
          These are the types of shots you can expect to capture during this photography tour
        </p>
      </div>

      {/* Sample Shot Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sampleShots.map((shot, index) => (
          <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
            <Camera className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Shot Opportunity {index + 1}</h4>
              <p className="text-sm text-muted-foreground">{shot}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Moodboard Gallery */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-foreground">Sample Photography Moodboard</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {placeholderImages.slice(0, Math.min(6, sampleShots.length)).map((image, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted">
                  <img
                    src={image}
                    alt={`Sample shot ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black/70 backdrop-blur-sm rounded px-2 py-1">
                      <p className="text-white text-xs truncate">{sampleShots[index]}</p>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <div className="space-y-4">
                  <img
                    src={image}
                    alt={`Sample shot ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg'
                    }}
                  />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">Expected Shot</h3>
                    <p className="text-muted-foreground">{sampleShots[index]}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>

      {/* Photography Tips */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
        <div className="flex items-start">
          <Camera className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Photography Tips</h4>
            <p className="text-blue-800 text-sm">
              Our expert guides will help you achieve these shots by providing technical guidance, 
              composition advice, and local knowledge about the best lighting conditions and timing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SampleShotList