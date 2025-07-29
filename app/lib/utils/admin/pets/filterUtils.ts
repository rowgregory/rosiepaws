import { Pet } from '@/app/types'

export // Filter pets
const petFilter = (pets: Pet[], searchTerm: string, typeFilter: string, statusFilter: string) =>
  pets?.filter((pet) => {
    const ownerFullName = `${pet.owner.firstName} ${pet.owner.lastName}`
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ownerFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === 'all' || pet.type === typeFilter

    const daysSinceUpdate = Math.floor(
      (new Date().getTime() - new Date(pet.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    const updatedRecently = daysSinceUpdate <= 30
    const hasNotes = pet.notes && pet.notes.length > 0

    let matchesStatus: any = true
    if (statusFilter === 'active') matchesStatus = updatedRecently
    else if (statusFilter === 'needs_attention') matchesStatus = hasNotes
    else if (statusFilter === 'inactive') matchesStatus = !updatedRecently && !hasNotes

    return matchesSearch && matchesType && matchesStatus
  }) || []
