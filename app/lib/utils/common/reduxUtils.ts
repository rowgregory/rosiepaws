export const updateUserTokensOnSuccess = (updateUserTokensAction: any) => {
  return async (_: any, { dispatch, queryFulfilled }: any) => {
    try {
      const { data } = await queryFulfilled

      if (data?.user?.tokens !== undefined) {
        dispatch(
          updateUserTokensAction({
            tokens: data.user.tokens,
            tokensUsed: data.user.tokensUsed
          })
        )
      }
    } catch (error) {
      // Query failed, tokens weren't updated
      console.error('Failed to update user tokens:', error)
    }
  }
}
