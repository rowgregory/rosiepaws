'use client'

import { useEffect, useState } from 'react'
import HomeHero from './components/common/HomeHero'
import AnnouncementBanner from './components/home/AnnouncementBanner'
import Audience from './components/home/Audience'
import InsideTheApp from './components/home/InsideTheApp'
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
      <InsideTheApp />
      <Solution />
    </>
  )
}

export default Home
