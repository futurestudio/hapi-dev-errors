'use strict';

const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');

let server;

const { experiment, test, before } = (exports.lab = Lab.script());
const expect = Code.expect;

experiment('hapi-dev-error works only with 500 errors', () => {
    before(async () => {
        server = new Hapi.Server();

        // fake dev env, no process.env.NODE_ENV defined
        await server.register({
            plugin: require('../lib'),
            options: {
                showErrors: process.env.NODE_ENV !== 'production'
            }
        });
    });

    test('test if the plugin skips handling for non-error response', async () => {
        const routeOptions = {
            path: '/ok',
            method: 'GET',
            handler: () => {
                return 'ok';
            }
        };

        server.route(routeOptions);

        const options = {
            url: routeOptions.path,
            method: routeOptions.method
        };

        const response = await server.inject(options);
        const payload = response.payload;

        expect(response.statusCode).to.equal(200);
        expect(payload).to.equal('ok');
    });
});
