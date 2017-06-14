'use strict'

const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3000 });

const lab = exports.lab = Lab.script();
const experiment = lab.experiment;
const test = lab.test;

experiment('hapi-dev-error register plugin', () => {

    lab.before(done => {

        // fake production env
        process.env.NODE_ENV = 'prod'

        server.register({
            register: require('../lib/index'),
            options: {
                showErrors: process.env.NODE_ENV !== 'prod'
            }
        }, err => {

            done(err);
        });
    });

    test('test if the plugin is disabled in production', done => {

        const routeOptions = {
            path: '/showErrorsIsFalse',
            method: 'GET',
            handler: (request, reply) => {
                reply(new Error('failure'))
            }
        };

        server.route(routeOptions);

        const options = {
            url: routeOptions.path,
            method: routeOptions.method
        };

        server.inject(options, response => {

            const payload = JSON.parse(response.payload || '{}');

            Code.expect(response.statusCode).to.equal(500);
            Code.expect(payload.message).to.equal('An internal server error occurred');
            Code.expect(payload.error).to.equal('Internal Server Error');

            done();
        });
    });
});
