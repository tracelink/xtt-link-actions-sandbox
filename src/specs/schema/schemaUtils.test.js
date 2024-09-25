import { SchemaUtils } from "../../utils/schemaUtils.js";
import { expect } from "chai";

describe('Generate Schema', function () {

    context('Output schema should not be empty', function () {
        it('Schema object is generated', function () {
            const jsonData = {
                "extra": {
                    "point": {
                        "value": "es",
                        "name": "Bob",
                    },
                },
            }

            //const schemaUtil = new SchemaUtils();
            const result = SchemaUtils.generateJSONSchema(jsonData);
            console.log(JSON.stringify(result));
            expect(result).to.be.an('object');
        });
    });
});

describe('Schema Validator', function () {
    context('Schema should validate json data', function () {
        it('JSON should be valid', function () {
            const jsonData = {
                "extra": {
                    "point": {
                        "value": "es",
                        "name": "Bob",
                    },
                },
            }

            const schema = { "type": "object", "properties": { "extra": { "type": "object", "properties": { "point": { "type": "object", "properties": { "value": { "type": "string" }, "name": { "type": "string" } }, "required": ["value", "name"] } }, "required": ["point"] } }, "required": ["extra"] };

            //const schemaUtil = new SchemaUtils();
            const result = SchemaUtils.validateJSONForSchema(jsonData, schema);
            expect(result).to.equal(true);
        });
    });
});