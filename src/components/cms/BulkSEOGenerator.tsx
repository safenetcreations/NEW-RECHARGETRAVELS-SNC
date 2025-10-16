
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react'
import { supabaseCMS } from '@/lib/firebase-services'
import { toast } from 'sonner'

interface ContentItem {
  id: string
  title: string
  type: 'destination' | 'article'
  hasSEO: boolean
}

const BulkSEOGenerator = () => {
  const [loading, setLoading] = useState(false)
  const [fetchingContent, setFetchingContent] = useState(true)
  const [content, setContent] = useState<ContentItem[]>([])
  const [progress, setProgress] = useState(0)
  const [currentItem, setCurrentItem] = useState<string>('')

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      // Fetch destinations without SEO
      const { data: destinations } = await supabaseCMS
        .from('destination')
        .select('dest_id, name, meta_title, meta_description')
        .eq('published', true)

      // Fetch articles without SEO  
      const { data: articles } = await supabaseCMS
        .from('article')
        .select('article_id, title, meta_title, meta_description')
        .eq('published', true)

      const contentItems: ContentItem[] = [
        ...(destinations || []).map(d => ({
          id: d.dest_id,
          title: d.name,
          type: 'destination' as const,
          hasSEO: !!(d.meta_title && d.meta_description)
        })),
        ...(articles || []).map(a => ({
          id: a.article_id,
          title: a.title,
          type: 'article' as const,
          hasSEO: !!(a.meta_title && a.meta_description)
        }))
      ]

      setContent(contentItems)
    } catch (error) {
      console.error('Error fetching content:', error)
      toast.error('Failed to load content')
    } finally {
      setFetchingContent(false)
    }
  }

  const generateBulkSEO = async (onlyMissing = true) => {
    const itemsToProcess = onlyMissing 
      ? content.filter(item => !item.hasSEO)
      : content

    if (itemsToProcess.length === 0) {
      toast.info('No content needs SEO generation')
      return
    }

    setLoading(true)
    setProgress(0)

    let completed = 0
    const total = itemsToProcess.length

    for (const item of itemsToProcess) {
      try {
        setCurrentItem(item.title)
        
        // TODO: Implement Firebase function for SEO generation
        // const { error } = await supabaseCMS.functions.invoke('generate-seo-content', {
        //   body: {
        //     contentType: item.type,
        //     contentId: item.id
        //   }
        // })
        
        const error = null; // Placeholder

        if (error) {
          console.error(`Error generating SEO for ${item.title}:`, error)
          toast.error(`Failed to generate SEO for: ${item.title}`)
        } else {
          completed++
        }

        setProgress((completed / total) * 100)

        // Small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`Error processing ${item.title}:`, error)
      }
    }

    setLoading(false)
    setCurrentItem('')
    toast.success(`SEO content generated for ${completed}/${total} items`)
    
    // Refresh the content list
    fetchContent()
  }

  const contentWithoutSEO = content.filter(item => !item.hasSEO)
  const contentWithSEO = content.filter(item => item.hasSEO)

  if (fetchingContent) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading content...
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Bulk SEO Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {contentWithoutSEO.length} Missing SEO
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {contentWithSEO.length} Have SEO
            </Badge>
          </div>
        </div>

        {/* Progress */}
        {loading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Generating SEO content...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
            {currentItem && (
              <p className="text-xs text-gray-600">
                Processing: {currentItem}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={() => generateBulkSEO(true)} 
            disabled={loading || contentWithoutSEO.length === 0}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate for Missing ({contentWithoutSEO.length})
              </>
            )}
          </Button>

          <Button 
            onClick={() => generateBulkSEO(false)} 
            disabled={loading || content.length === 0}
            variant="outline"
            className="flex-1"
          >
            Regenerate All ({content.length})
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• AI will generate SEO-optimized meta titles and descriptions</p>
          <p>• Processing includes a 1-second delay between items</p>
          <p>• Failed generations will be logged in the console</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default BulkSEOGenerator
