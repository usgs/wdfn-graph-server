jest.mock('express-validator');
jest.mock('../renderer');

const {validationResult} = require('express-validator');
const renderToResponse = require('../renderer');
const httpMocks = require('node-mocks-http');

const monitoringLocation = require('./monitoring-location');

describe('routes/monitoring-location', () => {
    let request, response;
    beforeEach(() => {
        response = httpMocks.createResponse({});
    });

    test('calls renderToResponse if no validationErrors', () => {
        request = httpMocks.createRequest({
            method: 'GET',
            url: '/api/graph-images/monitoring-location/012345678',
            params: {
                siteID: '012345678'
            },
            query: {
                parameterCode: '12345'
            }
        });
        validationResult.mockReturnValue({
            array : jest.fn(() => [])
        });
        monitoringLocation(request, response);

        expect(validationResult).toHaveBeenCalled();
        expect(response.statusCode).toBe(200);
        expect(renderToResponse).toHaveBeenCalledWith(response, {
            siteID: '012345678',
            parameterCode: '12345',
            compare: false,
            period: undefined,
            startDT: undefined,
            endDT: undefined,
            timeSeriesId: undefined,
            showMLName: false,
            width: 1200
        });
    });

    test('validation errors should set the status to 400', () => {
        request = httpMocks.createRequest({
            method: 'GET',
            url: '/api/graph-images/monitoring-location/012345678',
            params: {
                siteID: '012345678'
            },
            query: {
                parameterCode: '12345'
            }
        });
        validationResult.mockReturnValue({
            array : jest.fn(() => [
                'Validation errors exist'
            ])
        });
        monitoringLocation(request, response);

        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual(['Validation errors exist'])
    });

    it('query parameters populate the rendering request as expected', () =>{
        request = httpMocks.createRequest({
            method: 'GET',
            url: '/api/graph-images/monitoring-location/012345678',
            params: {
                siteID: '012345678'
            },
            query: {
                parameterCode: '12345',
                compare: true,
                period: 'P20D',
                startDT: '2018-04-01',
                endDT: '2018-06-15',
                timeSeriesId: 333444,
                title: true,
                width: 800
            }
        });
        validationResult.mockReturnValue({
            array : jest.fn(() => [])
        });

        monitoringLocation(request, response);

        expect(response.statusCode).toBe(200);
        expect(renderToResponse).toHaveBeenCalledWith(response, {
            siteID: '012345678',
            parameterCode: '12345',
            compare: true,
            period: 'P20D',
            startDT: '2018-04-01',
            endDT: '2018-06-15',
            timeSeriesId: 333444,
            showMLName: true,
            width: 800
        });
    });
});