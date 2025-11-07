// routes/personalizeRoute.js
import express from "express";
import {
  trackView,
  trackCartAdd,
  trackPurchaseEvent,
  getUserRecommendations,
  getProductRecommendations,
} from "../controllers/personalizeController.js";

const personalizeRouter = express.Router();

// Event tracking endpoints
personalizeRouter.post("/track/view", trackView);
personalizeRouter.post("/track/cart", trackCartAdd);
personalizeRouter.post("/track/purchase", trackPurchaseEvent);

// Recommendation endpoints
personalizeRouter.get("/recommendations", getUserRecommendations);
personalizeRouter.get("/recommendations/:productId", getProductRecommendations);

export default personalizeRouter;
