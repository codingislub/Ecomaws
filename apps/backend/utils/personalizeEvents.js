// utils/personalizeEvents.js
import { PutEventsCommand } from "@aws-sdk/client-personalize-events";
import { personalizeEventsClient, personalizeConfig } from "../config/personalize.js";

/**
 * Track user interaction events for AWS Personalize
 * @param {string} userId - User ID (use session ID for anonymous users)
 * @param {string} eventType - Event type: 'View', 'Purchase', 'AddToCart', 'RemoveFromCart'
 * @param {string} itemId - Product/Item ID
 * @param {object} properties - Additional event properties (price, discount, etc.)
 */
export const trackEvent = async (userId, eventType, itemId, properties = {}) => {
  try {
    if (!personalizeConfig.trackingId) {
      console.warn('Personalize tracking ID not configured. Skipping event tracking.');
      return { success: false, message: 'Tracking not configured' };
    }

    const event = {
      eventType,
      sentAt: new Date(),
      itemId: String(itemId),
      properties: JSON.stringify(properties),
    };

    const command = new PutEventsCommand({
      trackingId: personalizeConfig.trackingId,
      userId: String(userId),
      sessionId: `session-${userId}-${Date.now()}`,
      eventList: [event],
    });

    await personalizeEventsClient.send(command);
    console.log(`Event tracked: ${eventType} for user ${userId}, item ${itemId}`);
    
    return { success: true, message: 'Event tracked successfully' };
  } catch (error) {
    console.error('Error tracking event to Personalize:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Track product view event
 */
export const trackProductView = async (userId, productId, productData = {}) => {
  return trackEvent(userId, 'View', productId, {
    name: productData.name,
    category: productData.category,
    price: productData.price,
  });
};

/**
 * Track add to cart event
 */
export const trackAddToCart = async (userId, productId, quantity = 1, productData = {}) => {
  return trackEvent(userId, 'AddToCart', productId, {
    quantity,
    name: productData.name,
    price: productData.price,
  });
};

/**
 * Track purchase event
 */
export const trackPurchase = async (userId, items = []) => {
  try {
    const results = await Promise.all(
      items.map(item =>
        trackEvent(userId, 'Purchase', item.productId || item.itemId, {
          quantity: item.quantity,
          price: item.price,
        })
      )
    );
    return { success: true, tracked: results.length };
  } catch (error) {
    console.error('Error tracking purchase:', error);
    return { success: false, message: error.message };
  }
};

export default {
  trackEvent,
  trackProductView,
  trackAddToCart,
  trackPurchase,
};
