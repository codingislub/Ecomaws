import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import axios from 'axios';

const RelatedProducts = ({category,subCategory, productId}) => {

    const { products, backendUrl } = useContext(ShopContext);
    const [related,setRelated] = useState([]);
    const [usePersonalize, setUsePersonalize] = useState(false);

    useEffect(()=>{
        fetchRelatedProducts()
    },[products, productId])

    const fetchRelatedProducts = async () => {
        // Try to get Personalize recommendations first
        if (productId) {
            try {
                const response = await axios.get(`${backendUrl}/api/personalize/recommendations/${productId}?numResults=6`)
                if (response.data.success && response.data.recommendations.length > 0) {
                    setRelated(response.data.recommendations)
                    setUsePersonalize(true)
                    return
                }
            } catch (error) {
                console.error('Error fetching Personalize recommendations:', error)
            }
        }

        // Fallback to category-based recommendations
        if (products.length > 0) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item) => category === item.category);
            productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);
            setRelated(productsCopy.slice(0,5));
            setUsePersonalize(false)
        }
    }

  return (
    <div className='my-24'>
      <div className=' text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={"PRODUCTS"} />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {related.map((item,index)=>(
            <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image}/>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
