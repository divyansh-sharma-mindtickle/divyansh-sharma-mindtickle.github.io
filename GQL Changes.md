

src/mapper/helpers.ts
```
import axios from 'axios';

import { Folder, GoogleDriveMappedData, IntegrationAccount } from '../generated/schema';

  

export const getSharedDriveFolderParentLink = folderId =>

`https://www.googleapis.com/drive/v2/files/${folderId}/parents`;

  

export const isTokenExpired = (accountData) => !accountData?.tokenExpiryAt || new Date().getTime() >= new Date(accountData?.tokenExpiryAt).getTime();

  

export const fetchData = async (url, token) => {

const response = await axios.get(url, {

headers: { Authorization: `Bearer ${token}` },

});

const res = await response?.data;

return res;

};

  

export const hasParentFolderDetails = async ({ folderId, connectionDetails }) => {

try {

const url = getSharedDriveFolderParentLink(folderId);

const data = await fetchData(url, connectionDetails?.accessToken);

return data?.items?.length > 0;

} catch (err) {

return false;

}

};

  

export const mapParentToFolder = async (folder, connectionDetails) => {

const hasParentFolder = await hasParentFolderDetails({

folderId: folder?.id,

connectionDetails,

});

  

return { ...folder, isOrphanFolder: !hasParentFolder };

};

  

export async function getMappingForAccount(

integrationAccount: IntegrationAccount,

) {

const folderList = (integrationAccount.mappedData as GoogleDriveMappedData).folders;

const promises = folderList.map(folder => mapParentToFolder(folder, integrationAccount.connectionDetails));

(integrationAccount.mappedData as GoogleDriveMappedData).folders = await Promise.all<Folder>(promises);

return integrationAccount;

}

```


src/mapper/integration_account.ts

```
export function getConnectionDetails(

integrationType: IntegrationType,

authSetups: IntegrationAuthSetupResponse[]

): AccountConnectionDetails {

const authSetupData = authSetups[0];

if (integrationType === IntegrationType.Salesforce) {

const { authType, clientID, clientSecret, extraConfig } = authSetupData;

const { connectionStatus, accountType, authUserEmail, authUserId, instanceUrl, orgId, orgName } = extraConfig;

const isConnected = connectionStatus === CONNECTION_STATUS.CONNECTED;

return {

authType,

clientID,

clientSecret,

isConnected,

metaData: isConnected ? {

accountType: accountType === SALESFORCE_ACCOUNT_TYPE.PROD ? SalesforceAccountType.Production : SalesforceAccountType.Sandbox,

authUserEmail,

authUserId,

instanceUrl,

orgId,

orgName,

} : {}

} as SalesforceConnectionDetails;

}

  

return {} as AccountConnectionDetails;

}

  

export async function addParentDetails(

integrationAccounts: IntegrationAccount[],

authSetupMap

) {

try {

return Promise.all(

integrationAccounts.map(async (account) => {

if (account.syncDetails.syncType === IntegrationType.GoogleDrive) {

if (isTokenExpired(account)) {

const { refreshToken } = account.connectionDetails as GoogleDriveConnectionDetails;

const { clientSecret, clientID, tokenURL } = authSetupMap[account.id];

  

const config = {

clientID,

clientSecret,

tokenURL

} as GOOGLE_CLIENT_CONFIG;

  

const { accessToken } = await fetchLatestAccessTokenForGoogleAccount(refreshToken, config);

(account.connectionDetails as GoogleDriveConnectionDetails).accessToken = accessToken;

}

  

account = await getMappingForAccount(account);

}

  

return account;

})

);

} catch {

return integrationAccounts;

}

}
```


src/resolvers/query/int_account/index.ts

```
data = await addParentDetails(data, authSetupMap);
```

src/schemas/types/int_account/mapped_data.graphql

```
isOrphanFolder: Boolean
```