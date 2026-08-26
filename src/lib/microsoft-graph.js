import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

import { client as msalClient } from "@/lib/msal";
import { MsalTokenCredential } from "@/lib/utils";

const PROFILE_ENDPOINT = "/me";

const PROFILE_FIELDS = [
  "id",
  "identities",
  "displayName",
  "givenName",
  "surname",
  "mail",
  "country",
  "city",
  "accountEnabled",
  "createdDateTime",
  "jobTitle",
  "lastPasswordChangeDateTime",
].join(",");

const READ_SCOPES = ["User.Read"];
const WRITE_SCOPES = ["User.ReadWrite"];

function createGraphClient(account, scopes) {
  const credential = new MsalTokenCredential(msalClient, account);

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes,
  });

  return Client.initWithMiddleware({
    authProvider,
  });
}

export async function getUserProfile(account) {
  const graphClient = createGraphClient(account, READ_SCOPES);

  return graphClient.api(PROFILE_ENDPOINT).select(PROFILE_FIELDS).get();
}

export async function updateUserProfile(account, data) {
  const graphClient = createGraphClient(account, WRITE_SCOPES);

  await graphClient.api(PROFILE_ENDPOINT).patch(data);
}
