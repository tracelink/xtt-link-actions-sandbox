import { JSONPath } from 'jsonpath-plus';

export function pollForDataInbound(linkActionContext, cursor) {
    let purchaseOrders = queryPurchaseOrders(linkActionContext);
    console.log('Query purchaseOrders is successful');
    console.log('Feching each PO...');
    purchaseOrders.items.forEach(po => {
        // fetch each purchase order
        let purchaseOrder = fetchPurchaseOrder(linkActionContext, po);

        // send data to B2B
        //linkActionContext.api.sendDataInbound('PurchaseOrder',purchaseOrder);
        linkActionContext.api.sendDataInbound('PurchaseOrder', purchaseOrder, cursor, '');
    });
    return { success: true, responseString: "Successful", errorString: "" };
}


// Function to fetch purchase orders
function queryPurchaseOrders(linkActionContext) {
    try {
        // Make an HTTP GET request to retrieve purchase orders
        const url = linkActionContext.config.url;
        const header = {};
        const response = linkActionContext.api.oAuth2.get(linkActionContext, `${url}/purchaseOrder?q=tranId is 5`, header);
        // Extract purchase orders from the response
        const purchaseOrders = response.body;

        // Log the results
        console.log('Purchase Orders:');
        return purchaseOrders;
    } catch (error) {
        // Handle errors
        console.error('Error fetching purchase orders:', error);
    }
}

// Function to fetch purchase order
function fetchPurchaseOrder(linkActionContext, data) {
    try {
        // Make an HTTP GET request to retrieve purchase orders
        const uri = getURI(data);
        const header = {};
        const response = linkActionContext.api.oAuth2.get(linkActionContext, `${uri}`, header);
        console.log('fetch each PurchaseOrder is successful');

        // Extract purchase orders from the response
        let purchaseOrder = response.body;
        console.log('fetching subresources...');
        purchaseOrder = fetchSubResources(linkActionContext, purchaseOrder);
        console.log('fetch subresources is successful');
        // Log the results
        //console.log('Purchase Orders:');
        //console.log(purchaseOrders);
        return purchaseOrder;
    } catch (error) {
        // Handle errors
        console.error('Error fetching purchase orders:', error);
    }
}

function fetchSubResources(linkActionContext, purchaseOrder) {
    try {
        let expandObjects = [
            {
                "name": "currency",
                "jsonPath": "$.currency",
                "cardinality": "one"
            },
            {
                "name": "item",
                "jsonPath": "$.item",
                "cardinality": "one"
            },
            {
                "name": "item",
                "jsonPath": "$.item.items",
                "cardinality": "many"
            },
            {
                "name": "entity",
                "jsonPath": "$.entity",
                "cardinality": "one"
            },
            {
                "name": "entity",
                "jsonPath": "$.entity.addressBook",
                "cardinality": "one"
            },
            {
                "name": "entity",
                "jsonPath": "$.entity.addressBook.items",
                "cardinality": "many"
            },
            {
                "name": "entity",
                "jsonPath": "$.entity.addressBook.items.addressBookAddress",
                "cardinality": "many"
            },
            {
                "name": "entity",
                "jsonPath": "$.entity",
                "cardinality": "one"
            },
            {
                "name": "entity",
                "jsonPath": "$.entity.addressBook",
                "cardinality": "one"
            },
            {
                "name": "entity",
                "jsonPath": "$.entity.addressBook.items",
                "cardinality": "many"
            },
            {
                "name": "entity",
                "jsonPath": "$.entity.addressBook.items[*].addressBookAddress",
                "cardinality": "one"
            }

        ]
        // fetch subResources by expanding expandObjects recursively and update json
        // replace obj with expanded object
        const updater = (cb) => (value, _, { parent, parentProperty }) => {
            return parent[parentProperty] = cb(value);
        }

        expandObjects.sort(sortByProperty('jsonPath'));

        for (let obj of expandObjects) {
            let combinedResponse = {};
            if (obj.cardinality == 'one') {
                const subResourceLinkObj = JSONPath({ path: obj.jsonPath, json: purchaseOrder });
                const uri = subResourceLinkObj[0].links[0].href;
                const header = {};
                const response = linkActionContext.api.oAuth2.get(linkActionContext, uri, header);
                combinedResponse = response.body;


            }
            else if (obj.cardinality == 'many') {
                combinedResponse = [];
                const subResourceLinkObj = JSONPath({ path: obj.jsonPath, json: purchaseOrder });
                for (let key in subResourceLinkObj[0]) {
                    const uri = subResourceLinkObj[0][key].links[0].href;
                    const header = {};
                    const response = linkActionContext.api.oAuth2.get(linkActionContext, uri, header);
                    const subResponse = response.body;
                    combinedResponse.push(subResponse);
                }
            }
            JSONPath({
                json: purchaseOrder,
                path: obj.jsonPath,
                resultType: 'all',
                callback: updater(value => combinedResponse),
            });
        }

        return purchaseOrder;
    } catch (error) {
        // Handle errors
        console.error('Error fetching subResource:', error);
    }
}

function getURI(data) {
    return data.links[0].href;
}

function sortByProperty(property) {
    return function (a, b) {
        if (a[property] < b[property]) {
            return -1;
        } else if (a[property] > b[property]) {
            return 1;
        } else {
            return 0;
        }
    };
}

