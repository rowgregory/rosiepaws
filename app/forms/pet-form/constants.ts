export const PET_TYPES = [
  { id: 'dog', name: 'Dog', icon: '🐶', color: 'bg-amber-50 border-amber-300 text-amber-700' },
  { id: 'cat', name: 'Cat', icon: '🐱', color: 'bg-purple-50 border-purple-300 text-purple-700' }
]

export const GENDER_OPTIONS = [
  { id: 'male', name: 'Male', icon: '♂️', color: 'bg-blue-50 border-blue-300 text-blue-700' },
  { id: 'female', name: 'Female', icon: '♀️', color: 'bg-pink-50 border-pink-300 text-pink-700' }
]

export const POPULAR_BREEDS = {
  dog: [
    'Golden Retriever',
    'Labrador',
    'German Shepherd',
    'Bulldog',
    'Beagle',
    'Poodle',
    'Rottweiler',
    'Siberian Husky'
  ],
  cat: ['Persian', 'Maine Coon', 'British Shorthair', 'Ragdoll', 'Bengal', 'Abyssinian', 'Russian Blue', 'Siamese']
}

export const isPetFormValid = (inputs: any) => {
  return inputs?.name && inputs?.type && inputs?.breed && inputs?.age && inputs?.gender && inputs?.weight
}

export const getCurrentBreeds = (inputs: any) => {
  if (inputs?.type === 'dog') return POPULAR_BREEDS.dog
  if (inputs?.type === 'cat') return POPULAR_BREEDS.cat
  return []
}
