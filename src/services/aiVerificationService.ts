/**
 * AI Verification / Risk / Matching scaffolding.
 * This file stubs interfaces for OCR + face/liveness + risk scoring + driver matching.
 * Replace the placeholder implementations with real API calls (e.g., Vision OCR, Rekognition, Vertex/Bedrock LLM).
 */

export type DocType = 'national_id' | 'drivers_license' | 'slt_da_license' | 'police_clearance' | 'medical_report'

export interface OcrResult {
  docType: DocType
  text: string
  fields: Record<string, string>
  confidence: number
  imageBlurScore?: number // 0-1, lower is blurrier
  needsRetake?: boolean
}

export interface FaceMatchResult {
  matchConfidence: number // 0-1
  liveScore?: number // 0-1
  passed: boolean
}

export interface RiskSignal {
  name: string
  weight: number
  value: string | number | boolean
}

export interface RiskAssessment {
  riskScore: number // 0-100
  level: 'low' | 'medium' | 'high'
  signals: RiskSignal[]
  action: 'allow' | 'review' | 'suspend'
}

export interface MatchingInput {
  route?: string
  passengers?: number
  language?: string
  vehicleType?: string
  date?: string
  ratingWeight?: number
  experienceWeight?: number
}

export interface DriverCandidate {
  id: string
  name?: string
  rating?: number
  years?: number
  vehicleType?: string
  languages?: string[]
  cancellationRate?: number
}

export interface MatchSuggestion {
  driverId: string
  score: number
  reasons: string[]
}

// --- Placeholder implementations ---

export async function runOcr(file: File, docType: DocType): Promise<OcrResult> {
  // Uses Gemini multimodal for OCR extraction. Replace prompt/fields as needed.
  const key = import.meta.env.VITE_GEMINI_API_KEY
  if (!key) throw new Error('Gemini API key missing')
  const form = new FormData()
  form.append('file', file)
  // Minimal transport; for production, proxy through your backend to keep the key secret.
  const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { parts: [{ text: `Extract fields from a ${docType}. Return JSON with number, name, expiry.` }, { inline_data: { mime_type: file.type, data: await file.arrayBuffer() } }] }
      ]
    })
  })
  const data = await resp.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join(' ') || ''
  return {
    docType,
    text,
    fields: {},
    confidence: 0.6,
    imageBlurScore: 0.1,
    needsRetake: false
  }
}

export async function runFaceMatch(selfie: File, idDoc: File): Promise<FaceMatchResult> {
  const azureKey = import.meta.env.VITE_AZURE_FACE_KEY
  const azureEndpoint = import.meta.env.VITE_AZURE_FACE_ENDPOINT // e.g., https://<resource>.cognitiveservices.azure.com

  if (azureKey && azureEndpoint) {
    // Azure Face API: detect & verify
    const detect = async (file: File) => {
      const resp = await fetch(`${azureEndpoint}/face/v1.0/detect?returnFaceId=true&detectionModel=detection_03`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': azureKey,
          'Content-Type': file.type
        },
        body: file
      })
      const json = await resp.json()
      if (!json[0]?.faceId) throw new Error('No face detected')
      return json[0].faceId as string
    }

    try {
      const selfieId = await detect(selfie)
      const idFaceId = await detect(idDoc)
      const verifyResp = await fetch(`${azureEndpoint}/face/v1.0/verify`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': azureKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ faceId1: selfieId, faceId2: idFaceId })
      })
      const verify = await verifyResp.json()
      return {
        matchConfidence: verify.confidence || 0,
        liveScore: undefined,
        passed: !!verify.isIdentical && (verify.confidence || 0) > 0.6
      }
    } catch (err) {
      console.error('Azure Face verify error', err)
      return { matchConfidence: 0, liveScore: undefined, passed: false }
    }
  }

  // Fallback: placeholder
  return { matchConfidence: 0.7, liveScore: 0.6, passed: true }
}

export async function scoreRisk(signals: RiskSignal[]): Promise<RiskAssessment> {
  const total = signals.reduce((acc, s) => acc + (s.weight || 1), 0)
  const riskScore = Math.min(100, Math.max(0, 50 + (signals.find((s) => s.name === 'duplicate_id') ? 30 : 0) - (signals.find((s) => s.name === 'good_history') ? 20 : 0)))
  return {
    riskScore,
    level: riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low',
    signals,
    action: riskScore > 70 ? 'suspend' : riskScore > 40 ? 'review' : 'allow'
  }
}

export async function suggestDrivers(inputs: MatchingInput, candidates: DriverCandidate[]): Promise<MatchSuggestion[]> {
  // Simple heuristic scorer; replace with ML ranker.
  const results = candidates.map((c) => {
    let score = 0
    if (inputs.language && c.languages?.some((l) => l.toLowerCase().includes(inputs.language!.toLowerCase()))) score += 10
    if (inputs.vehicleType && c.vehicleType === inputs.vehicleType) score += 10
    if (c.rating) score += c.rating * (inputs.ratingWeight || 2)
    if (c.years) score += Math.min(10, c.years)
    if (c.cancellationRate !== undefined) score -= c.cancellationRate * 20
    return { driverId: c.id, score, reasons: [] as string[] }
  })
  const maxScore = Math.max(...results.map((r) => r.score), 1)
  return results
    .sort((a, b) => b.score - a.score)
    .map((r) => ({
      ...r,
      score: parseFloat((r.score / maxScore).toFixed(2)),
      reasons: [
        inputs.language && candidates.find((c) => c.id === r.driverId)?.languages?.includes(inputs.language) ? 'Language match' : '',
        inputs.vehicleType && candidates.find((c) => c.id === r.driverId)?.vehicleType === inputs.vehicleType ? 'Vehicle match' : '',
        (candidates.find((c) => c.id === r.driverId)?.rating || 0) > 4.5 ? 'High rating' : '',
      ].filter(Boolean)
    }))
}
