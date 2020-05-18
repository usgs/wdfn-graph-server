const httpMocks = require('node-mocks-http');
const status = require('./status');

describe('routes/status', () => {

    test('Should return a JSON response with the version', () => {
        const request = httpMocks.createRequest({
            method: 'GET'
        });
        const response = httpMocks.createResponse({});
        status(request, response);

        expect(response.statusCode).toBe(200);
    });

});