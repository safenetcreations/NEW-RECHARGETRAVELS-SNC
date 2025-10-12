
import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, RotateCcw, Check, X } from 'lucide-react'
import { toast } from 'sonner'

interface LiveSelfieCaptureProps {
  onCapture: (imageBlob: Blob) => void
  onSkip?: () => void
}

const LiveSelfieCapture = ({ onCapture, onSkip }: LiveSelfieCaptureProps) => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsStreaming(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast.error('Unable to access camera. Please check permissions and try again.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setIsStreaming(false)
    }
  }, [stream])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob)
            setCapturedImage(imageUrl)
            stopCamera()
          }
        }, 'image/jpeg', 0.8)
      }
    }
  }, [stopCamera])

  const confirmCapture = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          onCapture(blob)
          toast.success('Selfie captured successfully!')
        }
      }, 'image/jpeg', 0.8)
    }
  }, [onCapture])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage)
    }
    startCamera()
  }, [capturedImage, startCamera])

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="h-5 w-5 mr-2" />
          Live Selfie Capture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/3]">
          {!isStreaming && !capturedImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Take a clear selfie for verification</p>
                <Button onClick={startCamera}>
                  Start Camera
                </Button>
              </div>
            </div>
          )}
          
          {isStreaming && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
          
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured selfie"
              className="w-full h-full object-cover"
            />
          )}
          
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <p>• Ensure good lighting</p>
          <p>• Look directly at the camera</p>
          <p>• Remove sunglasses or hats</p>
          <p>• Make sure your face is clearly visible</p>
        </div>

        <div className="flex gap-2">
          {isStreaming && (
            <>
              <Button onClick={capturePhoto} className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Capture
              </Button>
              <Button variant="outline" onClick={stopCamera}>
                Cancel
              </Button>
            </>
          )}
          
          {capturedImage && (
            <>
              <Button onClick={confirmCapture} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Confirm
              </Button>
              <Button variant="outline" onClick={retakePhoto}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake
              </Button>
            </>
          )}
        </div>

        {onSkip && (
          <Button variant="ghost" onClick={onSkip} className="w-full">
            Skip for now (upload file instead)
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default LiveSelfieCapture
