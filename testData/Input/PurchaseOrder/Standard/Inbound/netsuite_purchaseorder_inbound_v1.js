
export function pollForDataInbound(linkActionContext, cursor) {
    try {
        const uri = 'https://2799237.suitetalk.api.netsuite.com/services/rest/record/v1/purchaseorder/5'
        const header = {};
        let response = linkActionContext.api.oAuth2.get(linkActionContext, uri, header);

        if (cursor) {
            cursor.lastSuccessTime = Date.now();
        }
        else {
            cursor = {
                lastSuccessTime: Date.now()
            }
        }

        // call to B2B
        let purchaseorder = removeNestedRequired(response.body, 'links');
        linkActionContext.api.sendDataInbound('PurchaseOrder', purchaseorder, cursor, '');
        return { success: true, responseString: "Transaction is Successful at " + JSON.stringify(cursor), errorString: "" };
    }
    catch (err) {
        console.log(err);
        return { success: false, responseString: "Failed", errorString: err };
    }
}

function removeNestedRequired(jsonObj, tagName) {
    // Check if the input is an object
    if (typeof jsonObj !== 'object' || jsonObj === null) {
        return jsonObj;
    }

    // If the object has a tagName property, remove it
    if (jsonObj.hasOwnProperty(tagName)) {
        delete jsonObj[tagName];
    }

    // Recursively remove tagName property from nested objects and arrays
    for (let key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
            jsonObj[key] = removeNestedRequired(jsonObj[key], tagName);
        }
    }
    return jsonObj;
}