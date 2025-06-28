import SubscrriptionsBlock from './components/blocks/SubscrriptionsBlock'
import HomeHero from './components/common/HomeHero'
import AnnouncementBanner from './components/home/AnnouncementBanner'
import Features from './components/home/Features'
import InsideTheApp from './components/home/InsideTheApp'
import SnapshotDashboard from './components/home/SnapshotDashboard'
import Solution from './components/home/Solution'

const Home = () => {
  return (
    <>
      <HomeHero />
      <AnnouncementBanner />
      <InsideTheApp />
      <Solution />
      <SnapshotDashboard />
      <Features />
      <SubscrriptionsBlock />
    </>
  )
}

export default Home
