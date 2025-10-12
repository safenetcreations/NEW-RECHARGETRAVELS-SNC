
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color?: string
  link?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'text-gray-700', link }) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {link && (
          <Link to={link} className="text-sm text-blue-500 hover:underline block mt-2">
            View Details
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

export default StatCard
