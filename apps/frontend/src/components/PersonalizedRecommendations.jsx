import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import axios from 'axios'

const PersonalizedRecommendations = ({ userId, numResults = 10 }) => {
  const { backendUrl } = useContext(ShopContext)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendations()
  }, [userId])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const url = userId
        ? `${backendUrl}/api/personalize/recommendations?userId=${userId}&numResults=${numResults}`
        : `${backendUrl}/api/personalize/recommendations?numResults=${numResults}`
      
      const response = await axios.get(url)
      
      if (response.data.success) {
        setRecommendations(response.data.recommendations)
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='my-10'>
        <div className='text-center py-8 text-3xl'>
          <Title text1={'RECOMMENDED'} text2={'FOR YOU'} />
        </div>
        <div className='text-center text-gray-500'>Loading recommendations...</div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'RECOMMENDED'} text2={'FOR YOU'} />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {recommendations.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  )
}

export default PersonalizedRecommendations
