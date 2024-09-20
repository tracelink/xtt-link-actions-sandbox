import syncRequest from "sync-request"
import { CommonUtils } from "./utils/CommonUtils.js";
import { logger } from "./utils/Logger.js";

export class HttpClient {

    constructor() {

    }

    get(uri, headers) {
        try {
            logger.debug('Request:');
            logger.debug(CommonUtils.beautify(this.formatRequest(uri, headers, '')));
            const response = syncRequest('GET', uri, { 'headers': headers });
            logger.debug('Response: ');
            logger.debug(CommonUtils.beautify(this.formatResponse(response)));
            return this.formatStringifiedResponse(response);
        } catch (error) {
            logger.error(error);
            console.log(error);
        }
    }

    post(uri, headers, payload) {
        try {
            logger.debug('Request:');
            logger.debug(CommonUtils.beautify(this.formatRequest(uri, headers, payload)));
            const options = this.getOptions(headers, payload);
            const response = syncRequest('POST', uri, options);
            logger.debug('Response: ');
            logger.debug(CommonUtils.beautify(this.formatResponse(response)));
            return this.formatStringifiedResponse(response);
        } catch (error) {
            console.error(error.message);
        }
    }

    put(uri, headers, payload) {
        try {
            logger.debug('Request:');
            logger.debug(CommonUtils.beautify(this.formatRequest(uri, headers, payload)));
            const options = this.getOptions(headers, payload);
            const response = syncRequest('PUT', uri, options);
            logger.debug('Response: ');
            logger.debug(CommonUtils.beautify(this.formatResponse(response)));
            return this.formatStringifiedResponse(response);
        } catch (error) {
            console.error('HTTPClient put : ' + error.message);
        }
    }

    patch(uri, headers, payload) {
        try {
            const options = this.getOptions(headers, payload);
            logger.debug('Request:');
            logger.debug(CommonUtils.beautify(this.formatRequest(uri, headers, payload)));
            const response = syncRequest('PATCH', uri, options);
            logger.debug('Response: ' + CommonUtils.beautify(response));
            return this.formatStringifiedResponse(response);
        } catch (error) {
            console.error('Error in HTTPClient patch : ' + error.message);
        }
    }

    formatResponse(response) {
        const rawBody = response.getBody('utf8');
        const body = rawBody === '' ? rawBody : JSON.parse(rawBody);
        return {
            url: response.url,
            statusCode: response.statusCode,
            headers: response.headers,
            body: body
        };
    }

    formatStringifiedResponse(response) {
        const rawBody = response.getBody('utf8');
        const body = rawBody === '' ? rawBody : JSON.parse(rawBody);
        return {
            url: response.url,
            statusCode: response.statusCode,
            headers: response.headers,
            body: JSON.stringify(body)
        };
    }

    formatRequest(url, header, payload) {
        return {
            url: url,
            headers: header,
            body: payload
        };
    }

    getOptions(headers, payload) {
        const options = { headers: headers };
        if (headers['Content-Type'] === 'application/json') {
            options.json = JSON.parse(payload);
        }
        else {
            options.body = payload;
        }
        return options;
    }
}
