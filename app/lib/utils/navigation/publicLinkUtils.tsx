import {
  guardianDashboardLink,
  guardianHomeLink,
  guardianPetsLink,
  guardianGalleryLink,
  guardianSettingsLink,
  guardianInfoLink,
  guardianResourcesLink
} from '@/public/data/admin.data'
import {
  LayoutDashboard,
  Cat,
  Settings,
  Home,
  Images,
  Info,
  Heart,
  Activity,
  Utensils,
  Droplets,
  Pill,
  Zap,
  PawPrint,
  Calendar,
  Footprints,
  Navigation,
  Archive
} from 'lucide-react'

interface PetLink {
  linkKey?: string
  textKey?: string
  isActive?: boolean
  icon?: React.ReactNode
  gradient?: string
  isPremium?: boolean
}

export const publicDashboardLinks = (path: string, zeroPets: boolean) => [
  {
    icon: Home,
    textKey: 'Home',
    linkKey: guardianHomeLink,
    isActive: path === guardianHomeLink
  },
  ...(zeroPets
    ? []
    : [
        {
          icon: LayoutDashboard,
          textKey: 'Dashboard',
          linkKey: guardianDashboardLink,
          isActive: path === guardianDashboardLink
        }
      ]),
  ...(zeroPets
    ? []
    : [
        {
          icon: Cat,
          textKey: 'My Pets',
          linkKey: guardianPetsLink,
          isActive: path === guardianPetsLink
        }
      ]),
  ...(zeroPets
    ? []
    : [
        {
          icon: Images,
          textKey: 'Gallery',
          linkKey: guardianGalleryLink,
          isActive: path === guardianGalleryLink
        }
      ]),
  {
    icon: Archive,
    textKey: 'Resources',
    linkKey: guardianResourcesLink,
    isActive: path === guardianResourcesLink
  },
  {
    icon: Settings,
    textKey: 'Settings',
    linkKey: guardianSettingsLink,
    isActive: path === guardianSettingsLink
  },
  {
    icon: Info,
    textKey: 'Info',
    linkKey: guardianInfoLink,
    isActive: path === guardianInfoLink
  }
]

export const publicPetLinks = (path: string): PetLink[] => [
  {
    linkKey: '/guardian/pets/my-pets',
    textKey: 'My Pets',
    isActive: path === '/guardian/pets/my-pets',
    icon: <PawPrint className="w-4 h-4" />,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    linkKey: '/guardian/pets/pain',
    textKey: 'Pain Scoring',
    isActive: path === '/guardian/pets/pain',
    icon: <Activity className="w-4 h-4" />,
    gradient: 'from-red-500 to-orange-500'
  },
  {
    linkKey: '/guardian/pets/feedings',
    textKey: 'Feedings',
    isActive: path === '/guardian/pets/feedings',
    icon: <Utensils className="w-4 h-4" />,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    linkKey: '/guardian/pets/water',
    textKey: 'Water Intake',
    isActive: path === '/guardian/pets/water',
    icon: <Droplets className="w-4 h-4" />,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    linkKey: '/guardian/pets/walks',
    textKey: 'Walks',
    isActive: path === '/guardian/pets/walks',
    icon: <Footprints className="w-4 h-4" />,
    gradient: 'from-brown-500 to-gray-500'
  },
  {
    linkKey: '/guardian/pets/movements',
    textKey: 'Movements',
    isActive: path === '/guardian/pets/movements',
    icon: <Navigation className="w-4 h-4" />,
    gradient: 'from-lime-500 to-yellow-500'
  },
  {
    linkKey: '/guardian/pets/appointments',
    textKey: 'Appointments',
    isActive: path === '/guardian/pets/appointments',
    icon: <Calendar className="w-4 h-4" />,
    gradient: 'from-amber-500 to-yellow-500'
  },
  {
    linkKey: '/guardian/pets/medication',
    textKey: 'Medications',
    isActive: path === '/guardian/pets/medication',
    icon: <Pill className="w-4 h-4" />,
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    linkKey: '/guardian/pets/blood-sugar',
    textKey: 'Blood Sugar',
    isActive: path === '/guardian/pets/blood-sugar',
    icon: <Heart className="w-4 h-4" />,
    gradient: 'from-pink-500 to-rose-500',
    isPremium: true
  },
  {
    linkKey: '/guardian/pets/seizure',
    textKey: 'Seizure Tracking',
    isActive: path === '/guardian/pets/seizure',
    icon: <Zap className="w-4 h-4" />,
    gradient: 'from-yellow-500 to-orange-500',
    isPremium: true
  }
]
