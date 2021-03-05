/**
 * Chromium rendering implementation.
 */

const createPuppeteerPool = require('./puppeteer-pool');

// Set to determine the number of Chrome instances to maintain a pool of.
const POOL_SIZE = process.env.CHROME_POOL_SIZE || 2;

// Returns a generic-pool instance
const pool = createPuppeteerPool({
    min: 1,
    max: POOL_SIZE,

    // How long a resource can stay idle in pool before being removed
    idleTimeoutMillis: 60000,

    // Maximum number of times an individual resource can be reused before being
    // destroyed; set to 0 to disable
    maxUses: 50,

    // Function to validate an instance prior to use;
    // see https://github.com/coopernurse/node-pool#createpool
    validator: () => Promise.resolve(true),

    // Validate resource before borrowing; required for `maxUses and `validator`
    testOnBorrow: true,

    // For all opts, see opts at:
    // https://github.com/coopernurse/node-pool#createpool

    // Arguments to pass on to Puppeteer
    puppeteerArgs: {
        headless: true,
        args: [
            // Ignore CORS issues
            '--disable-web-security',
            '--no-sandbox'
        ]
    }
});

async function renderToPage(renderFunc) {
    // Grab a browser from the tool
    return await pool.use(async browser => {
        // Create a page to render to
        const page = await browser.newPage();
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        try {
            return await renderFunc(page);
        } finally {
            await page.close();
        }
    });
}

async function getPNG({pageContent, viewportSize}) {
    return await renderToPage(async function(page) {
        // Set the origin header for outgoing requests - this is to avoid waterservices
        // returning a 403 on a null origin.
        page.setExtraHTTPHeaders({
            origin: 'http://localhost:9000'
        });

        await page.setContent(pageContent);

        // Use an arbitrary width that will guarantee desktop-like rendering.
        page.setViewport(viewportSize);

        // Log browser console messages
        page.on('console', msg => console.log('[CONSOLE LOG]', msg.text()));

        await Promise.all([
            page.waitForSelector('.hydrograph-svg .ts-primary-group', {visible: true}),
            page.waitForSelector('.hydrograph-svg .ts-compare-group', {visible: true}),
            page.waitForSelector('.hydrograph-svg #flood-level-points', {visible: true}),
            page.waitForSelector('.hydrograph-svg .iv-graph-gw-levels-group', {visible: true}),
            page.waitForSelector('.ts-legend-controls-container .legend-svg', {visible: true})
        ]);

        let handle = await page.$('.graph-container');
        return await handle.screenshot();
    });
}

module.exports = getPNG;
