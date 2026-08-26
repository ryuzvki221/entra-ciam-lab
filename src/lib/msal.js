import { ConfidentialClientApplication } from "@azure/msal-node";

const config = {
  auth: {
    clientId: process.env.AUTH_ENTRA_CLIENT_ID,
    clientSecret: process.env.AUTH_ENTRA_CLIENT_SECRET,
    authority: process.env.AUTH_ENTRA_AUTHORITY,
    clientCapabilities: ["CP1"],
  },

  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        if (containsPii) {
          return;
        }
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: 3,
    },
  },
};

export const client = new ConfidentialClientApplication(config);
