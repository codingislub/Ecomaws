import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const CATEGORY_OPTIONS = ['Men', 'Women', 'Kids']
const SUBCATEGORY_OPTIONS = ['Topwear', 'Bottomwear', 'Winterwear']

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relavent')

  const toggleCategory = (e) => {
    const value = e.target.value
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )
  }

  const toggleSubCategory = (e) => {
    const value = e.target.value
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )
  }

  const applyFilter = () => {
    let productsCopy = products ? [...products] : []

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(
        (item) =>
          item.category &&
          category
            .map((c) => c.toLowerCase().trim())
            .includes(item.category.toLowerCase().trim())
      )
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(
        (item) =>
          item.subCategory &&
          subCategory
            .map((s) => s.toLowerCase().trim())
            .includes(item.subCategory.toLowerCase().trim())
      )
    }

    // Sorting
    switch (sortType) {
      case 'low-high':
        productsCopy = [...productsCopy].sort((a, b) => a.price - b.price)
        break
      case 'high-low':
        productsCopy = [...productsCopy].sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    setFilterProducts(productsCopy)
  }

  useEffect(() => {
    if (products && products.length) {
      applyFilter()
    } else {
      setFilterProducts([])
    }
  }, [category, subCategory, search, showSearch, products])

  useEffect(() => {
    applyFilter()
  }, [sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      <div className='min-w-60'>
        <p
          onClick={() => setShowFilter(!showFilter)}
          className='my-2 text-xl flex items-center cursor-pointer gap-2'
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt=''
          />
        </p>

        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'
            } sm:block`}
        >
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {CATEGORY_OPTIONS.map((option) => (
              <label className='flex gap-2' key={option}>
                <input
                  className='w-3'
                  type='checkbox'
                  value={option}
                  onChange={toggleCategory}
                  checked={category.includes(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* SubCategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'
            } sm:block`}
        >
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {SUBCATEGORY_OPTIONS.map((option) => (
              <label className='flex gap-2' key={option}>
                <input
                  className='w-3'
                  type='checkbox'
                  value={option}
                  onChange={toggleSubCategory}
                  checked={subCategory.includes(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className='border-2 border-gray-300 text-sm px-2'
            value={sortType}
          >
            <option value='relavent'>Sort by: Relevant</option>
            <option value='low-high'>Sort by: Low to High</option>
            <option value='high-low'>Sort by: High to Low</option>
          </select>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.length === 0 ? (
            <div className='col-span-full text-center text-gray-500'>
              No products found.
            </div>
          ) : (
            filterProducts.map((item, index) => (
              <ProductItem
                key={item._id || index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Collection
