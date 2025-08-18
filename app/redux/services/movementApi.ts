import { setCloseMovementDrawer } from '../features/movementSlice'
import { api } from './api'
import { createOptimisticHandlers } from '@/app/lib/api/optimisticUpdates'

const BASE_URL = '/movement'

let movementHandlers: any = null
let handlersPromise: Promise<any> | null = null

const getMovementHandlers = async () => {
  if (movementHandlers) {
    return movementHandlers
  }

  if (!handlersPromise) {
    handlersPromise = (async () => {
      // Dynamic imports for ES modules
      const [{ addMovementToState, updateMovementInState, removeMovementFromState }, { updateUserTokens }] =
        await Promise.all([import('../features/movementSlice'), import('../features/userSlice')])

      const petConfig = {
        addAction: addMovementToState,
        updateAction: updateMovementInState,
        removeAction: removeMovementFromState,
        updateTokensAction: updateUserTokens,
        closeDrawer: setCloseMovementDrawer,
        responseKey: 'movement',
        getEntityFromState: (state: { movement: { movements: any[] } }, id: any) =>
          state.movement.movements.find((movement) => movement.id === id)
      }

      movementHandlers = createOptimisticHandlers(petConfig)
      return movementHandlers
    })()
  }

  return handlersPromise
}

export const movementApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    createMovement: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled }: any) => {
        const handlers = await getMovementHandlers()
        await handlers.handleCreate(dispatch)(data, queryFulfilled)
      },
      invalidatesTags: ['Movement', 'User']
    }),
    updateMovement: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.movementId}/update`, method: 'PATCH', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getMovementHandlers()
        const { movementId, ...updateFields } = data
        const updateData = { id: movementId, ...updateFields }
        await handlers.handleUpdate(dispatch, getState)(updateData, queryFulfilled)
      },
      invalidatesTags: ['Movement', 'User']
    }),
    deleteMovement: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.id}/delete`, method: 'DELETE', body }),
      onQueryStarted: async (data: { id: any }, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getMovementHandlers()
        await handlers.handleDelete(dispatch, getState)(data, queryFulfilled)
      },
      invalidatesTags: ['Movement', 'User']
    })
  })
})

export const { useCreateMovementMutation, useUpdateMovementMutation, useDeleteMovementMutation } = movementApi
