jest.mock('express-validator');
jest.mock('../renderer');

const {validationResult} = require('express-validator');
const renderToResponse = require('../renderer');
const httpMocks = require('node-mocks-http');

const monitoringLocation = require('./monitoring-location');

describe('routes/monitoring-location', () => {
    let request, response;
    beforeEach(() => {
        request = httpMocks.createRequest({
            method: 'GET',
            url: '/api/graph-images/monitoring-location/01234567',
            params: {
                parameterCode: '01234'
            }
        });

        response = httpMocks.createResponse({});
    });

    test('calls renderToResponse if no validationErrors', () => {
        validationResult.mockReturnValue({
            array : jest.fn(() => [])
        });
        monitoringLocation(request, response);
        expect(validationResult).toHaveBeenCalled();
        expect(renderToResponse).toHaveBeenCalledWith(response, {
            siteID: '012345678',
            parameterCode: '01234',
            compare: false,
            period: '',
            startDT: '',
            endDT: '',
            timeSeriesId: '',
            showMLName: false,
            width: 1200
        });
    });
});