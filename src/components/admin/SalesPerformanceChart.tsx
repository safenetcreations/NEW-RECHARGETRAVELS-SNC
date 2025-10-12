
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart } from 'lucide-react'

const SalesPerformanceChart: React.FC = () => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Sales Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart className="h-48 w-full" />
      </CardContent>
    </Card>
  )
}

export default SalesPerformanceChart
