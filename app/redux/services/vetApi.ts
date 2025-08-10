import { VetResponse, CreateVetResponse, UpdateVetResponse, Vet, VetFormData } from '@/app/types/vet'
import { api } from './api'

const BASE_URL = '/vet'

export const vetApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get user's vet information
    getVet: builder.query<VetResponse, void>({
      query: () => BASE_URL,
      providesTags: ['Vet'],
      transformResponse: (response: { vet: Vet | null }) => ({
        vet: response.vet,
        hasVet: !!response.vet
      })
    }),

    // Create new vet profile
    createVet: builder.mutation<CreateVetResponse, VetFormData>({
      query: (vetData) => ({
        url: BASE_URL,
        method: 'POST',
        body: { vetData }
      }),
      invalidatesTags: ['Vet'],
      transformResponse: (response: CreateVetResponse) => response
    }),

    // Update existing vet profile
    updateVet: builder.mutation<UpdateVetResponse, VetFormData>({
      query: (vetData) => ({
        url: BASE_URL,
        method: 'PUT',
        body: { vetData }
      }),
      invalidatesTags: ['Vet'],
      transformResponse: (response: UpdateVetResponse) => response
    }),

    // Delete vet profile
    deleteVet: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: BASE_URL,
        method: 'DELETE'
      }),
      invalidatesTags: ['Vet']
    }),

    // Get all vets (admin only, optional)
    getAllVets: builder.query<Vet[], void>({
      query: () => 'all',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Vet' as const, id })), { type: 'Vet', id: 'LIST' }]
          : [{ type: 'Vet', id: 'LIST' }]
    })
  })
})

export const { useGetVetQuery, useCreateVetMutation, useUpdateVetMutation, useDeleteVetMutation, useGetAllVetsQuery } =
  vetApi
