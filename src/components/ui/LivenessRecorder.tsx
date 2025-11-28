import React, { useEffect, useRef, useState } from 'react'

type LivenessRecorderProps = {
  label?: string
  durationMs?: number
  filename?: string
  onCapture: (file: File) => void
  onVerify?: (file: File) => Promise<boolean>
}

const defaultChallenges = [
  'Turn your head left, then right',
  'Blink twice and smile',
  'Raise your eyebrows, then nod'
]

/**
 * Lightweight video recorder using MediaRecorder to capture a short clip for liveness checks.
 * No gallery access; uses camera stream only.
 */
const LivenessRecorder: React.FC<LivenessRecorderProps> = ({
  label = 'Liveness Video',
  durationMs = 5000,
  filename = 'liveness.webm',
  onCapture,
  onVerify
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const [recording, setRecording] = useState(false)
  const [challenge, setChallenge] = useState(defaultChallenges[0])
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    setChallenge(defaultChallenges[Math.floor(Math.random() * defaultChallenges.length)])
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        recorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' })
        recorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data)
        recorderRef.current.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' })
          chunksRef.current = []
          const file = new File([blob], filename, { type: 'video/webm' })
          onCapture(file)
          if (onVerify) {
            setStatus('Verifying...')
            try {
              const ok = await onVerify(file)
              setStatus(ok ? 'Verified' : 'Failed verification')
            } catch (err) {
              console.error('Verify error', err)
              setStatus('Verification failed')
            }
          } else {
            setStatus('Captured')
          }
        }
      } catch (err) {
        console.error('Camera error', err)
        setError('Camera access denied. Please allow permissions.')
      }
    }
    start()
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        ;(videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop())
      }
      if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop()
    }
  }, [filename, onCapture, onVerify])

  const startRecording = () => {
    if (!recorderRef.current || recording) return
    setStatus('Recording...')
    setRecording(true)
    recorderRef.current.start()
    setTimeout(() => {
      recorderRef.current?.stop()
      setRecording(false)
    }, durationMs)
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-black/80 relative">
        <video ref={videoRef} className="w-full h-64 object-cover" playsInline muted />
        <div className="absolute bottom-2 left-2 bg-white/80 px-3 py-1 rounded-full text-xs text-gray-800 shadow">
          {challenge}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={startRecording}
          disabled={recording}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {recording ? 'Recording...' : 'Record 5s'}
        </button>
        {status && <span className="text-xs text-gray-700">{status}</span>}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
      <p className="text-xs text-gray-500">Camera-only video; no uploads from gallery. Follow the prompt for liveness.</p>
    </div>
  )
}

export default LivenessRecorder
