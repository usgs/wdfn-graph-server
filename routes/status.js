const { version } = require('../package.json');

/*
 * Returns a res for
 */
const status = function(req, res) {
    res.status(200);
    res.send({
        version: version
    });
};

module.exports = status;