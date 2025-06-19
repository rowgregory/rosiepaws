import {
  addBloodSugarToPet,
  addBloodSugarToState,
  addFeedingToPet,
  addFeedingToState,
  addMedicationToPet,
  addMedicationToState,
  addPainScoreToPet,
  addPainScoreToState,
  addPetToState,
  addSeizureToPet,
  addSeizureToState,
  addWaterToPet,
  addWaterToState,
  removePetFromState,
  updateMedicationInPet,
  updateMedicationInState,
  updatePetInState
} from '../features/petSlice'
import { api } from './api'

const BASE_URL = '/pet'

export const petApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    fetchAllPets: build.query({
      query: () => `${BASE_URL}/fetch-all-pets`
    }),
    fetchMyPets: build.query({
      query: () => `${BASE_URL}/fetch-my-pets`
    }),
    createPet: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create-pet`, method: 'POST', body }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        dispatch(addPetToState(data.pet))
      }
    }),
    createPainScore: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create-pain-score`, method: 'POST', body }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        const newPainScore = data.painScore
        dispatch(addPainScoreToState(newPainScore))
        dispatch(addPainScoreToPet(newPainScore))
      }
    }),
    updatePet: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/update-pet`, method: 'PUT', body }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        dispatch(updatePetInState(data.pet))
      }
    }),
    deletePet: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/delete-pet`, method: 'DELETE', body }),
      onQueryStarted: async (arg: any, { dispatch, queryFulfilled }: any) => {
        await queryFulfilled
        dispatch(removePetFromState(arg.id))
      }
    }),
    createFeeding: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create-feeding`, method: 'POST', body }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        const newFeeding = data.feeding
        dispatch(addFeedingToState(newFeeding))
        dispatch(addFeedingToPet(newFeeding))
      }
    }),
    createBloodSugar: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create-blood-sugar`, method: 'POST', body }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        const newBloodSugar = data.bloodSugar
        dispatch(addBloodSugarToState(newBloodSugar))
        dispatch(addBloodSugarToPet(newBloodSugar))
      }
    }),
    createWater: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create-water`, method: 'POST', body }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        const newWater = data.water
        dispatch(addWaterToState(newWater))
        dispatch(addWaterToPet(newWater))
      }
    }),
    createMedication: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create-medication`, method: 'POST', body }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        const newMedication = data.medication
        dispatch(addMedicationToState(newMedication))
        dispatch(addMedicationToPet(newMedication))
      }
    }),
    updateMedication: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/update-medication`, method: 'PATCH', body }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        const updatedMedication = data.medication
        dispatch(updateMedicationInState(updatedMedication))
        dispatch(updateMedicationInPet(updatedMedication))
      }
    }),
    createSeizure: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create-seizure`, method: 'POST', body }),
      onQueryStarted: async (_: any, { dispatch, queryFulfilled }: any) => {
        const { data } = await queryFulfilled
        const newSeizure = data.seizure
        dispatch(addSeizureToState(newSeizure))
        dispatch(addSeizureToPet(newSeizure))
      }
    })
  })
})

export const {
  useFetchAllPetsQuery,
  useFetchMyPetsQuery,
  useCreatePetMutation,
  useCreatePainScoreMutation,
  useUpdatePetMutation,
  useDeletePetMutation,
  useCreateFeedingMutation,
  useCreateBloodSugarMutation,
  useCreateWaterMutation,
  useCreateMedicationMutation,
  useUpdateMedicationMutation,
  useCreateSeizureMutation
} = petApi
