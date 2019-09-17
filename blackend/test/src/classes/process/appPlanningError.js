const request         = require('supertest');
const should          = require('should');
const config          = require('../../../config');
const assert          = require('assert');
const InstanceModel   = require('../../../../src/models/instance');
const HistoryModel    = require('../../../../src/models/history');


module.exports = function(app) {
	describe('appPlanningError', function () {
        before(function (done) {
            var instance = new InstanceModel({
                name: "server-1",
                inventory: true,
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
                    },
                    "servicename" : "App-1",
                    "systype" : "app",
                    "attributes" : {
                        "owner" : "AppOwner1"
                    },
                    "inventory" : true,
                    "planned" : false
                }],
                workflow: {}
            });
            instance.save(function(err, saved) {
                var instance = new InstanceModel({
                    name: "server-2",
                    inventory: true,
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
                        workflow: {
                            attributes: {
                                owner: "AppOwner2",
                                name: "server-2",
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
                        },
                        "servicename" : "App-1",
                        "systype" : "app",
                        "attributes" : {
                            "owner" : "AppOwner2"
                        },
                        "inventory" : true,
                        "planned" : false
                    }, {
                        "app_status" : "open",
                        "migrated" : false,
                         workflow: {},
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


        it('Setting status to error of app', function (done) {
            InstanceModel.findOne({"name": "server-2"}, 
                    function(err, mockServer) {
                request(app)
                    .post(config.url_base + '/workflow/application/migrate/')
                    .send(workflow = {
                        category: 'applications',
                        server_id: mockServer._id,
                        item_name: "App-1",
                        workflow: {
                            attributes: {
                                owner: "AppOwner2",
                                servicename: "App-1",
                                app_status: "open"
                            },
                            attributes_instance: {},
                            has_open_work: {},
                            has_app_owner_informed: {
                                checked: false
                            },
                            is_app_owner_known: {
                                checked: true
                            },
                            planning_end: {
                                checked: true
                            },
                            planning_start: {
                                checked: true
                            },
                            was_test_migration_executed: {
                                checked: true
                            },
                            was_test_migration_possible: {
                                checked: true
                            },
                            was_test_migration_successfull: {
                                content: []
                            }
                        }
                    })
                    .set('Cookie', 'jwt=' + config.jwt_token)
                    .expect(200)
                    .end(function(err, res) {
                        assert.equal(res.body.code, 2);
                        done();
                    });
            });
        });


        it('Summary server is returning correct results (including error)', function (done) {
            request(app)
                .get(config.url_base + '/server/summary/')
                .set('Cookie', 'jwt=' + config.jwt_token)
                .expect(200)
                .end(function(err, res) {
                    assert.equal(res.body.open, 0);
                    assert.equal(res.body.progress, 0);
                    assert.equal(res.body.done, 0);
                    assert.equal(res.body.valid, 2);
                    done();
                });
        });


        it('Summary app is returning correct results', function (done) {
            request(app)
                .get(config.url_base + '/application/summary/')
                .set('Cookie', 'jwt=' + config.jwt_token)
                .expect(200)
                .end(function(err, res) {
                    assert.equal(res.body.open, 1);
                    assert.equal(res.body.progress, 0);
                    assert.equal(res.body.done, 0);
                    assert.equal(res.body.valid, 2);
                    done();
                });
        });


        it('Testing /application/status/progress/', function (done) {
            request(app)
                .get(config.url_base + '/application/status/progress/')
                .set('Cookie', 'jwt=' + config.jwt_token)
                .expect(200)
                .end(function(err, res) {
                    assert.equal(res.body.length, 0);
                    done();
                });
        });


        it('Testing /application/status/open/', function (done) {
            request(app)
                .get(config.url_base + '/application/status/open/')
                .set('Cookie', 'jwt=' + config.jwt_token)
                .expect(200)
                .end(function(err, res) {
                    assert.equal(res.body.length, 1);
                    assert.equal(res.body[0].app_name, "App-2");
                    done();
                });
        });


        it('Testing /application/status/error/', function (done) {
            request(app)
                .get(config.url_base + '/application/status/error/')
                .set('Cookie', 'jwt=' + config.jwt_token)
                .expect(200)
                .end(function(err, res) {
                    assert.equal(res.body.length, 1);
                    assert.equal(res.body[0].app_name, "App-1");
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