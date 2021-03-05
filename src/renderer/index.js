const axios = require('axios');

const renderPNG = require('./render-png');

const SERVICE_ROOT = process.env.SERVICE_ROOT || 'https://waterservices.usgs.gov/nwis';
const PAST_SERVICE_ROOT = process.env.PAST_SERVICE_ROOT || 'https://nwis.waterservices.usgs.gov/nwis';
const STATIC_ROOT = process.env.STATIC_ROOT || 'https://waterdata.usgs.gov/nwisweb/wsgi/static';
const OGC_SITE_ENDPOINT = process.env.OGC_SITE_ENDPOINT || 'https://labs.waterdata.usgs.gov/api/observations/collections/monitoring-locations/items/';
const WATERWATCH_ENDPOINT = process.env.WATERWATCH_ENDPOINT || 'https://waterwatch.usgs.gov/webservices';
const GROUNDWATER_LEVELS_ENDPOINT = process.env.GROUNDWATER_LEVELS_ENDPOINT || 'https://waterservices.usgs.gov/nwis/gwlevels/';
const WEATHER_SERVICE_ROOT = process.env.WEATHER_SERVICE_ROOT || 'https://api.weather.gov/';

const renderToResponse = function(res,
                                   {
                                       siteID,
                                       parameterCode,
                                       compare,
                                       period,
                                       startDT,
                                       endDT,
                                       timeSeriesId,
                                       showMLName,
                                       width
                                   }) {
    console.log(`Using static root ${STATIC_ROOT}`);
    console.log(`Retrieving site id with ${OGC_SITE_ENDPOINT}USGS-${siteID}?f=json`);
    axios.get(`${OGC_SITE_ENDPOINT}USGS-${siteID}?f=json`)
        .then((resp) => {
            let timeZone;
            const componentOptions = {
                siteno: siteID,
                agencyCode: resp.data.properties.agencyCode,
                sitename: resp.data.properties.monitoringLocationName,
                parameterCode: parameterCode,
                compare: compare,
                period: period,
                startDT: startDT,
                endDT: endDT,
                timeSeriesId: timeSeriesId,
                showOnlyGraph: true,
                showMLName: showMLName
            };
            axios.get(`${WEATHER_SERVICE_ROOT}points/${resp.data.geometry.coordinates[1]},${resp.data.geometry.coordinates[0]}`)
                .then((resp) => {
                    timeZone = resp.data.properties && resp.data.properties.timeZone ? resp.data.properties.timeZone : null;

                    renderPNG({
                        pageURL: 'http://wdfn-graph-server',
                        pageContent: `<!DOCTYPE html>
                        <html lang="en">
                            <head>
                                <script>
                                    var CONFIG = {
                                        SERVICE_ROOT: '${SERVICE_ROOT}',
                                        PAST_SERVICE_ROOT: '${PAST_SERVICE_ROOT}',
                                        MULTIPLE_TIME_SERIES_METADATA_SELECTOR_ENABLED: false,
                                        STATIC_URL: '${STATIC_ROOT}',
                                        WATERWATCH_ENDPOINT: '${WATERWATCH_ENDPOINT}',
                                        GROUNDWATER_LEVELS_ENDPOINT: '${GROUNDWATER_LEVELS_ENDPOINT}',
                                        locationTimeZone: '${timeZone}',
                                        ivPeriodOfRecord: {},
                                        gwPeriodOfRecord: {}
                                    };
                                    // We add the ivPeriodOfRecord and gwPeriodOfRecord for the requested parameterCode
                                    // so that the hydrograph rendering code tries to fetch the data
                                    CONFIG.ivPeriodOfRecord['${parameterCode}'] = {};
                                    CONFIG.gwPeriodOfRecord['${parameterCode}'] = {};
                                </script>
                                <link rel="stylesheet" href="${STATIC_ROOT}/main.css">
                                <script src="${STATIC_ROOT}/bundle.js"></script>
                            </head>
                            <body id="monitoring-location-page-container">
                                <div class="wdfn-component" data-component="hydrograph" data-options='${JSON.stringify(componentOptions)}'>
                                    <div id="hydrograph-wrapper">
                                        <div class="graph-container"></div>
                                        <div id="hydrograph-loading-indicator-container" class="loading-indicator-container"></div>
                                    </div>
                                </div>
                            </body>
                        </html>`,
                        viewportSize: {
                            width: width,
                            height: width
                        }
                    }).then(function (buffer) {
                        res.setHeader('Content-Type', 'image/png');
                        res.write(buffer, 'binary');
                        res.end(null, 'binary');
                    }).catch(function (error) {
                        console.log(error);
                        res.status(500);
                        res.send({
                            error: error
                        });
                    });
                })
                .catch((error) => {
                    console.log(`Failed to weather service data: ${error}`);
                });
        })
        .catch((error) => {
            console.log(`Failed to fetch site metadata: ${error}`);
        });
};

module.exports = renderToResponse;
