
export function sendDataOutbound(linkActionContext, outboundData) {
    const uri = 'https://123456.suitetalk.api.netsuite.com/services/rest/record/v1/purchaseorder/5?replace=item'
    const header = {};
    let response = linkActionContext.api.oAuth2.patch(linkActionContext, uri, header, outboundData);
    // let response =  linkActionContext.api.oAuth2.post(uri, outboundData);
    // let response =  linkActionContext.api.oAuth2.put(uri, outboundData);
    return { success: true, responseString: "204:Success", errorString: "" };
}