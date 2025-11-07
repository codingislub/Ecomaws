// config/personalize.js
import { PersonalizeEventsClient } from "@aws-sdk/client-personalize-events";
import { PersonalizeRuntimeClient } from "@aws-sdk/client-personalize-runtime";

// Client for sending events (user interactions)
export const personalizeEventsClient = new PersonalizeEventsClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Client for getting recommendations
export const personalizeRuntimeClient = new PersonalizeRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const personalizeConfig = {
  trackingId: process.env.PERSONALIZE_TRACKING_ID,
  campaignArn: process.env.PERSONALIZE_CAMPAIGN_ARN,
  datasetGroupArn: process.env.PERSONALIZE_DATASET_GROUP_ARN,
};
