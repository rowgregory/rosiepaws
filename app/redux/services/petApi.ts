import {
  addPainScoreToPet,
  addPainScoreToState,
  addPetToState,
  removePetFromState,
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
    })
  })
})

export const {
  useFetchAllPetsQuery,
  useFetchMyPetsQuery,
  useCreatePetMutation,
  useCreatePainScoreMutation,
  useUpdatePetMutation,
  useDeletePetMutation
} = petApi
