// utils/personalizeRecommendations.js
import { GetRecommendationsCommand } from "@aws-sdk/client-personalize-runtime";
import { personalizeRuntimeClient, personalizeConfig } from "../config/personalize.js";
import productModel from "../models/productModel.js";

/**
 * Get personalized recommendations for a user
 * @param {string} userId - User ID
 * @param {number} numResults - Number of recommendations to fetch (default: 10)
 * @param {string} itemId - Optional: Item ID for related items recommendations
 */
export const getRecommendations = async (userId, numResults = 10, itemId = null) => {
  try {
    if (!personalizeConfig.campaignArn) {
      console.warn('Personalize campaign ARN not configured. Returning empty recommendations.');
      return { success: false, recommendations: [], message: 'Campaign not configured' };
    }

    const params = {
      campaignArn: personalizeConfig.campaignArn,
      userId: String(userId),
      numResults,
    };

    // If itemId provided, use it for "related items" recommendations
    if (itemId) {
      params.itemId = String(itemId);
    }

    const command = new GetRecommendationsCommand(params);
    const response = await personalizeRuntimeClient.send(command);

    const itemIds = response.itemList?.map(item => item.itemId) || [];
    
    // Fetch product details from MongoDB
    const products = await productModel.find({ _id: { $in: itemIds } });
    
    // Maintain the order from Personalize
    const orderedProducts = itemIds
      .map(id => products.find(p => p._id.toString() === id))
      .filter(Boolean);

    return {
      success: true,
      recommendations: orderedProducts,
      recommendationId: response.recommendationId,
    };
  } catch (error) {
    console.error('Error fetching recommendations from Personalize:', error);
    return { success: false, recommendations: [], message: error.message };
  }
};

/**
 * Get recommendations for anonymous users (fallback to popular items)
 */
export const getFallbackRecommendations = async (numResults = 10) => {
  try {
    // Return bestsellers or most recent products as fallback
    const products = await productModel
      .find({ bestseller: true })
      .sort({ date: -1 })
      .limit(numResults);

    return {
      success: true,
      recommendations: products,
      isFallback: true,
    };
  } catch (error) {
    console.error('Error fetching fallback recommendations:', error);
    return { success: false, recommendations: [], message: error.message };
  }
};

/**
 * Get related products based on current product
 */
export const getRelatedProducts = async (productId, numResults = 6) => {
  try {
    const product = await productModel.findById(productId);
    if (!product) {
      return { success: false, recommendations: [], message: 'Product not found' };
    }

    // Try Personalize first (if configured for item-to-item recommendations)
    if (personalizeConfig.campaignArn) {
      const personalizeResult = await getRecommendations(null, numResults, productId);
      if (personalizeResult.success && personalizeResult.recommendations.length > 0) {
        return personalizeResult;
      }
    }

    // Fallback: Same category products
    const relatedProducts = await productModel
      .find({
        _id: { $ne: productId },
        $or: [
          { category: product.category },
          { subCategory: product.subCategory },
        ],
      })
      .limit(numResults);

    return {
      success: true,
      recommendations: relatedProducts,
      isFallback: true,
    };
  } catch (error) {
    console.error('Error fetching related products:', error);
    return { success: false, recommendations: [], message: error.message };
  }
};

export default {
  getRecommendations,
  getFallbackRecommendations,
  getRelatedProducts,
};
