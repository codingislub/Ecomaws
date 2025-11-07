import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 36,
        totalPages: 0
    });
    
    // Get or generate userId for Personalize tracking
    const getUserId = () => {
        if (token) {
            // Extract userId from JWT token for logged-in users
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.id;
            } catch (error) {
                console.error('Error parsing token:', error);
            }
        }
        // Use or create session ID for anonymous users
        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    };

    // Track product view event
    const trackProductView = async (productId, productData) => {
        try {
            const userId = getUserId();
            await axios.post(backendUrl + '/api/personalize/track/view', {
                userId,
                productId,
                productData: {
                    name: productData?.name,
                    category: productData?.category,
                    price: productData?.price
                }
            });
        } catch (error) {
            console.error('Error tracking view:', error);
        }
    };


    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        // Track add to cart event for Personalize
        try {
            const userId = getUserId();
            const product = products.find(p => p._id === itemId);
            await axios.post(backendUrl + '/api/personalize/track/cart', {
                userId,
                productId: itemId,
                quantity: 1,
                productData: {
                    name: product?.name,
                    price: product?.price
                }
            });
        } catch (error) {
            console.error('Error tracking cart add:', error);
        }

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData)

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async (page = 1, limit = 36) => {
        try {

            const response = await axios.get(backendUrl + `/api/product/list?page=${page}&limit=${limit}`)
            if (response.data.success) {
                console.log("Fetched products:", response.data.products)
                setProducts(response.data.products)
                if (response.data.pagination) {
                    setPagination(response.data.pagination)
                }
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = async ( token ) => {
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
        }
    }, [token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token, pagination, getProductsData,
        trackProductView, getUserId
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;