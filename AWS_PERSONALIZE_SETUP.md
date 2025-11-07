# AWS Personalize Integration Guide

This guide explains how to set up and use AWS Personalize for personalized product recommendations in your e-commerce application.

## What's Been Implemented

### Backend Components

1. **Configuration** (`apps/backend/config/personalize.js`)
   - AWS Personalize Events Client (for tracking user interactions)
   - AWS Personalize Runtime Client (for getting recommendations)
   - Configuration management for tracking ID and campaign ARN

2. **Event Tracking** (`apps/backend/utils/personalizeEvents.js`)
   - `trackProductView()` - Tracks when users view products
   - `trackAddToCart()` - Tracks add-to-cart events
   - `trackPurchase()` - Tracks completed purchases

3. **Recommendations** (`apps/backend/utils/personalizeRecommendations.js`)
   - `getRecommendations()` - Get personalized recommendations for users
   - `getRelatedProducts()` - Get related products for a specific item
   - `getFallbackRecommendations()` - Fallback to bestsellers if Personalize isn't configured

4. **API Endpoints** (`apps/backend/routes/personalizeRoute.js`)
   - `POST /api/personalize/track/view` - Track product views
   - `POST /api/personalize/track/cart` - Track cart additions
   - `POST /api/personalize/track/purchase` - Track purchases
   - `GET /api/personalize/recommendations` - Get user recommendations
   - `GET /api/personalize/recommendations/:productId` - Get related products

### Frontend Components

1. **Event Tracking** (Integrated in `ShopContext.jsx`)
   - Automatic tracking of product views
   - Automatic tracking of add-to-cart actions
   - User ID generation (JWT for logged-in users, session ID for guests)

2. **UI Components**
   - `PersonalizedRecommendations.jsx` - Displays "Recommended For You" section
   - Enhanced `RelatedProducts.jsx` - Uses Personalize for related products with fallback

3. **Integration Points**
   - Home page: Shows personalized recommendations
   - Product page: Tracks views and shows related products via Personalize
   - Order completion: Tracks purchases for all payment methods (COD, Stripe, Razorpay)

## AWS Personalize Setup Steps

### Step 1: Create Dataset Group

1. Go to AWS Personalize Console
2. Create a new Dataset Group (e.g., "ecommerce-recommendations")
3. Choose "E-commerce" domain

### Step 2: Create Datasets

You'll need three datasets:

#### Interactions Dataset
Schema:
\`\`\`json
{
  "type": "record",
  "name": "Interactions",
  "namespace": "com.amazonaws.personalize.schema",
  "fields": [
    { "name": "USER_ID", "type": "string" },
    { "name": "ITEM_ID", "type": "string" },
    { "name": "EVENT_TYPE", "type": "string" },
    { "name": "TIMESTAMP", "type": "long" }
  ],
  "version": "1.0"
}
\`\`\`

Event types: View, AddToCart, Purchase

#### Items Dataset (Optional but recommended)
Schema:
\`\`\`json
{
  "type": "record",
  "name": "Items",
  "namespace": "com.amazonaws.personalize.schema",
  "fields": [
    { "name": "ITEM_ID", "type": "string" },
    { "name": "CATEGORY", "type": "string", "categorical": true },
    { "name": "PRICE", "type": "float" }
  ],
  "version": "1.0"
}
\`\`\`

#### Users Dataset (Optional)
Schema:
\`\`\`json
{
  "type": "record",
  "name": "Users",
  "namespace": "com.amazonaws.personalize.schema",
  "fields": [
    { "name": "USER_ID", "type": "string" }
  ],
  "version": "1.0"
}
\`\`\`

### Step 3: Import Historical Data (Optional)

If you have historical data, prepare CSV files:

**interactions.csv**
\`\`\`
USER_ID,ITEM_ID,EVENT_TYPE,TIMESTAMP
user123,prod456,View,1699123456
user123,prod456,AddToCart,1699123789
user123,prod456,Purchase,1699124000
\`\`\`

Upload to S3 and import into Personalize.

### Step 4: Create Event Tracker

1. In your Dataset Group, create an Event Tracker
2. Name it (e.g., "ecommerce-events")
3. Copy the **Tracking ID** - you'll need this for your `.env` file

### Step 5: Create Solution

1. Choose a recipe based on your needs:
   - **aws-ecommerce-popular-items-by-purchases** - Popular items
   - **aws-ecommerce-personalized-items** - Personalized recommendations
   - **aws-ecommerce-related-items** - Related/similar items
   - **aws-user-personalization** - General personalization

2. Create solution version (this trains the model)
3. Wait for training to complete (can take 1-2 hours)

### Step 6: Create Campaign

1. Create a campaign from your solution version
2. Name it (e.g., "ecommerce-personalized-recs")
3. Set minimum provisioned TPS (start with 1)
4. Copy the **Campaign ARN**

## Environment Variables

Add these to your backend `.env` file:

\`\`\`env
# AWS Credentials (already configured for S3)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# AWS Personalize Configuration
PERSONALIZE_TRACKING_ID=your-tracking-id-from-step-4
PERSONALIZE_CAMPAIGN_ARN=arn:aws:personalize:region:account:campaign/your-campaign-name
PERSONALIZE_DATASET_GROUP_ARN=arn:aws:personalize:region:account:dataset-group/your-dataset-group
\`\`\`

## How It Works

### Event Tracking Flow

1. **Product View**
   - User visits product page
   - Frontend calls `trackProductView()` in ShopContext
   - Event sent to backend `/api/personalize/track/view`
   - Backend sends event to AWS Personalize Event Tracker

2. **Add to Cart**
   - User adds item to cart
   - Automatically tracked in `addToCart()` function
   - Event sent to Personalize with product details

3. **Purchase**
   - User completes order (COD/Stripe/Razorpay)
   - Backend tracks all purchased items
   - Events sent to Personalize in order controllers

### Recommendation Flow

1. **Homepage Recommendations**
   - `PersonalizedRecommendations` component loads
   - Fetches recommendations from `/api/personalize/recommendations`
   - Uses JWT userId for logged-in users, session ID for guests
   - Displays top 10 personalized products

2. **Related Products**
   - Product page loads
   - `RelatedProducts` component fetches from `/api/personalize/recommendations/:productId`
   - Falls back to category-based recommendations if Personalize fails
   - Shows 6 related items

### User Identification

- **Logged-in users**: userId extracted from JWT token
- **Guest users**: Unique session ID generated and stored in localStorage
- Session IDs persist across visits for continuity

## Testing

### 1. Test Event Tracking

\`\`\`bash
# Test product view tracking
curl -X POST http://localhost:4000/api/personalize/track/view \\
  -H "Content-Type: application/json" \\
  -d '{
    "userId": "test-user-123",
    "productId": "your-product-id",
    "productData": {
      "name": "Test Product",
      "category": "Men",
      "price": 100
    }
  }'
\`\`\`

### 2. Test Recommendations

\`\`\`bash
# Get user recommendations
curl "http://localhost:4000/api/personalize/recommendations?userId=test-user-123&numResults=10"

# Get related products
curl "http://localhost:4000/api/personalize/recommendations/your-product-id?numResults=6"
\`\`\`

### 3. Check AWS CloudWatch

- Go to CloudWatch Logs
- Look for Personalize Event Tracker logs
- Verify events are being received

## Fallback Behavior

The system gracefully handles Personalize being unavailable:

1. **No Campaign ARN**: Returns bestsellers or recent products
2. **API Errors**: Catches errors and uses fallback logic
3. **Empty Results**: Falls back to category-based recommendations
4. **Network Issues**: Logs errors without breaking user experience

## Cost Optimization

1. **Start Small**: Use minimum TPS (1) for campaign
2. **Monitor Usage**: Check CloudWatch metrics
3. **Scale Gradually**: Increase TPS as traffic grows
4. **Event Batching**: Events are sent individually but you could batch them
5. **Cache Results**: Consider caching recommendations for anonymous users

## Monitoring

### Key Metrics to Track

1. **Event Ingestion Rate**: CloudWatch → Personalize → PutEvents
2. **Recommendation Latency**: API response times
3. **Click-Through Rate**: Track recommended product clicks
4. **Conversion Rate**: Purchases from recommendations
5. **Fallback Usage**: How often fallbacks are used

### CloudWatch Alarms

Set up alarms for:
- High error rates on event tracking
- Campaign throttling (TPS exceeded)
- Recommendation API failures

## Troubleshooting

### Events Not Appearing in Personalize

1. Check PERSONALIZE_TRACKING_ID is correct
2. Verify AWS credentials have Personalize permissions
3. Check CloudWatch logs for errors
4. Ensure timestamp is in Unix epoch format

### No Recommendations Returned

1. Wait for solution training to complete
2. Ensure campaign is ACTIVE status
3. Check minimum interaction threshold (Personalize needs data)
4. Verify Campaign ARN is correct
5. Test with fallback to confirm system works

### TypeScript/Import Errors

The backend uses ES modules. If you encounter issues:
- Verify `"type": "module"` in package.json
- Use `.js` extensions in imports
- Check Node version (14+ required)

## Next Steps

1. **Add More Event Types**: Track searches, wishlists, reviews
2. **A/B Testing**: Compare Personalize vs. non-personalized experiences
3. **Batch Recommendations**: Pre-compute for popular users
4. **Real-time Updates**: Use WebSockets to update recommendations
5. **Email Campaigns**: Use recommendations in marketing emails
6. **Filters**: Add category/price filters to recommendations

## API Reference

### POST /api/personalize/track/view
Track product view event
\`\`\`json
{
  "userId": "string",
  "productId": "string",
  "productData": {
    "name": "string",
    "category": "string",
    "price": number
  }
}
\`\`\`

### POST /api/personalize/track/cart
Track add-to-cart event
\`\`\`json
{
  "userId": "string",
  "productId": "string",
  "quantity": number,
  "productData": {
    "name": "string",
    "price": number
  }
}
\`\`\`

### POST /api/personalize/track/purchase
Track purchase event
\`\`\`json
{
  "userId": "string",
  "items": [
    {
      "productId": "string",
      "quantity": number,
      "price": number
    }
  ]
}
\`\`\`

### GET /api/personalize/recommendations
Get personalized recommendations
Query params:
- `userId` (optional): User ID for personalization
- `numResults` (default: 10): Number of recommendations

### GET /api/personalize/recommendations/:productId
Get related products
Query params:
- `numResults` (default: 6): Number of related products

## Resources

- [AWS Personalize Documentation](https://docs.aws.amazon.com/personalize/)
- [E-commerce Use Case Guide](https://docs.aws.amazon.com/personalize/latest/dg/domain-dataset-groups.html)
- [Best Practices](https://docs.aws.amazon.com/personalize/latest/dg/best-practices.html)
- [Recipe Selection Guide](https://docs.aws.amazon.com/personalize/latest/dg/working-with-predefined-recipes.html)
