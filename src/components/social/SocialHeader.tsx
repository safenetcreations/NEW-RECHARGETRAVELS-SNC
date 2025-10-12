
import React from 'react'

interface SocialHeaderProps {
  updateTime: string
}

export const SocialHeader = ({ updateTime }: SocialHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-orange-400 text-white py-12 px-5 text-center shadow-lg">
      <h1 className="text-4xl font-bold mb-3">#RechargeLife Social Media Hub</h1>
      <p className="text-xl opacity-90">Welcome back! Manage your social media presence</p>
      <div className="mt-5 text-sm opacity-80">
        Last updated: {updateTime}
      </div>
    </div>
  )
}
