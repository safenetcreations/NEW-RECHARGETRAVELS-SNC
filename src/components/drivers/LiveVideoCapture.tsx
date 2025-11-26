
import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Video, Square, Play, RotateCcw, Check } from 'lucide-react'
import { toast } from 'sonner'

interface LiveVideoCaptureProps {
  onCapture: (videoBlob: Blob) => void
  onSkip?: () => void
}

const LiveVideoCapture = ({ onCapture, onSkip }: LiveVideoCaptureProps) => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const recordedVideoRef = useRef<HTMLVideoElement>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout>()

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        },
        audio: true
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsStreaming(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast.error('Unable to access camera and microphone. Please check permissions.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setIsStreaming(false)
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [stream])

  const startRecording = useCallback(() => {
    if (stream) {
      chunksRef.current = []
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      })
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const videoUrl = URL.createObjectURL(blob)
        setRecordedVideo(videoUrl)
        
        if (recordedVideoRef.current) {
          recordedVideoRef.current.src = videoUrl
        }
      }
      
      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
  }, [stream])

  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [mediaRecorder, isRecording])

  const confirmVideo = useCallback(() => {
    if (chunksRef.current.length > 0) {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      onCapture(blob)
      toast.success('Vehicle video captured successfully!')
    }
  }, [onCapture])

  const retakeVideo = useCallback(() => {
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo)
      setRecordedVideo(null)
    }
    setRecordingTime(0)
    startCamera()
  }, [recordedVideo, startCamera])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Video className="h-5 w-5 mr-2" />
          Live Vehicle Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
          {!isStreaming && !recordedVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Video className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Record a video of your vehicle</p>
                <Button onClick={startCamera}>
                  Start Camera
                </Button>
              </div>
            </div>
          )}
          
          {isStreaming && !recordedVideo && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {isRecording && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                  REC {formatTime(recordingTime)}
                </div>
              )}
            </>
          )}
          
          {recordedVideo && (
            <video
              ref={recordedVideoRef}
              controls
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <p>• Show the exterior of your vehicle from all angles</p>
          <p>• Include the interior and any special features</p>
          <p>• Make sure the license plate is clearly visible</p>
          <p>• Record for at least 30 seconds, maximum 2 minutes</p>
          <p>• Ensure good lighting and stable recording</p>
        </div>

        <div className="flex gap-2">
          {isStreaming && !recordedVideo && (
            <>
              {!isRecording ? (
                <Button onClick={startRecording} className="flex-1">
                  <Video className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button onClick={stopRecording} variant="destructive" className="flex-1">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Recording
                </Button>
              )}
              <Button variant="outline" onClick={stopCamera}>
                Cancel
              </Button>
            </>
          )}
          
          {recordedVideo && (
            <>
              <Button onClick={confirmVideo} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Confirm Video
              </Button>
              <Button variant="outline" onClick={retakeVideo}>
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

export default LiveVideoCapture
