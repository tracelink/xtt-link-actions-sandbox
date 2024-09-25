import { Helper } from "./helper.js";

export class OAuth2 {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  get(linkActionContext, url, header) {
    this.generateToken(linkActionContext);
    this.setHeader(header);
    return this.httpClient.get(url, header);
  }

  post(linkActionContext, url, header, body) {
    this.generateToken(linkActionContext);
    this.setHeader(header);
    return this.httpClient.post(url, header, body);
  }

  put(linkActionContext, url, header, body) {
    this.generateToken(linkActionContext);
    this.setHeader(header);
    return this.httpClient.put(url, header, body);
  }

  patch(linkActionContext, url, header, body) {
    this.generateToken(linkActionContext);
    this.setHeader(header);
    return this.httpClient.patch(url, header, body);
  }

  setHeader(header) {
    header['Authorization'] = `Bearer ${this.bearerToken}`;
    return header;
  }

  setBearerToken(bearerToken) {
    this.bearerToken = bearerToken;
  }

  readSecrets() {
    return Helper.readConfig('testData/secrets.json');
  }

  generateToken() {
    throw new Error('generateToken is not implemented');
  }
}
