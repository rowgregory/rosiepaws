import { Pet } from '@/app/types'
import { FC } from 'react'
import { Users, Heart, Activity, AlertCircle } from 'lucide-react'
import AdminStatCard from '../common/AdminStatCard'

const PetsStats: FC<{ pets: Pet[] }> = ({ pets }) => {
  const totalPets = pets?.length || 0
  const activePets =
    pets?.filter((pet) => {
      const daysSinceUpdate = Math.floor(
        (new Date().getTime() - new Date(pet.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      )
      return daysSinceUpdate <= 30
    }).length || 0
  const petsWithNotes = pets?.filter((pet) => pet.notes && pet.notes.length > 0).length || 0
  const uniqueOwners = new Set(pets?.map((p) => p.ownerId)).size || 0

  const subscriptionStatsData = [
    {
      title: 'Total Pets',
      value: totalPets,
      icon: Heart,
      formatter: (value: { toLocaleString: () => any }) => value.toLocaleString()
    },
    {
      title: 'Recently Active',
      value: activePets,
      icon: Activity,
      formatter: (value: { toLocaleString: () => any }) => value.toLocaleString()
    },
    {
      title: 'With Notes',
      value: petsWithNotes,
      icon: AlertCircle,
      formatter: (value: { toLocaleString: () => any }) => value.toLocaleString()
    },
    {
      title: 'Unique Owners',
      value: uniqueOwners,
      icon: Users,
      formatter: (value: { toLocaleString: () => any }) => value.toLocaleString()
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {subscriptionStatsData.map((stat, i) => (
        <AdminStatCard key={i} title={stat.title} value={stat.value} icon={stat.icon} index={i} />
      ))}
    </div>
  )
}

export default PetsStats
