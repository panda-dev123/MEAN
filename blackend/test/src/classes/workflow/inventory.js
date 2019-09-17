const request         = require('supertest');
const should          = require('should');
const config          = require('../../../config');
const assert          = require('assert');
const Inventory       = require('../../../../src/classes/workflow/Inventory');


module.exports = function(app) {
    const meta = config.app_settings.meta.server;


    describe('Class Inventory', function () {
        it('Getting attributes without keys', function(done) {
            var object = new Inventory(meta, {
                attributes: {
                    name: "John Doe",
                    type: "virtual",
                    servicename: "Service1",
                    app_status: "open"
                }
            });
            var attr = object.getAttributes();
            assert.equal(Object.keys(attr).length, 1);
            assert.equal(attr.type, "virtual");
            done();
        });


        it('Getting key', function(done) {
            var object = new Inventory(meta, {
                attributes: {
                    name: "John Doe"
                }
            });
            assert.equal(object.getKey(), "John Doe");
            done();
        });


        it('Can detect error', function(done) {
            var object = new Inventory(meta, {
                attributes: {
                    name: "John Doe",
                    owner: "NV"
                }
            });
            assert.equal(object.hasError(), true);
            done();
        });


        it('Can detect valid values', function(done) {
            var object = new Inventory(meta, {
                attributes: {
                    name: "John Doe",
                    owner: "Tesla"
                }
            });
            assert.equal(object.hasError(), false);
            done();
        });


        it('Can detect when NOT complete (error)', function(done) {
            var object = new Inventory(meta, {
                attributes: {
                    name: "John Doe",
                    owner: "NV"
                }
            });
            assert.equal(object.isComplete(), false);
            done();
        });


        it('Can detect when NOT complete (value)', function(done) {
            var object = new Inventory(meta, {
                attributes: {
                    name: "Tesla"
                }
            });
            assert.equal(object.isComplete(), true);
            done();
        });


        it('Can detect when complete', function(done) {
            var object = new Inventory(meta, {
                attributes: {
                    name: "John Doe",
                    owner: "Tesla"
                }
            });
            assert.equal(object.isComplete(), true);
            done();
        });
    });
};