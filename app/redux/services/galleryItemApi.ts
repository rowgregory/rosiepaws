import { createOptimisticHandlers } from '@/app/lib/api/optimisticUpdates'
import { api } from './api'

const BASE_URL = '/gallery'

let galleryItemHandlers: any = null
let handlersPromise: Promise<any> | null = null

const getGalleryItemHandlers = async () => {
  if (galleryItemHandlers) {
    return galleryItemHandlers
  }

  if (!handlersPromise) {
    handlersPromise = (async () => {
      // Dynamic imports for ES modules
      const [{ addGalleryItemToState, updateGalleryItemInState, removeGalleryItemFromState }, { updateUserTokens }] =
        await Promise.all([import('../features/galleryItemSlice'), import('../features/userSlice')])

      const petConfig = {
        addAction: addGalleryItemToState,
        updateAction: updateGalleryItemInState,
        removeAction: removeGalleryItemFromState,
        updateTokensAction: updateUserTokens,
        responseKey: 'galleryItem',
        getEntityFromState: (state: { galleryItem: { galleryItems: any[] } }, id: any) =>
          state.galleryItem.galleryItems.find((galleryItem) => galleryItem.id === id)
      }

      galleryItemHandlers = createOptimisticHandlers(petConfig)
      return galleryItemHandlers
    })()
  }

  return handlersPromise
}

export const galleryItemApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    listPublicGalleryItems: build.query({
      query: () => `${BASE_URL}/list-public`,
      providesTags: ['Gallery-Item']
    }),
    createGalleryItem: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/create`, method: 'POST', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled }: any) => {
        const handlers = await getGalleryItemHandlers()
        await handlers.handleCreate(dispatch)(data, queryFulfilled)
      }
    }),
    updateGalleryItem: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/${body.galleryItemId}/update-is-public`, method: 'PATCH', body }),
      onQueryStarted: async (data: any, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getGalleryItemHandlers()
        const { galleryItemId, ...updateFields } = data
        const updateData = { id: galleryItemId, ...updateFields }
        await handlers.handleUpdate(dispatch, getState)(updateData, queryFulfilled)
      },
      invalidatesTags: ['Gallery-Item']
    }),
    deleteGalleryItem: build.mutation({
      query: ({ id }: any) => ({ url: `${BASE_URL}/${id}`, method: 'DELETE' }),
      onQueryStarted: async (data: { id: any }, { dispatch, queryFulfilled, getState }: any) => {
        const handlers = await getGalleryItemHandlers()
        await handlers.handleDelete(dispatch, getState)(data, queryFulfilled)
      }
    })
  })
})

export const {
  useListPublicGalleryItemsQuery,
  useCreateGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation
} = galleryItemApi
