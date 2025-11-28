import React from 'react'
import { RiskAssessment } from '@/services/aiVerificationService'
import { Badge } from '@/components/ui/badge'

const DriverRiskBadge: React.FC<{ assessment?: RiskAssessment }> = ({ assessment }) => {
  if (!assessment) return null
  const color =
    assessment.level === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
    assessment.level === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
    'bg-emerald-100 text-emerald-800 border-emerald-200'
  return (
    <Badge className={color}>Risk {assessment.level} ({assessment.riskScore})</Badge>
  )
}

export default DriverRiskBadge
