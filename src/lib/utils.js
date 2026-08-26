export class MsalTokenCredential {
  constructor(msalClient, account) {
    this.msalClient = msalClient;
    this.account = account;
  }

  async getToken(scopes) {
    const result = await this.msalClient.acquireTokenSilent({
      account: this.account,
      scopes,
    });

    if (!result?.accessToken) {
      throw new Error(
        "Impossible d'obtenir le token Microsoft Graph"
      );
    }

    return {
      token: result.accessToken,
      expiresOnTimestamp:
        result.expiresOn?.getTime() ?? 0,
    };
  }
}