// featureFlags.ts

// This file controls the activation of new modular add-on features.
// Set a flag to 'true' to enable the feature, 'false' to disable it.

export const FEATURE_FLAGS = {
  // Advocate Dashboard Add-ons
  aiDraftGenerator: true,
  smartCalendar: true,
  
  // Judge Dashboard Add-ons
  aiBiasMonitor: true,
  
  // Global Add-ons
  realTimeNotifications: true,

  // Future Add-ons (placeholders)
  voiceAssistant: false,
  legalFeeEstimator: false,
};
