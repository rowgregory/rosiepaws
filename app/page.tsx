'use client'

import { useEffect, useState } from 'react'
import HomeHero from './components/home/HomeHero'
import AnnouncementBanner from './components/home/AnnouncementBanner'
import Audience from './components/home/Audience'
import PeaceOfMindShowcase from './components/home/PeaceOfMindShowcase'
import SnapshotDashboard from './components/home/SnapshotDashboard'
import Solution from './components/home/Solution'

const Home = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return

  return (
    <>
      <HomeHero />
      <SnapshotDashboard />
      <Audience />
      <AnnouncementBanner />
      <PeaceOfMindShowcase />
      <Solution />
    </>
  )
}

export default Home
