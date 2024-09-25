import { HttpClient } from "./HTTPClient.js";
import { LinkActionContext } from "./LinkActionContext.js";
import { API } from "./API.js";
import { Config } from "./Config.js";
import { SchemaUtils } from "./utils/schemaUtils.js";
import { CommonUtils } from "./utils/CommonUtils.js";
import { JSONUtils } from "./utils/JSONUtils.js";
import { logger } from "./utils/Logger.js";
import { NetsuiteOAuth2 } from "./NetsuiteOAuth2.js";
import { Helper } from "./helper.js";
import { FileUtils } from "./utils/FileUtils.js";

export class LinkActionMain {

    constructor() {

    }

    static async testInboundLinkAction(linkActionScript, maxFile, config) {
        const linkActionContext = this.getLinkActionContext(config);
        //let { pollForDataInbound } = await import(linkActionScript);
        const pollForDataInbound = await CommonUtils.getFunctionFromFile(linkActionScript, 'pollForDataInbound');
        let cursor = Helper.readConfig('testData/cursor.json');
        if (!cursor) {
            cursor = {};
        }
        linkActionContext.linkAction = linkActionScript;
        if (pollForDataInbound) {
            //generate schema
            const maxFileContent = await FileUtils.readDataFromFile(maxFile);
            const maxFileData = JSON.parse(maxFileContent);
            let schema = SchemaUtils.generateJSONSchema(maxFileData);
            schema = JSONUtils.removeNestedRequired(schema, 'required'); //remove required
            JSONUtils.addAdditionalProperties(schema); // add additionalProperties
            global.schema = schema;
            cursor = JSON.stringify(cursor);
            const response = pollForDataInbound(linkActionContext, cursor);
            logger.debug('Link Action Response:');
            logger.debug(response);
            logger.info('Inbound data is saved to file');
            return response;
        }
    }

    static async testOutboundLinkAction(linkActionScript, file, config) {
        const linkActionContext = this.getLinkActionContext(config);
        //const { sendDataOutbound } = await import(linkActionScript);
        const sendDataOutbound = await CommonUtils.getFunctionFromFile(linkActionScript, 'sendDataOutbound');
        if (sendDataOutbound) {
            let outboundData = await FileUtils.readDataFromFile(file);
            //outboundData = JSON.parse(outboundData);
            const response = sendDataOutbound(linkActionContext, outboundData);
            if (response.responseString == 204 || response.responseString.includes('204')) {
                logger.info('Outbound is successful.');
            }
            else {
                logger.error('Outbound failed.');
            }
            return response;
        }
    }

    /**
 * 
 * @param {*} configFile 
 * @returns linkActionContext
 */
    static getLinkActionContext(configFile) {
        const config = new Config(configFile);
        const httpClient = new HttpClient();
        const oauth2 = this.getOAuth2(config, httpClient);
        const api = new API(oauth2);
        const linkActionContext = new LinkActionContext(api, config);
        return linkActionContext;
    }

    static getOAuth2(config, httpClient) {
        if (config.erp === 'Netsuite') {
            return new NetsuiteOAuth2(httpClient);
        }
        else if (config.erp === 'MsDynamics') {
            return null;
        }
        return new NetsuiteOAuth2(httpClient);
    }
}
