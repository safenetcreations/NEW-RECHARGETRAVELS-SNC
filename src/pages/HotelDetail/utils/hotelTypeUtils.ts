
export const validHotelTypes = ['middle_range', 'luxury_resort', 'cabana', 'budget', 'boutique'] as const
export type ValidHotelType = typeof validHotelTypes[number]

export const validateHotelType = (hotelType: string): ValidHotelType => {
  return validHotelTypes.includes(hotelType as ValidHotelType) 
    ? (hotelType as ValidHotelType) 
    : 'middle_range'
}

export const isGooglePlaceId = (id: string): boolean => {
  return id.startsWith('ChIJ') || id.length > 36
}
