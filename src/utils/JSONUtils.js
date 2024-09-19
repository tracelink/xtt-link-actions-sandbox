
export class JSONUtils {
    constructor() {

    }

    static removeNestedRequired(jsonObj, tagName) {
        // Check if the input is an object
        if (typeof jsonObj !== 'object' || jsonObj === null) {
            return jsonObj;
        }

        // If the object has a tagName property, remove it
        if (jsonObj.hasOwnProperty(tagName)) {
            delete jsonObj[tagName];
        }

        // Recursively remove tagName property from nested objects and arrays
        for (const key in jsonObj) {
            if (jsonObj.hasOwnProperty(key)) {
                jsonObj[key] = this.removeNestedRequired(jsonObj[key], tagName);
            }
        }
        return jsonObj;
    }

    static addAdditionalProperties(jsonObj) {
        // Check if the input is an object
        if (typeof jsonObj !== 'object' || jsonObj === null) {
            return jsonObj;
        }

        // If the object has a 'type' property set to 'object', add 'additionalProperties: false'
        if (jsonObj.hasOwnProperty('type') && jsonObj.type === 'object') {
            jsonObj.additionalProperties = false;
        }

        // Recursively add 'additionalProperties: false' to nested objects and arrays
        for (const key in jsonObj) {
            if (jsonObj.hasOwnProperty(key)) {
                jsonObj[key] = this.addAdditionalProperties(jsonObj[key]);
            }
        }

        return jsonObj;
    }

    static mergeJsonObjects(obj1, obj2) {
        const mergedObject = { ...obj1 };
        for (const key in obj2) {
            if (Array.isArray(obj2[key]) && obj1[key]) {
                mergedObject[key] = this.mergeJsonArrays(obj2[key], obj1[key]);
            }
            else if (typeof obj2[key] === 'object') {
                mergedObject[key] = this.mergeJsonObjects(obj1[key], obj2[key]);
            } else {
                // Copy the key-value pair from obj2 to mergedObject
                mergedObject[key] = obj2[key];
            }
        }
        return mergedObject;
    }

    static mergeJsonArrays(arr1, arr2, tagToConsider) {
        const mergedArray = [];

        arr1.forEach(obj1 => {
            // Find the corresponding object in arr2 based on the tagToConsider
            const obj2 = arr2.find(item => item[tagToConsider] === obj1[tagToConsider]);

            if (obj2) {
                // Merge the two objects and add to the mergedArray
                const mergedObject = { ...obj1, ...obj2 };
                mergedArray.push(mergedObject);
            } else {
                // If no corresponding object is found in arr2, add obj1 as it is
                mergedArray.push(obj1);
            }
        });

        // Add objects from arr2 that are not present in arr1
        arr2.forEach(obj2 => {
            const existsInMergedArray = mergedArray.some(item => item[tagToConsider] === obj2[tagToConsider]);
            if (!existsInMergedArray) {
                mergedArray.push(obj2);
            }
        });

        return mergedArray;
    }
}