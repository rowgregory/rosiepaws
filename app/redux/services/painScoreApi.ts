import { api } from './api'
import { createOptimisticHandlers } from '@/app/lib/utils/api/optimisticUpdates'

const BASE_URL = '/pain-score'

let painHandlers: any = null
let handlersPromise: Promise<any> | null = null

const getPainHandlers = async () => {
  if (painHandlers) {
    return painHandlers
  }

  if (!handlersPromise) {
    handlersPromise = (async () => {
      // Dynamic imports for ES modules
      const [{ addPainScoreToState, updatePainScoreInState, removePainScoreFromState }, { updateUserTokens }] =
        await Promise.all([import('../features/painSlice'), import('../features/userSlice')])

      const petConfig = {
        addAction: addPainScoreToState,
        updateAction: updatePainScoreInState,
        removeAction: removePainScoreFromState,
        updateTokensAction: updateUserTokens,
        responseKey: 'painScore',
        getEntityFromState: (state: { painScore: { painScores: any[] } }, id: any) =>
          state.painScore.painScores.find((painScore) => painScore.id === id)
      }

      painHandlers = createOptimisticHandlers(petConfig)
      return painHandlers
    })()
  }

  return handlersPromise
}

export const painScoreApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    createPainScore: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled }: any) => {
        const handlers = await getPainHandlers()
        await handlers.handleCreate(dispatch)(data, queryFulfilled)
      },
      invalidatesTags: ['Pain-Score', 'Pet']
    }),
    updatePainScore: build.mutation({
      query: (body: any) => ({
        url: `${BASE_URL}/${body.painId}/update`,
        method: 'PATCH',
        body
      }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getPainHandlers()
        const { painId, ...updateFields } = data
        const updateData = { id: painId, ...updateFields }
        await handlers.handleUpdate(dispatch, getState)(updateData, queryFulfilled)
      },
      invalidatesTags: ['Pain-Score', 'Pet']
    }),
    deletePainScore: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.id}/delete`, method: 'DELETE', body }),
      onQueryStarted: async (data: { id: any }, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getPainHandlers()
        await handlers.handleDelete(dispatch, getState)(data, queryFulfilled)
      },
      invalidatesTags: ['Pain-Score', 'Pet']
    })
  })
})

export const { useCreatePainScoreMutation, useUpdatePainScoreMutation, useDeletePainScoreMutation } = painScoreApi
