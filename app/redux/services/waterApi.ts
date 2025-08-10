import { api } from './api'
import { createOptimisticHandlers } from '@/app/lib/utils/api/optimisticUpdates'

const BASE_URL = '/water'

let waterHandlers: any = null
let handlersPromise: Promise<any> | null = null

const getWaterHandlers = async () => {
  if (waterHandlers) {
    return waterHandlers
  }

  if (!handlersPromise) {
    handlersPromise = (async () => {
      // Dynamic imports for ES modules
      const [{ addWaterToState, updateWaterInState, removeWaterFromState }, { updateUserTokens }] = await Promise.all([
        import('../features/waterSlice'),
        import('../features/userSlice')
      ])

      const petConfig = {
        addAction: addWaterToState,
        updateAction: updateWaterInState,
        removeAction: removeWaterFromState,
        updateTokensAction: updateUserTokens,
        responseKey: 'water',
        getEntityFromState: (state: { water: { waters: any[] } }, id: any) =>
          state.water.waters.find((water) => water.id === id)
      }

      waterHandlers = createOptimisticHandlers(petConfig)
      return waterHandlers
    })()
  }

  return handlersPromise
}

export const waterApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    createWater: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled }: any) => {
        const handlers = await getWaterHandlers()
        await handlers.handleCreate(dispatch)(data, queryFulfilled)
      },
      invalidatesTags: ['Water', 'Pet']
    }),
    updateWater: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.waterId}/update`, method: 'PATCH', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getWaterHandlers()
        const { waterId, ...updateFields } = data
        const updateData = { id: waterId, ...updateFields }
        await handlers.handleUpdate(dispatch, getState)(updateData, queryFulfilled)
      },
      invalidatesTags: ['Water', 'Pet']
    }),
    deleteWater: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.id}/delete`, method: 'DELETE', body }),
      onQueryStarted: async (data: { id: any }, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getWaterHandlers()
        await handlers.handleDelete(dispatch, getState)(data, queryFulfilled)
      },
      invalidatesTags: ['Water', 'Pet']
    })
  })
})

export const { useCreateWaterMutation, useUpdateWaterMutation, useDeleteWaterMutation } = waterApi
