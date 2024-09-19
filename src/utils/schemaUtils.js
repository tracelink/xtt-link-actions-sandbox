import jsonSchemaGenerator from 'json-schema-generator'
import Ajv from 'ajv';
import { createSchema } from 'genson-js';

export class SchemaUtils {

    constructor(api, config) {

    }

    static generateSchema(json) {
        const jsonSchema = jsonSchemaGenerator(json);
        return jsonSchema;
    }

    static generateJSONSchema(json) {
        const jsonSchema = createSchema(json);
        return jsonSchema;
    }


    static validateJSONForSchema(jsonData, schema) {
        const ajv = new Ajv();
        const validate = ajv.compile(schema)
        const valid = validate(jsonData)
        if (!valid) {
            console.log(validate.errors)
            return false;
        }
        return true;
    }
}