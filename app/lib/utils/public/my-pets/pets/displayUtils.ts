import { POPULAR_BREEDS } from '../../../../constants'

export const getCurrentBreeds = (inputs: any) => {
  if (inputs?.type === 'dog') return POPULAR_BREEDS.dog
  if (inputs?.type === 'cat') return POPULAR_BREEDS.cat
  return []
}
