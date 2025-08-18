import { setCloseSeizureDrawer } from '../features/seizureSlice'
import { api } from './api'
import { createOptimisticHandlers } from '@/app/lib/api/optimisticUpdates'

const BASE_URL = '/seizure'

let seizureHandlers: any = null
let handlersPromise: Promise<any> | null = null

const getSeizureHandlers = async () => {
  if (seizureHandlers) {
    return seizureHandlers
  }

  if (!handlersPromise) {
    handlersPromise = (async () => {
      // Dynamic imports for ES modules
      const [{ addSeizureToState, updateSeizureInState, removeSeizureFromState }, { updateUserTokens }] =
        await Promise.all([import('../features/seizureSlice'), import('../features/userSlice')])

      const petConfig = {
        addAction: addSeizureToState,
        updateAction: updateSeizureInState,
        removeAction: removeSeizureFromState,
        updateTokensAction: updateUserTokens,
        closeDrawer: setCloseSeizureDrawer,
        responseKey: 'seizure',
        getEntityFromState: (state: { seizure: { seizures: any[] } }, id: any) =>
          state.seizure.seizures.find((seizure) => seizure.id === id)
      }

      seizureHandlers = createOptimisticHandlers(petConfig)
      return seizureHandlers
    })()
  }

  return handlersPromise
}

export const seizureApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    createSeizure: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled }: any) => {
        const handlers = await getSeizureHandlers()
        await handlers.handleCreate(dispatch)(data, queryFulfilled)
      },
      invalidatesTags: ['Seizure', 'User']
    }),
    updateSeizure: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.seizureId}/update`, method: 'PATCH', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getSeizureHandlers()
        const { seizureId, ...updateFields } = data
        const updateData = { id: seizureId, ...updateFields }
        await handlers.handleUpdate(dispatch, getState)(updateData, queryFulfilled)
      },
      invalidatesTags: ['Seizure', 'User']
    }),
    deleteSeizure: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.id}/delete`, method: 'DELETE', body }),
      onQueryStarted: async (data: { id: any }, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getSeizureHandlers()
        await handlers.handleDelete(dispatch, getState)(data, queryFulfilled)
      },
      invalidatesTags: ['Seizure', 'User']
    })
  })
})

export const { useCreateSeizureMutation, useUpdateSeizureMutation, useDeleteSeizureMutation } = seizureApi
