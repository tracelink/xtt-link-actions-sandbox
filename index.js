import { HttpClient } from "./src/HTTPClient.js";
import { LinkActionContext } from "./src/LinkActionContext.js";
import { API } from "./src/API.js";
import { Config } from "./src/Config.js";
import { SchemaUtils } from "./src/utils/schemaUtils.js";
import { CommonUtils } from "./src/utils/CommonUtils.js";
import { JSONUtils } from "./src/utils/JSONUtils.js";
import { logger } from "./src/utils/Logger.js";
import { NetsuiteOAuth2 } from "./src/NetsuiteOAuth2.js";
import { Helper } from "./src/helper.js";
import { LinkActionMain } from "./src/LinkActionMain.js";



async function main() {
    CommonUtils.generateBanner('Link Action Sandbox');
    const argv = CommonUtils.readArgs();
    const { la, file, config } = argv;
    await LinkActionMain.testInboundLinkAction(la, file, config);
    await LinkActionMain.testOutboundLinkAction(la, file, config);
}

(async () => {
    try {
        main();
    }
    catch (err) {
        console.log(err);
    }

})();