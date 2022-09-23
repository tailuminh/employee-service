// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'uhm1rcofli'
const region = 'us-west-2'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-r-nf5p6j.us.auth0.com',            // Auth0 domain
  clientId: 'H5o465r9TsLdlgAqJHiM6w8QmpVp9P9W',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
