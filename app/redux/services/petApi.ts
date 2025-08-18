import { createOptimisticHandlers } from '@/app/lib/api/optimisticUpdates'
import { api } from './api'
import { setClosePetDrawer } from '../features/petSlice'

const BASE_URL = '/pet'

let petHandlers: any = null
let handlersPromise: Promise<any> | null = null

const getPetHandlers = async () => {
  if (petHandlers) {
    return petHandlers
  }

  if (!handlersPromise) {
    handlersPromise = (async () => {
      // Dynamic imports for ES modules
      const [{ addPetToState, updatePetInState, removePetFromState }, { updateUserTokens }] = await Promise.all([
        import('../features/petSlice'),
        import('../features/userSlice')
      ])

      const petConfig = {
        addAction: addPetToState,
        updateAction: updatePetInState,
        removeAction: removePetFromState,
        updateTokensAction: updateUserTokens,
        closeDrawer: setClosePetDrawer,
        responseKey: 'pet',
        getEntityFromState: (state: { pet: { pets: any[] } }, id: any) => state.pet.pets.find((pet) => pet.id === id)
      }

      petHandlers = createOptimisticHandlers(petConfig)
      return petHandlers
    })()
  }

  return handlersPromise
}

export const petApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => {
    return {
      createPet: build.mutation({
        query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
        onQueryStarted: async (data: any, { dispatch, queryFulfilled }: any) => {
          const handlers = await getPetHandlers()
          await handlers.handleCreate(dispatch)(data, queryFulfilled)
        },
        invalidatesTags: ['Pet', 'User']
      }),
      updatePet: build.mutation({
        query: (body: any) => ({ url: `${BASE_URL}/${body.petId}/update`, method: 'PATCH', body }),
        onQueryStarted: async (data: any, { dispatch, queryFulfilled, getState }: any) => {
          const handlers = await getPetHandlers()
          const { petId, ...updateFields } = data
          const updateData = { id: petId, ...updateFields }
          await handlers.handleUpdate(dispatch, getState)(updateData, queryFulfilled)
        },
        invalidatesTags: ['Pet', 'User']
      }),
      deletePet: build.mutation({
        query: (body: any) => ({ url: `${BASE_URL}/${body.petId}/delete`, method: 'DELETE', body }),
        onQueryStarted: async (data: { id: any }, { dispatch, queryFulfilled, getState }: any) => {
          const handlers = await getPetHandlers()
          await handlers.handleDelete(dispatch, getState)(data, queryFulfilled)
        },
        invalidatesTags: ['Pet', 'User']
      })
    }
  }
})

export const { useCreatePetMutation, useUpdatePetMutation, useDeletePetMutation } = petApi
