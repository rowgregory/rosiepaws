import { addPainScoresToState } from '../features/painScoreSlice'
import {
  // addAppointmentToPet,
  // addAppointmentToState,
  // addBloodSugarToPet,
  // addBloodSugarToState,
  // addFeedingToPet,
  // addFeedingToState,
  // addMedicationToPet,
  // addMedicationToState,
  // addMovementToPet,
  // addMovementToState,
  addPetToState,
  removePetFromState,
  updatePetInState
  // addSeizureToPet,
  // addSeizureToState,
  // addWalkToPet,
  // addWalkToState,
  // addWaterToPet,
  // addWaterToState,
  // updateMedicationInPet,
  // updateMedicationInState,
  // updateWalkInPet,
  // updateWalkInState
} from '../features/petSlice'
import { updateUserTokens } from '../features/userSlice'
import { api } from './api'

const BASE_URL = '/pet'

export const petApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    fetchMyPets: build.query({
      query: () => `${BASE_URL}/fetch-my-pets`,
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        dispatch(addPainScoresToState(data.painScores))
        dispatch(
          updateUserTokens({
            tokens: data.user.tokens,
            tokensUsed: data.user.tokensUsed
          })
        )
      },
      providesTags: ['Pet']
    }),
    createPet: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        dispatch(addPetToState(data.pet))
        dispatch(
          updateUserTokens({
            tokens: data.user.tokens,
            tokensUsed: data.user.tokensUsed
          })
        )
      },
      invalidatesTags: ['User']
    }),
    updatePet: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.petId}/update`, method: 'PATCH', body }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        dispatch(updatePetInState(data.pet))
        dispatch(
          updateUserTokens({
            tokens: data.user.tokens,
            tokensUsed: data.user.tokensUsed
          })
        )
      }
    }),
    deletePet: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/delete-pet`, method: 'DELETE', body }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        dispatch(removePetFromState(data.deletedPet.id))
        dispatch(
          updateUserTokens({
            tokens: data.user.tokens,
            tokensUsed: data.user.tokensUsed
          })
        )
      }
    })
    // createFeeding: build.mutation({
    //   query: (body: any) => ({ url: `${BASE_URL}/create-feeding`, method: 'POST', body }),
    //   onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
    //     const { data } = await queryFulfilled
    //     const newFeeding = data.feeding
    //     dispatch(addFeedingToState(newFeeding))
    //     dispatch(addFeedingToPet(newFeeding))
    //     dispatch(
    //       updateUserTokens({
    //         tokens: data.user.tokens,
    //         tokensUsed: data.user.tokensUsed
    //       })
    //     )
    //   }
    // }),
    // createBloodSugar: build.mutation({
    //   query: (body: any) => ({ url: `${BASE_URL}/create-blood-sugar`, method: 'POST', body }),
    //   onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
    //     const { data } = await queryFulfilled
    //     const newBloodSugar = data.bloodSugar
    //     dispatch(addBloodSugarToState(newBloodSugar))
    //     dispatch(addBloodSugarToPet(newBloodSugar))
    //     dispatch(
    //       updateUserTokens({
    //         tokens: data.user.tokens,
    //         tokensUsed: data.user.tokensUsed
    //       })
    //     )
    //   }
    // }),
    // createWater: build.mutation({
    //   query: (body: any) => ({ url: `${BASE_URL}/create-water`, method: 'POST', body }),
    //   onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
    //     const { data } = await queryFulfilled
    //     const newWater = data.water
    //     dispatch(addWaterToState(newWater))
    //     dispatch(addWaterToPet(newWater))
    //     dispatch(
    //       updateUserTokens({
    //         tokens: data.user.tokens,
    //         tokensUsed: data.user.tokensUsed
    //       })
    //     )
    //   }
    // }),
    // createMedication: build.mutation({
    //   query: (body: any) => ({ url: `${BASE_URL}/create-medication`, method: 'POST', body }),
    //   onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
    //     const { data } = await queryFulfilled
    //     const newMedication = data.medication
    //     dispatch(addMedicationToState(newMedication))
    //     dispatch(addMedicationToPet(newMedication))
    //     dispatch(
    //       updateUserTokens({
    //         tokens: data.user.tokens,
    //         tokensUsed: data.user.tokensUsed
    //       })
    //     )
    //   }
    // }),
    // updateMedication: build.mutation({
    //   query: (body: any) => ({ url: `${BASE_URL}/update-medication`, method: 'PATCH', body }),
    //   onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
    //     const { data } = await queryFulfilled
    //     const updatedMedication = data.medication
    //     dispatch(updateMedicationInState(updatedMedication))
    //     dispatch(updateMedicationInPet(updatedMedication))
    //     dispatch(
    //       updateUserTokens({
    //         tokens: data.user.tokens,
    //         tokensUsed: data.user.tokensUsed
    //       })
    //     )
    //   }
    // }),
    // createSeizure: build.mutation({
    //   query: (body: any) => ({ url: `${BASE_URL}/create-seizure`, method: 'POST', body }),
    //   onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
    //     const { data } = await queryFulfilled
    //     const newSeizure = data.seizure
    //     dispatch(addSeizureToState(newSeizure))
    //     dispatch(addSeizureToPet(newSeizure))
    //     dispatch(
    //       updateUserTokens({
    //         tokens: data.user.tokens,
    //         tokensUsed: data.user.tokensUsed
    //       })
    //     )
    //   }
    // }),
    // createWalk: build.mutation({
    //   query: (body: any) => ({ url: `${BASE_URL}/create-walk`, method: 'POST', body }),
    //   onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
    //     const { data } = await queryFulfilled
    //     const newWalk = data.walk
    //     dispatch(addWalkToState(newWalk))
    //     dispatch(addWalkToPet(newWalk))
    //     dispatch(
    //       updateUserTokens({
    //         tokens: data.user.tokens,
    //         tokensUsed: data.user.tokensUsed
    //       })
    //     )
    //   }
    // }),
    // updateWalk: build.mutation({
    //   query: (body: any) => ({ url: `${BASE_URL}/update-walk`, method: 'PATCH', body }),
    //   onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
    //     const { data } = await queryFulfilled
    //     const updatedWalk = data.walk
    //     dispatch(updateWalkInState(updatedWalk))
    //     dispatch(updateWalkInPet(updatedWalk))
    //     dispatch(
    //       updateUserTokens({
    //         tokens: data.user.tokens,
    //         tokensUsed: data.user.tokensUsed
    //       })
    //     )
    //   }
    // }),
    // createAppointment: build.mutation({
    //   query: (body: any) => ({ url: `${BASE_URL}/create-appointment`, method: 'POST', body }),
    //   onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
    //     const { data } = await queryFulfilled
    //     const newAppointment = data.appointment
    //     dispatch(addAppointmentToState(newAppointment))
    //     dispatch(addAppointmentToPet(newAppointment))
    //     dispatch(
    //       updateUserTokens({
    //         tokens: data.user.tokens,
    //         tokensUsed: data.user.tokensUsed
    //       })
    //     )
    //   }
    // }),
    // createMovement: build.mutation({
    //   query: (body: any) => ({ url: `${BASE_URL}/movement/create-movement`, method: 'POST', body }),
    //   onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
    //     const { data } = await queryFulfilled
    //     const newMovement = data.movement
    //     dispatch(addMovementToState(newMovement))
    //     dispatch(addMovementToPet(newMovement))
    //     dispatch(
    //       updateUserTokens({
    //         tokens: data.user.tokens,
    //         tokensUsed: data.user.tokensUsed
    //       })
    //     )
    //   }
    // })
  })
})

export const {
  useFetchMyPetsQuery,
  useCreatePetMutation,
  useUpdatePetMutation,
  useDeletePetMutation
  // useCreateFeedingMutation,
  // useCreateBloodSugarMutation,
  // useCreateWaterMutation,
  // useCreateMedicationMutation,
  // useUpdateMedicationMutation,
  // useCreateSeizureMutation,
  // useCreateWalkMutation,
  // useUpdateWalkMutation,
  // useCreateAppointmentMutation,
  // useCreateMovementMutation
} = petApi
