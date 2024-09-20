import { KJUR } from "jsrsasign";
import querystring from "querystring";
import { OAuth2 } from "./OAuth2.js";
import { throws } from "assert";

export class NetsuiteOAuth2 extends OAuth2 {
  constructor(httpClient) {
    super(httpClient);
  }

  generateToken() {
    try {
      if (this.bearerToken) {
        return this.bearerToken;
      }
      const secrets = this.readSecrets();
      const CONSUMER_KEY = secrets.API_KEYS.CONSUMER_KEY;
      //const CLIENT_SECRET = secrets.API_KEYS.CLIENT_SECRET;
      const TOKEN_URL = secrets.API_KEYS.TOKEN_URL;
      const CERTIFICATE_PRIVATE_KEY = secrets.API_KEYS.CERTIFICATE_PRIVATE_KEY;
      let SCOPE = secrets.API_KEYS.SCOPE;
      SCOPE = SCOPE.split(',');

      // Create JWT header
      const jwtHeader = {
        alg: secrets.API_KEYS.ALGORITHM, // Using PS256, which is one of the algorithms NetSuite supports for client credentials
        typ: 'JWT',
        kid: secrets.API_KEYS.CERTIFICATE_ID // Certificate Id on the client credentials mapping
      };

      const stringifiedJwtHeader = JSON.stringify(jwtHeader);

      // Create JWT payload
      const jwtPayload = {
        iss: CONSUMER_KEY, // consumer key of integration record
        scope: SCOPE,
        // scope: ['restlets','rest_webservices'], // scopes specified on integration record
        iat: (new Date() / 1000),               // timestamp in seconds
        exp: (new Date() / 1000) + 3600,        // timestamp in seconds, 1 hour later, which is max for expiration
        aud: TOKEN_URL
      };

      var stringifiedJwtPayload = JSON.stringify(jwtPayload);

      // The secret is the private key of the certificate loaded into the client credentials mapping in NetSuite
      const secret = CERTIFICATE_PRIVATE_KEY;
      //const encodedSecret = cryptojs.enc.Base64.stringify(cryptojs.enc.Utf8.parse(secret)); // we need to base64 encode the key

      // Sign the JWT with the PS256 algorithm (algorithm must match what is specified in JWT header).
      // The JWT is signed using the jsrsasign lib (KJUR)
      const signedJWT = KJUR.jws.JWS.sign(secrets.API_KEYS.ALGORITHM, stringifiedJwtHeader, stringifiedJwtPayload, secret);

      const formData = {
        grant_type: 'client_credentials',
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        client_assertion: signedJWT
      };
      const requestBody = querystring.stringify(formData);
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      const response = this.httpClient.post(TOKEN_URL,
        headers,
        requestBody
      );

      //console.log('Response:', response.getBody('utf8'));

      const token = JSON.parse(response.body).access_token;
      this.setBearerToken(token);
      return token;
    } catch (error) {
      console.error('Error in generateToken. Check secrets.json file. Error : ', error);
      const err = "Error in generateToken. Check secrets.json file. Error :  Error: "+ error;
      throw err;
    }
  }
}
