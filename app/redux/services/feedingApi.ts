import { setCloseFeedingDrawer } from '../features/feedingSlice'
import { api } from './api'
import { createOptimisticHandlers } from '@/app/lib/api/optimisticUpdates'

const BASE_URL = '/feeding'

let feedingHandlers: any = null
let handlersPromise: Promise<any> | null = null

const getFeedingHandlers = async () => {
  if (feedingHandlers) {
    return feedingHandlers
  }

  if (!handlersPromise) {
    handlersPromise = (async () => {
      // Dynamic imports for ES modules
      const [{ addFeedingToState, updateFeedingInState, removeFeedingFromState }, { updateUserTokens }] =
        await Promise.all([import('../features/feedingSlice'), import('../features/userSlice')])

      const petConfig = {
        addAction: addFeedingToState,
        updateAction: updateFeedingInState,
        removeAction: removeFeedingFromState,
        updateTokensAction: updateUserTokens,
        closeDrawer: setCloseFeedingDrawer,
        responseKey: 'feeding',
        getEntityFromState: (state: { feeding: { feedings: any[] } }, id: any) =>
          state.feeding.feedings.find((feeding) => feeding.id === id)
      }

      feedingHandlers = createOptimisticHandlers(petConfig)
      return feedingHandlers
    })()
  }

  return handlersPromise
}

export const feedingApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    createFeeding: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled }: any) => {
        const handlers = await getFeedingHandlers()
        await handlers.handleCreate(dispatch)(data, queryFulfilled)
      },
      invalidatesTags: ['Feeding', 'User']
    }),
    updateFeeding: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.feedingId}/update`, method: 'PATCH', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getFeedingHandlers()
        const { feedingId, ...updateFields } = data
        const updateData = { id: feedingId, ...updateFields }
        await handlers.handleUpdate(dispatch, getState)(updateData, queryFulfilled)
      },
      invalidatesTags: ['Feeding', 'User']
    }),
    deleteFeeding: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.id}/delete`, method: 'DELETE', body }),
      onQueryStarted: async (data: { id: any }, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getFeedingHandlers()
        await handlers.handleDelete(dispatch, getState)(data, queryFulfilled)
      },
      invalidatesTags: ['Feeding', 'User']
    })
  })
})

export const { useCreateFeedingMutation, useUpdateFeedingMutation, useDeleteFeedingMutation } = feedingApi
