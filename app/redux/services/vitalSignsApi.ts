import { api } from './api'
import { createOptimisticHandlers } from '@/app/lib/utils/api/optimisticUpdates'

const BASE_URL = '/vital-signs'

let vitalSignsHandlers: any = null
let handlersPromise: Promise<any> | null = null

const getVitalSignsHandlers = async () => {
  if (vitalSignsHandlers) {
    return vitalSignsHandlers
  }

  if (!handlersPromise) {
    handlersPromise = (async () => {
      // Dynamic imports for ES modules
      const [{ addVitalSignsToState, updateVitalSignsInState, removeVitalSignsFromState }, { updateUserTokens }] =
        await Promise.all([import('../features/vitalSignsSlice'), import('../features/userSlice')])

      const petConfig = {
        addAction: addVitalSignsToState,
        updateAction: updateVitalSignsInState,
        removeAction: removeVitalSignsFromState,
        updateTokensAction: updateUserTokens,
        responseKey: 'vital-signs',
        getEntityFromState: (state: { vitalSigns: { vitalSigns: any[] } }, id: any) =>
          state.vitalSigns.vitalSigns.find((vitalSigns) => vitalSigns.id === id)
      }

      vitalSignsHandlers = createOptimisticHandlers(petConfig)
      return vitalSignsHandlers
    })()
  }

  return handlersPromise
}

export const vitalSignsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    createVitalSigns: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled }: any) => {
        const handlers = await getVitalSignsHandlers()
        await handlers.handleCreate(dispatch)(data, queryFulfilled)
      },
      invalidatesTags: ['Vital-Signs', 'Pet']
    }),
    updateVitalSigns: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.vitalSignsId}/update`, method: 'PATCH', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getVitalSignsHandlers()
        const { vitalSignsId, ...updateFields } = data
        const updateData = { id: vitalSignsId, ...updateFields }
        await handlers.handleUpdate(dispatch, getState)(updateData, queryFulfilled)
      },
      invalidatesTags: ['Vital-Signs', 'Pet']
    }),
    deleteVitalSigns: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.id}/delete`, method: 'DELETE', body }),
      onQueryStarted: async (data: { id: any }, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getVitalSignsHandlers()
        await handlers.handleDelete(dispatch, getState)(data, queryFulfilled)
      },
      invalidatesTags: ['Vital-Signs', 'Pet']
    })
  })
})

export const { useCreateVitalSignsMutation, useUpdateVitalSignsMutation, useDeleteVitalSignsMutation } = vitalSignsApi
