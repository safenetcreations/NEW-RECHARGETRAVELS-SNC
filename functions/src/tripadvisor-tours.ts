import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp()
}

export type TripAdvisorMode = 'live' | 'mock'

export interface GetTripAdvisorToursRequest {
  mode?: TripAdvisorMode
  limit?: number
  operatorProfileUrl?: string
}

export const getTripAdvisorTours = functions.https.onCall(
  async (data: GetTripAdvisorToursRequest, context) => {
    try {
      const mode: TripAdvisorMode = data?.mode === 'live' ? 'live' : 'mock'
      const limit = typeof data?.limit === 'number' ? data.limit : 20
      const operatorProfileUrl =
        data?.operatorProfileUrl ||
        'https://www.tripadvisor.com/Attraction_Review-g293962-d10049587-Reviews-Recharge_Travels_And_Tours-Colombo_Western_Province.html'

      const apiKey =
        functions.config()?.tripadvisor?.apikey ||
        process.env.TRIPADVISOR_API_KEY ||
        ''

      if (mode === 'live') {
        if (!apiKey) {
          console.error('TripAdvisor API key not configured')
          return {
            success: false,
            status: 'CONFIG_ERROR',
            error:
              'TripAdvisor API key not configured in functions config or environment variables'
          }
        }

        return {
          success: false,
          status: 'NOT_IMPLEMENTED',
          error: 'Live TripAdvisor API integration not implemented yet'
        }
      }

      return {
        success: true,
        status: 'MOCK_DATA',
        operatorProfileUrl,
        tours: [],
        limit
      }
    } catch (error: any) {
      console.error('TripAdvisor tours handler error:', error)
      return {
        success: false,
        status: 'INTERNAL_ERROR',
        error: error?.message || 'Unknown error'
      }
    }
  }
)
