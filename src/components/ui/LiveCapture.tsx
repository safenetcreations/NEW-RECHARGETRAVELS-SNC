import React, { useEffect, useRef, useState } from 'react'

type LiveCaptureProps = {
  label: string
  facingMode?: 'user' | 'environment'
  filename?: string
  onCapture: (file: File) => void
}

const challenges = [
  'Blink twice slowly, then press Capture',
  'Turn your head slightly left, then press Capture',
  'Smile and hold still, then press Capture'
]

const LiveCapture: React.FC<LiveCaptureProps> = ({ label, facingMode = 'environment', filename = 'capture.jpg', onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [challenge, setChallenge] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    setChallenge(challenges[Math.floor(Math.random() * challenges.length)])
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch (err) {
        console.error('Camera error', err)
        setError('Unable to access camera. Please allow camera permissions or use the upload fallback.')
      }
    }
    start()
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((t) => t.stop())
      }
    }
  }, [facingMode])

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], filename, { type: 'image/jpeg' })
      onCapture(file)
    }, 'image/jpeg', 0.92)
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-black/80 relative">
        <video ref={videoRef} className="w-full h-64 object-cover" playsInline muted />
        <canvas ref={canvasRef} className="hidden" />
        {challenge && (
          <div className="absolute bottom-2 left-2 bg-white/80 px-3 py-1 rounded-full text-xs text-gray-800 shadow">
            {challenge}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={captureFrame}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
        >
          Capture
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
      <p className="text-xs text-gray-500">Camera-only capture. Please follow the prompt above before capturing.</p>
    </div>
  )
}

export default LiveCapture
