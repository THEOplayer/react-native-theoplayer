import {ComscoreConfiguration, ComscoreUserConsent} from "@theoplayer/react-native-analytics-comscore";
import {ConvivaConfiguration} from "@theoplayer/react-native-analytics-conviva";
import {Platform} from "react-native";

// -------------------
// THEOplayer license
// -------------------
// Get your THEOplayer license from https://portal.theoplayer.com/
// Without a license, only demo sources hosted on '*.theoplayer.com' domains can be played.
export const THEO_LICENSE = undefined;


// --------------------------
// Sample Analytics: Conviva
// --------------------------
export const CONVIVA_CUSTOMER_KEY = '<YOUR_CUSTOMER_KEY>'; // Conviva publisher id. Can be a test or production key.
export const CONVIVA_SERVICE_URL = '<YOUR_SERVICE_URL>'; // Conviva service url
export const CONVIVA_CONFIG: ConvivaConfiguration = {
  customerKey: CONVIVA_CUSTOMER_KEY,
  debug: true,
  gatewayUrl: CONVIVA_SERVICE_URL
};


// ---------------------------
// Sample Analytics: Comscore
// ---------------------------
export const COMSCORE_PUBLISHER_ID = '<YOUR_PUBLISHER_ID>'; // Comscore publisher id. Can be a test or production key.
export const COMSCORE_CONFIG: ComscoreConfiguration = {
  publisherId: COMSCORE_PUBLISHER_ID,
  applicationName: "My App",
  userConsent: ComscoreUserConsent.granted,
  debug: true,
};


// --------------------------
// Sample Analytics: Nielsen
// --------------------------
export const NIELSEN_OPTIONS = {
  nol_sdkDebug: 'debug'
};
export let NIELSEN_APP_ID = ""
if (Platform.OS === "web") {
  NIELSEN_APP_ID = '<YOUR_NIELSEN_APP_ID>'; // Nielsen App ID for web
} else if (Platform.OS === "android") {
  NIELSEN_APP_ID = '<YOUR_NIELSEN_APP_ID>'; // Nielsen App ID for Android
} else if (Platform.OS === "ios") {
  NIELSEN_APP_ID = '<YOUR_NIELSEN_APP_ID>'; // Nielsen App ID for iOS
}


// ------------------------
// Sample Analytics: Adobe
// ------------------------
export const ADOBE_URI = '<YOUR_ADOBE_URI>' // Media Collection API end point
export const ADOBE_ECID = '<YOUR_ADOBE_ECID>' // Visitor Experience Cloud Org ID
export const ADOBE_SID = '<YOUR_ADOBE_SID>' // Report Suite ID
export const ADOBE_TRACKING_URL = '<YOUR_ADOBE_TRCKING_URL>' // Tracking Server URL

// ----------------------
// Sample Analytics: Mux
// ----------------------
export const MUX_ENV_KEY = '<YOUR_ENV_KEY>'; // Mux env key.
