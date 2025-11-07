// controllers/personalizeController.js
import {
  trackProductView,
  trackAddToCart,
  trackPurchase,
} from "../utils/personalizeEvents.js";
import {
  getRecommendations,
  getFallbackRecommendations,
  getRelatedProducts,
} from "../utils/personalizeRecommendations.js";

/**
 * Track product view event
 */
export const trackView = async (req, res) => {
  try {
    const { userId, productId, productData } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId and productId are required" 
      });
    }

    const result = await trackProductView(userId, productId, productData);
    res.json(result);
  } catch (error) {
    console.error("Error tracking view:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Track add to cart event
 */
export const trackCartAdd = async (req, res) => {
  try {
    const { userId, productId, quantity, productData } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId and productId are required" 
      });
    }

    const result = await trackAddToCart(userId, productId, quantity, productData);
    res.json(result);
  } catch (error) {
    console.error("Error tracking cart add:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Track purchase event
 */
export const trackPurchaseEvent = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || !Array.isArray(items)) {
      return res.status(400).json({ 
        success: false, 
        message: "userId and items array are required" 
      });
    }

    const result = await trackPurchase(userId, items);
    res.json(result);
  } catch (error) {
    console.error("Error tracking purchase:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get personalized recommendations for user
 */
export const getUserRecommendations = async (req, res) => {
  try {
    const { userId } = req.query;
    const numResults = parseInt(req.query.numResults) || 10;

    if (!userId) {
      // Return fallback recommendations for anonymous users
      const result = await getFallbackRecommendations(numResults);
      return res.json(result);
    }

    const result = await getRecommendations(userId, numResults);
    
    // If Personalize fails, return fallback
    if (!result.success || result.recommendations.length === 0) {
      const fallback = await getFallbackRecommendations(numResults);
      return res.json(fallback);
    }

    res.json(result);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get related products for a specific product
 */
export const getProductRecommendations = async (req, res) => {
  try {
    const { productId } = req.params;
    const numResults = parseInt(req.query.numResults) || 6;

    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: "productId is required" 
      });
    }

    const result = await getRelatedProducts(productId, numResults);
    res.json(result);
  } catch (error) {
    console.error("Error getting product recommendations:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  trackView,
  trackCartAdd,
  trackPurchaseEvent,
  getUserRecommendations,
  getProductRecommendations,
};
