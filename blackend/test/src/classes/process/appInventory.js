const request         = require('supertest');
const should          = require('should');
const config          = require('../../../config');
const assert          = require('assert');
const InstanceModel   = require('../../../../src/models/instance');
const HistoryModel    = require('../../../../src/models/history');


module.exports = function(app) {
	describe('appInventory', function () {
        before(function (done) {
            var instance = new InstanceModel({
                name: "server-1",
                inventory: false,
                migrated: false,
                status: "open",
                planned: false,
                type: 'server',
                attributes: {
                    owner: "Human 1"
                },
                applications: [{
                    "app_status" : "open",
                    "migrated" : false,
                    "workflow" : {},
                    "servicename" : "App-1",
                    "systype" : "app",
                    "attributes" : {
                        "owner" : "AppOwner1"
                    },
                    "inventory" : false,
                    "planned" : false
                }],
                workflow: {}
            });
            instance.save(function(err, saved) {
                var instance = new InstanceModel({
                    name: "server-2",
                    inventory: false,
                    migrated: false,
                    status: "open",
                    planned: false,
                    type: 'server',
                    attributes: {
                        owner: "Human 2"
                    },
                    applications: [{
                        "app_status" : "open",
                        "migrated" : false,
                        "workflow" : {},
                        "servicename" : "App-1",
                        "systype" : "app",
                        "attributes" : {
                            "owner" : "AppOwner2"
                        },
                        "inventory" : false,
                        "planned" : false
                    }, {
                        "app_status" : "open",
                        "migrated" : false,
                        "workflow" : {},
                        "servicename" : "App-2",
                        "systype" : "app",
                        "attributes" : {
                            "owner" : "AppOwner3"
                        },
                        "inventory" : false,
                        "planned" : false
                    }],
                    workflow: {}
                });
                instance.save(function(err, saved) {
                    done();
                });
            });
        });


        it('Summary server is returning correct results '
            +'before inventory', function (done) {
            request(app)
                .get(config.url_base + '/server/summary/')
                .set('Cookie', 'jwt=' + config.jwt_token)
                .expect(200)
                .end(function(err, res) {
                    assert.equal(res.body.open, 2);
                    assert.equal(res.body.progress, 0);
                    assert.equal(res.body.done, 0);
                    assert.equal(res.body.valid, 0);
                    done();
                });
        });


        it('Summary app is returning correct results '
            +'before inventory', function (done) {
            request(app)
                .get(config.url_base + '/application/summary/')
                .set('Cookie', 'jwt=' + config.jwt_token)
                .expect(200)
                .end(function(err, res) {
                    assert.equal(res.body.open, 3);
                    assert.equal(res.body.progress, 0);
                    assert.equal(res.body.done, 0);
                    assert.equal(res.body.valid, 0);
                    done();
                });
        });


        it('Inventoring server-1 and app-1', function (done) {
            InstanceModel.findOne({"name": "server-1"}, 
                    function(err, mockServer) {
                request(app)
                    .post(config.url_base + '/workflow/application/migrate/')
                    .send({
                        category: 'applications',
                        server_id: mockServer._id,
                        item_name: "App-1",
                        workflow: {
                            attributes: {
                                owner: "AppOwner1",
                                servicename: "App-1",
                                app_status: "open"
                            },
                            attributes_instance: {},
                            has_open_work: {},
                            has_app_owner_informed: {},
                            is_app_owner_known: {},
                            is_system_owner_known: {},
                            planning_end: {},
                            planning_start: {},
                            was_test_migration_executed: {}
                        }
                    })
                    .set('Cookie', 'jwt=' + config.jwt_token)
                    .expect(200)
                    .end(function(err, res) {
                        assert.equal(res.body.message, "Servers and apps have "
                            + "been updated.");
                        done();
                    });
            });
        });


        it('Inventoring server-1', function (done) {
            InstanceModel.findOne({"name": "server-1"}, 
                    function(err, mockServer) {
                request(app)
                    .post(config.url_base + '/workflow/server/migrate/')
                    .send({
                        category: 'server',
                        server_id: mockServer._id,
                        workflow: {
                            attributes: {
                                owner: "Human 1",
                                name: "server-1",
                                app_status: "open"
                            },
                            attributes_instance: {},
                            has_open_work: {},
                            has_system_owner_informed: {},
                            is_app_owner_known: {},
                            is_system_owner_known: {},
                            planning_end: {},
                            planning_start: {},
                            was_test_migration_executed: {}
                        }
                    })
                    .set('Cookie', 'jwt=' + config.jwt_token)
                    .expect(200)
                    .end(function(err, res) {
                        assert.equal(res.body.message, "Server has applications. "
                            + "Only attributes has been updated and inventoried.");
                        done();
                    });
            });
        });


        it('Summary server is returning correct results '
            +'before inventory', function (done) {
            request(app)
                .get(config.url_base + '/server/summary/')
                .set('Cookie', 'jwt=' + config.jwt_token)
                .expect(200)
                .end(function(err, res) {
                    assert.equal(res.body.open, 2);
                    assert.equal(res.body.progress, 0);
                    assert.equal(res.body.done, 0);
                    assert.equal(res.body.valid, 1);
                    done();
                });
        });


        it('Summary app is returning correct results '
            +'before inventory', function (done) {
            request(app)
                .get(config.url_base + '/application/summary/')
                .set('Cookie', 'jwt=' + config.jwt_token)
                .expect(200)
                .end(function(err, res) {
                    assert.equal(res.body.open, 3);
                    assert.equal(res.body.progress, 0);
                    assert.equal(res.body.done, 0);
                    assert.equal(res.body.valid, 1);
                    done();
                });
        });


        after(function (done) {
            InstanceModel.deleteMany({}, function(err) {
                HistoryModel.deleteMany({}, function(err) {
                    done();
                });
            });
        });
    });
};