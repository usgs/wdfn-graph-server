const renderPNG = require('./render-png');

const WDFN_ROOT = process.env.WDFN_ROOT || 'https://waterdata.usgs.gov/';

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
    const pagePeriod = period || startDT && endDT ? period : 'P7D';
    const pageParameters = {
        parameterCode,
        compare,
        period: pagePeriod || '',
        startDT: pagePeriod ? '' : startDT,
        endDT: pagePeriod ? '' : endDT,
        timeSeriesId: timeSeriesId || '',
        showOnlyGraph: true,
        showMLName: showMLName
    };

    console.log(`startDT = ${startDT}, endDT = ${endDT}`);
    const viewportSize = {
        width: width,
        height: width
    };
    renderPNG(`${WDFN_ROOT}/monitoring-location/${siteID}/#${new URLSearchParams(pageParameters).toString()}`, viewportSize)
        .then(function(buffer) {
            res.setHeader('Content-Type', 'image/png');
            res.write(buffer, 'binary');
            res.end(null, 'binary');
        })
        .catch(function (error) {
            console.log(error);
            res.status(500);
            res.send({
                error: error
            });
        });
};

module.exports = renderToResponse;
