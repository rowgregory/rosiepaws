import { api } from './api'
import { createOptimisticHandlers } from '@/app/lib/utils/api/optimisticUpdates'

const BASE_URL = '/blood-sugar'

let bloodSugarHandlers: any = null
let handlersPromise: Promise<any> | null = null

const getBloodSugarHandlers = async () => {
  if (bloodSugarHandlers) {
    return bloodSugarHandlers
  }

  if (!handlersPromise) {
    handlersPromise = (async () => {
      // Dynamic imports for ES modules
      const [{ addBloodSugarToState, updateBloodSugarInState, removeBloodSugarFromState }, { updateUserTokens }] =
        await Promise.all([import('../features/bloodSugarSlice'), import('../features/userSlice')])

      const petConfig = {
        addAction: addBloodSugarToState,
        updateAction: updateBloodSugarInState,
        removeAction: removeBloodSugarFromState,
        updateTokensAction: updateUserTokens,
        responseKey: 'bloodSugar',
        getEntityFromState: (state: { bloodSugar: { bloodSugars: any[] } }, id: any) =>
          state.bloodSugar.bloodSugars.find((bloodSugar) => bloodSugar.id === id)
      }

      bloodSugarHandlers = createOptimisticHandlers(petConfig)
      return bloodSugarHandlers
    })()
  }

  return handlersPromise
}

export const bloodSugarApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    createBloodSugar: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled }: any) => {
        const handlers = await getBloodSugarHandlers()
        await handlers.handleCreate(dispatch)(data, queryFulfilled)
      },
      invalidatesTags: ['Blood-Sugar', 'Pet']
    }),
    updateBloodSugar: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.bloodSugarId}/update`, method: 'PATCH', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getBloodSugarHandlers()
        const { bloodSugarId, ...updateFields } = data
        const updateData = { id: bloodSugarId, ...updateFields }
        await handlers.handleUpdate(dispatch, getState)(updateData, queryFulfilled)
      },
      invalidatesTags: ['Blood-Sugar', 'Pet']
    }),
    deleteBloodSugar: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.id}/delete`, method: 'DELETE', body }),
      onQueryStarted: async (data: { id: any }, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getBloodSugarHandlers()
        await handlers.handleDelete(dispatch, getState)(data, queryFulfilled)
      },
      invalidatesTags: ['Blood-Sugar', 'Pet']
    })
  })
})

export const { useCreateBloodSugarMutation, useUpdateBloodSugarMutation, useDeleteBloodSugarMutation } = bloodSugarApi
