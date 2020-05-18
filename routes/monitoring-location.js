const {validationResult} = require('express-validator');

const renderToResponse = require('../renderer');

const monitoringLocation = function(req, res) {
    const errors = validationResult(req).array();

    if (errors.length > 0) {
        res.status(400);
        res.send(errors);
        return;
    }

    renderToResponse(res, {
        siteID: req.params.siteID,
        parameterCode: req.query.parameterCode,
        compare: req.query.compare,
        period: req.query.period,
        startDT: req.query.startDT,
        endDT: req.query.endDT,
        timeSeriesId: req.query.timeSeriesId,
        showMLName: req.query.title || false,
        width: req.query.width ? req.query.width : 1200
    });
};

module.exports = monitoringLocation;