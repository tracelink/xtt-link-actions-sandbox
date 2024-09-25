import { FileUtils } from "./utils/FileUtils.js";
import path from "path";
import { SchemaUtils } from "./utils/schemaUtils.js";
import { CommonUtils } from "./utils/CommonUtils.js";
import { logger } from "./utils/Logger.js";

export class API {

    constructor(oAuth2) {
        this.oAuth2 = oAuth2;
    }

    sendDataInbound(linkActionContext, transactionType, transaction, cursorObject) {
        cursorObject = JSON.parse(cursorObject);
        transaction = JSON.parse(transaction);
        if (!transaction) {
            logger.info('Skipping schema validation as transction is empty');
        }
        else {
            const scriptName = linkActionContext.linkAction;
            const inputFolder = path.dirname(scriptName);
            const timeStamp = Date.now();
            FileUtils.writeToOutput(inputFolder, `${transactionType}_${transaction.id}.json`, transaction);
            FileUtils.writeToOutput(inputFolder, `schema_${transactionType}_Inbound.json`, global.schema);
            FileUtils.writeToOutput(inputFolder, `cursor_output.json`, cursorObject);

            // validate response against generated schema
            logger.info('Starting Schema Validation...');
            logger.debug('Transaction :');
            logger.debug(CommonUtils.beautify(transaction));
            logger.debug('Schema :');
            logger.debug(CommonUtils.beautify(global.schema));
            const isValid = SchemaUtils.validateJSONForSchema(transaction, global.schema);

            if (isValid) {
                logger.info('Schema Validation is Successful');
            }
            else {
                logger.error('Schema Validation Failed');
            }
        }

    }

    log(linkActionContext, logMessage) {
        logger.info("From LinkAction ===> " + logMessage);
    }
}
