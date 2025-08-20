import { setLastTempId } from '@/app/redux/features/appSlice'

// utils/optimisticUpdates.js
export const createOptimisticHandlers = (entityConfig: {
  responseKey?: any
  addAction?: any
  updateAction?: any
  removeAction?: any
  updateTokensAction?: any
  getEntityFromState?: any
  closeDrawer?: any
}) => {
  const { addAction, updateAction, removeAction, updateTokensAction, getEntityFromState, closeDrawer } = entityConfig

  const handleCreate =
    (dispatch: (arg0: any) => void) =>
    async (data: any, queryFulfilled: PromiseLike<{ data: any }> | { data: any }) => {
      const tempId = `temp-${Date.now()}`
      const optimisticEntity = { ...data, id: tempId }

      dispatch(closeDrawer())
      dispatch(addAction(optimisticEntity))
      if (optimisticEntity.id?.toString().startsWith('temp-')) {
        dispatch(setLastTempId(optimisticEntity.id))
      }

      try {
        const { data: response } = await queryFulfilled
        dispatch(
          updateAction({
            findById: tempId,
            replaceWith: response[entityConfig.responseKey]
          })
        )
        dispatch(updateTokensAction(response.user))
      } catch {
        dispatch(removeAction(tempId))
      }
    }

  const handleUpdate =
    (dispatch: (arg0: any) => void, getState: () => any) =>
    async (updateData: { [x: string]: any; id: any }, queryFulfilled: PromiseLike<{ data: any }> | { data: any }) => {
      const { id, ...updateFields } = updateData // Extract id separately
      const currentState = getState()
      const originalEntity = getEntityFromState(currentState, id)

      dispatch(closeDrawer())
      // Apply optimistic update - keep the original id
      dispatch(
        updateAction({
          ...originalEntity, // Original entity data
          ...updateFields, // New field updates (without id)
          id: id // Explicitly keep the same id
        })
      )

      try {
        const { data: response } = await queryFulfilled
        dispatch(
          updateAction({
            findById: id, // Use the id to find
            replaceWith: response[entityConfig.responseKey]
          })
        )
        dispatch(updateTokensAction(response.user))
      } catch {
        if (originalEntity) {
          dispatch(
            updateAction({
              findById: id,
              replaceWith: originalEntity
            })
          )
        }
      }
    }

  const handleDelete =
    (dispatch: (arg0: any) => void, getState: () => any) =>
    async (deleteData: { id: any }, queryFulfilled: PromiseLike<{ data: any }> | { data: any }) => {
      const { id } = deleteData
      const currentState = getState()
      const originalEntity = getEntityFromState(currentState, id)

      if (!originalEntity) {
        console.error('Original entity not found for ID:', id)
        return
      }

      // Apply optimistic delete
      dispatch(removeAction(id))

      try {
        const { data: response } = await queryFulfilled
        dispatch(updateTokensAction(response.user))
      } catch {
        if (originalEntity) {
          dispatch(
            updateAction({
              findById: id,
              replaceWith: originalEntity
            })
          )
        }
      }
    }

  return { handleCreate, handleUpdate, handleDelete }
}
