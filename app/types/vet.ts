// types/vet.ts
export interface Vet {
  id: string
  vetName: string
  clinicName: string
  phone: string
  emergencyPhone?: string
  email?: string
  address?: string
  website?: string
  hours?: string
  notes?: string
  licenseNumber?: string
  speciality?: string
  createdAt: string
  updatedAt: string
}

export interface VetFormData {
  vetName: string
  clinicName: string
  phone: string
  emergencyPhone?: string
  email?: string
  address?: string
  website?: string
  hours?: string
  notes?: string
  licenseNumber?: string
  speciality?: string
}

export interface CreateVetRequest {
  vetData: VetFormData
}

export interface UpdateVetRequest {
  vetData: VetFormData
}

export interface VetResponse {
  vet: Vet | null
  hasVet: boolean
}

export interface CreateVetResponse {
  success: boolean
  user: {
    id: string
    vet: Vet
  }
}

export interface UpdateVetResponse {
  success: boolean
  vet: Vet
}
