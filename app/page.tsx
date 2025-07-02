import SubscrriptionsBlock from './components/blocks/SubscrriptionsBlock'
import HomeHero from './components/common/HomeHero'
import AnnouncementBanner from './components/home/AnnouncementBanner'
import Audience from './components/home/Audience'
import Features from './components/home/Features'
import InsideTheApp from './components/home/InsideTheApp'
import SnapshotDashboard from './components/home/SnapshotDashboard'
import Solution from './components/home/Solution'

const Home = () => {
  return (
    <>
      <HomeHero />

      <SnapshotDashboard />

      <Audience />
      <AnnouncementBanner />
      <InsideTheApp />
      <Solution />
      <Features />
      <SubscrriptionsBlock />
    </>
  )
}

export default Home
