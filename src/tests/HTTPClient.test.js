import { expect } from 'chai';
import { HttpClient } from '../HttpClient.js';
import { logger } from '../utils/Logger.js'; 

class CommonUtils {
    static beautify(data) {
        return JSON.stringify(data, null, 2);
    }
}

describe('HttpClient', () => {
    let httpClient;
    let originalData;

    before(async () => {
        try {
            httpClient = new HttpClient();
            const uri = 'http://localhost:3003/api/data';
            const headers = {
                "Content-Type": "application/json"
            };
            const response = await httpClient.get(uri, headers);
            originalData = JSON.parse(response.body);
            console.log('Original data fetched successfully:', originalData);
        } catch (error) {
            console.error('Error fetching original data:', error);
            throw error; 
        }
    });

    beforeEach(() => {
        logger.debug = () => {};
    });

    describe('get method', () => {
        it('should make a GET request and return response', async () => { 
            const uri = 'http://localhost:3003/api/data'; 
            const headers = {
                "Content-Type": "application/json"
            };
            const expectedResponse = {
                statusCode: 200,
                body: JSON.stringify([
                    { id: 1, type: 'PURCHASEORDER', description: "This is a Purchase Order", memo: "This is a Purchase Order Memo"},
                    { id: 2, type: 'BLANKETPURACHSEORDER', description: "This is a Blanket Purchase Order", memo: "This is a Blanket Purchase Order Memo" }
                ])
            };
    
            const response = await httpClient.get(uri, headers);    
            expect(response.statusCode).to.equal(expectedResponse.statusCode);
            expect(response.body).to.equal(expectedResponse.body);
        });
    });

    describe('post method', () => {
        it('should make a POST request and return response', () => {
            const uri = 'http://localhost:3003/api/data';
            const headers = { 'Content-Type': 'application/json' };
            const payload = { id: 3, type: 'SALESORDER', description: 'This is a Sales Order', memo: 'This is a Sales Order Memo' };
            const expectedResponse = { statusCode: 201, body: payload};
            
            const response = httpClient.post(uri, headers, JSON.stringify(payload));
            const responseBody=JSON.parse(response.body);
            expect(response.statusCode).to.equal(expectedResponse.statusCode);
            expect(responseBody.id).to.equal(expectedResponse.body.id);
            expect(responseBody.type).to.equal(expectedResponse.body.type);
            expect(responseBody.description).to.equal(expectedResponse.body.description);
            expect(responseBody.memo).to.equal(expectedResponse.body.memo);
        });

    });

    describe('put method', () => {
        it('should make a PUT request and return response', () => {
            const uri = 'http://localhost:3003/api/data/2';
            const headers = { 'Content-Type': 'application/json' };
            const payload = { type: 'SALESORDER', description: 'This is a Sales Order', memo: 'This is a Sales Order Memo' };
            const expectedResponse = { statusCode: 200, body: payload};

            const response = httpClient.put(uri, headers, JSON.stringify(payload));
            const responseBody = JSON.parse(response.body);
            expect(response.statusCode).to.equal(expectedResponse.statusCode);
            expect(responseBody.type).to.equal(expectedResponse.body.type);
            expect(responseBody.description).to.equal(expectedResponse.body.description);
            expect(responseBody.memo).to.equal(expectedResponse.body.memo);
        });

    });

    describe('patch method', () => {
        it('should make a PATCH request and return response', () => {
            const id = 1;
            const uri = 'http://localhost:3003/api/data/'+id;
            const headers = { 'Content-Type': 'application/json' };
            const payload = { type: 'INVOICE', description: 'This is a Invoice'};
            const expectedResponse = { statusCode: 200, body: payload };
            const checkData = originalData.find(item => item.id === id);
            const response = httpClient.patch(uri, headers, JSON.stringify(payload));
            const responseBody = JSON.parse(response.body);
            expect(response.statusCode).to.equal(expectedResponse.statusCode);
            expect(responseBody.type).to.equal(expectedResponse.body.type);
            expect(responseBody.description).to.equal(expectedResponse.body.description);
            expect(responseBody.memo).to.equal(checkData.memo);
        });

    });
});
