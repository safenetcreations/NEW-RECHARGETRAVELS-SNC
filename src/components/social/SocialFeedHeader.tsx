
import React from 'react'

interface SocialFeedHeaderProps {
  updateTime: string
}

export const SocialFeedHeader = ({ updateTime }: SocialFeedHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-orange-400 text-white py-12 px-5 text-center shadow-lg">
      <h1 className="text-4xl font-bold mb-3">#RechargeLife Live Social Feed</h1>
      <p className="text-xl opacity-90">Follow our latest adventures and travel experiences</p>
      <div className="mt-5 text-sm opacity-80">
        Last updated: {updateTime}
      </div>
    </div>
  )
}
