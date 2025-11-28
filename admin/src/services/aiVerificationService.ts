export interface RiskSignal {
  name: string
  weight: number
  value: string | number | boolean
}

export interface RiskAssessment {
  riskScore: number
  level: 'low' | 'medium' | 'high'
  signals: RiskSignal[]
  action: 'allow' | 'review' | 'suspend'
}

export async function scoreRisk(signals: RiskSignal[]): Promise<RiskAssessment> {
  const base = signals.reduce((acc, s) => acc + (s.weight || 1), 0)
  const hasGood = signals.find((s) => s.name === 'good_history')
  const riskScore = Math.min(100, Math.max(0, base - (hasGood ? 5 : 0) + 50))
  return {
    riskScore,
    level: riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low',
    signals,
    action: riskScore > 70 ? 'suspend' : riskScore > 40 ? 'review' : 'allow'
  }
}
