import { api } from './api'
import { createOptimisticHandlers } from '@/app/lib/api/optimisticUpdates'

const BASE_URL = '/medication'

let medicationHandlers: any = null
let handlersPromise: Promise<any> | null = null

const getMedicationHandlers = async () => {
  if (medicationHandlers) {
    return medicationHandlers
  }

  if (!handlersPromise) {
    handlersPromise = (async () => {
      // Dynamic imports for ES modules
      const [{ addMedicationToState, updateMedicationInState, removeMedicationFromState }, { updateUserTokens }] =
        await Promise.all([import('../features/medicationSlice'), import('../features/userSlice')])

      const petConfig = {
        addAction: addMedicationToState,
        updateAction: updateMedicationInState,
        removeAction: removeMedicationFromState,
        updateTokensAction: updateUserTokens,
        responseKey: 'medication',
        getEntityFromState: (state: { medication: { medications: any[] } }, id: any) =>
          state.medication.medications.find((medication) => medication.id === id)
      }

      medicationHandlers = createOptimisticHandlers(petConfig)
      return medicationHandlers
    })()
  }

  return handlersPromise
}

export const medicationApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    createMedication: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled }: any) => {
        const handlers = await getMedicationHandlers()
        await handlers.handleCreate(dispatch)(data, queryFulfilled)
      },
      invalidatesTags: ['Medication', 'User']
    }),
    updateMedication: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.medicationId}/update`, method: 'PATCH', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getMedicationHandlers()
        const { medicationId, ...updateFields } = data
        const updateData = { id: medicationId, ...updateFields }
        await handlers.handleUpdate(dispatch, getState)(updateData, queryFulfilled)
      },
      invalidatesTags: ['Medication', 'User']
    }),
    deleteMedication: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.id}/delete`, method: 'DELETE', body }),
      onQueryStarted: async (data: { id: any }, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getMedicationHandlers()
        await handlers.handleDelete(dispatch, getState)(data, queryFulfilled)
      },
      invalidatesTags: ['Medication', 'User']
    })
  })
})

export const { useCreateMedicationMutation, useUpdateMedicationMutation, useDeleteMedicationMutation } = medicationApi
