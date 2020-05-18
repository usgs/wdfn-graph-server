const createPool = require('./puppeteer-pool');


const getState = function ({ size, available, pending, max, min }) {
    const state = { size, available, pending, max, min };
    return state;
}

const inUse = function ({ size, available }) {
    return size - available;
}

describe('Puppeteer pool', function () {
    let pool;

    beforeEach( function () {
        pool = createPool({
            min: 0,
            max: 2
        });
    });

    afterEach(async function () {
        pool.drain().then(() => pool.clear());
    });

    test('create pool', async function () {
        const instance = await pool.acquire();
        const page = await instance.newPage();
        const viewportSize = await page.viewport();
        expect(viewportSize.width).toEqual(800);
        expect(viewportSize.height).toEqual(600);

        await pool.release(instance);
    });

    test('use', async function () {
        expect(inUse(pool)).toEqual(0);
        const result = await pool.use(async function (instance) {
            expect(inUse(pool)).toEqual(1);
            const page = await instance.newPage();
            return await page.evaluate('navigator.userAgent');
        });
        expect(result).not.toBe(null);
        expect(inUse(pool)).toEqual(0);
    });

    test('use and throw', async function () {
        expect(inUse(pool)).toEqual(0);
        try {
            await pool.use(async function () {
                expect(inUse(pool)).toEqual(1);
                throw new Error('some err');
            });
        } catch (err) {
            expect(err.message).toEqual('some err');
        }
        expect(inUse(pool)).toEqual(0);
    });
});
