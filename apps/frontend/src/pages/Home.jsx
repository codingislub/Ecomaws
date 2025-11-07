import React, { useContext } from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import PersonalizedRecommendations from '../components/PersonalizedRecommendations'
import { ShopContext } from '../context/ShopContext'

const Home = () => {
  const { getUserId } = useContext(ShopContext)
  const userId = getUserId()

  return (
    <div>
      <Hero />
      <LatestCollection/>
      <PersonalizedRecommendations userId={userId} numResults={10} />
      <BestSeller/>
      <OurPolicy/>
      <NewsletterBox/>
    </div>
  )
}

export default Home
