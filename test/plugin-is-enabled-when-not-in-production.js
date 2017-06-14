'use strict'

const Lab = require('lab');
const Code = require('code');
const Boom = require('boom');
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3000 });

const lab = exports.lab = Lab.script();
const experiment = lab.experiment;
const test = lab.test;

experiment('hapi-dev-error register plugin', () => {

    lab.before(done => {

        // fake dev env, no process.env.NODE_ENV defined

        server.register({
            register: require('../lib/index'),
            options: {
                showErrors: process.env.NODE_ENV !== 'production'
            }
        }, err => {

            done(err);
        });
    });

    test('test if the plugin is enabled in development for web requests', done => {

        const routeOptions = {
            path: '/showErrorsForWeb',
            method: 'GET',
            handler: (request, reply) => {
                reply(Boom.badImplementation('server error'))
            }
        };

        server.route(routeOptions);

        const options = {
            url: routeOptions.path,
            method: routeOptions.method
        };

        server.inject(options, response => {

            const payload = response.payload

            Code.expect(response.statusCode).to.equal(500);
            Code.expect(payload).to.startWith('<!DOCTYPE html>');

            done();
        });
    });

    test('test if the plugin is enabled in development for JSON/REST requests', done => {

        const routeOptions = {
            path: '/showErrorsForREST',
            method: 'GET',
            handler: (request, reply) => {
                reply(Boom.badImplementation('server error'))
            }
        };

        server.route(routeOptions);

        const options = {
            url: routeOptions.path,
            method: routeOptions.method,
            headers: {
                'accept': 'application/json'
            },
        };

        server.inject(options, response => {

            const payload = JSON.parse(response.payload || '{}');

            Code.expect(response.statusCode).to.equal(500);
            Code.expect(payload.stacktrace).to.exist()
            Code.expect(payload.url).to.equal(routeOptions.path)
            Code.expect(payload.method).to.equal(routeOptions.method)

            done();
        });
    });
});
