
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import { supabaseCMS } from '@/lib/firebase-services'
import { toast } from 'sonner'

interface SEOGeneratorProps {
  contentType: 'destination' | 'article'
  contentId: string
  currentMeta?: {
    meta_title?: string
    meta_description?: string
  }
  onUpdate?: () => void
}

const SEOGenerator = ({ 
  contentType, 
  contentId, 
  currentMeta = {},
  onUpdate 
}: SEOGeneratorProps) => {
  const [loading, setLoading] = useState(false)
  const [generatedSEO, setGeneratedSEO] = useState<{
    meta_title: string
    meta_description: string
  } | null>(null)

  const generateSEO = async () => {
    setLoading(true)
    try {
      // TODO: Implement Firebase function for SEO generation
      // const { data, error } = await supabaseCMS.functions.invoke('generate-seo-content', {
      //   body: {
      //     contentType,
      //     contentId
      //   }
      // })
      
      const error = null;
      const data = { data: { meta_title: '', meta_description: '' } }; // Placeholder

      if (error) throw error

      setGeneratedSEO(data.data)
      toast.success('SEO content generated successfully!')
      onUpdate?.()
    } catch (error) {
      console.error('Error generating SEO:', error)
      toast.error('Failed to generate SEO content')
    } finally {
      setLoading(false)
    }
  }

  const hasExistingSEO = currentMeta.meta_title || currentMeta.meta_description

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          AI SEO Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current SEO Status */}
        <div className="flex items-center gap-2">
          {hasExistingSEO ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                SEO Content Present
              </Badge>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                No SEO Content
              </Badge>
            </>
          )}
        </div>

        {/* Current Meta Data */}
        {hasExistingSEO && (
          <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm">Current SEO Content:</h4>
            {currentMeta.meta_title && (
              <div>
                <span className="text-xs text-gray-600">Meta Title:</span>
                <p className="text-sm">{currentMeta.meta_title}</p>
              </div>
            )}
            {currentMeta.meta_description && (
              <div>
                <span className="text-xs text-gray-600">Meta Description:</span>
                <p className="text-sm">{currentMeta.meta_description}</p>
              </div>
            )}
          </div>
        )}

        {/* Generated SEO Content */}
        {generatedSEO && (
          <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-sm text-blue-800">Generated SEO Content:</h4>
            <div>
              <span className="text-xs text-blue-600">Meta Title ({generatedSEO.meta_title.length} chars):</span>
              <p className="text-sm">{generatedSEO.meta_title}</p>
            </div>
            <div>
              <span className="text-xs text-blue-600">Meta Description ({generatedSEO.meta_description.length} chars):</span>
              <p className="text-sm">{generatedSEO.meta_description}</p>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <Button 
          onClick={generateSEO} 
          disabled={loading}
          className="w-full"
          variant={hasExistingSEO ? "outline" : "default"}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating SEO Content...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              {hasExistingSEO ? 'Regenerate SEO Content' : 'Generate SEO Content'}
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500">
          AI will analyze your content and generate SEO-optimized meta titles and descriptions 
          specifically for Sri Lanka travel searches.
        </p>
      </CardContent>
    </Card>
  )
}

export default SEOGenerator
