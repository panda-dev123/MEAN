const request         = require('supertest');
const should          = require('should');
const config          = require('../../../config');
const assert          = require('assert');
const InstanceModel   = require('../../../../src/models/instance');
const HistoryModel    = require('../../../../src/models/history');


module.exports = function(app) {
	describe('appMigration', function () {
        before(function (done) {
            var instance = new InstanceModel({
                name: "server-1",
                inventory: true,
                migrated: false,
                status: "progress",
                planned: true,
                type: 'server',
                attributes: {
                    owner: "Human 1"
                },
                applications: [{
                    "app_status" : "progress",
                    "migrated" : false,
                    workflow: {
                        attributes: {
                            owner: "AppOwner1",
                            servicename: "App-1",
                            app_status: "progress"
                        },
                        attributes_instance: {},
                        has_open_work: {},
                        has_app_owner_informed: {
                            checked: true
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
                    },
                    "servicename" : "App-1",
                    "systype" : "app",
                    "attributes" : {
                        "owner" : "AppOwner1"
                    },
                    "inventory" : true,
                    "planned" : true
                }],
                workflow: {}
            });
            instance.save(function(err, saved) {
                var instance = new InstanceModel({
                    name: "server-2",
                    inventory: true,
                    migrated: false,
                    status: "progress",
                    planned: false,
                    type: 'server',
                    attributes: {
                        owner: "Human 2"
                    },
                    applications: [{
                        "app_status" : "progress",
                        "migrated" : false,
                        workflow: {
                            attributes: {
                                owner: "AppOwner2",
                                servicename: "App-1",
                                app_status: "progress"
                            },
                            attributes_instance: {},
                            has_open_work: {},
                            has_app_owner_informed: {
                                checked: true
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
                        },
                        "servicename" : "App-1",
                        "systype" : "app",
                        "attributes" : {
                            "owner" : "AppOwner2"
                        },
                        "inventory" : true,
                        "planned" : true
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



        it('Summary server is returning correct results '
            +'before inventory', function (done) {
            request(app)
                .get(config.url_base + '/server/summary/')
                .set('Cookie', 'jwt=' + config.jwt_token)
                .expect(200)
                .end(function(err, res) {
                    assert.equal(res.body.open, 0);
                    assert.equal(res.body.progress, 2);
                    assert.equal(res.body.done, 0);
                    assert.equal(res.body.valid, 2);
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
                    assert.equal(res.body.open, 1);
                    assert.equal(res.body.progress, 2);
                    assert.equal(res.body.done, 0);
                    assert.equal(res.body.valid, 2);
                    done();
                });
        });


        it('Migrating application of server-2', function(done) {
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
                            has_open_work: {
                                checked: true
                            },
                            has_app_owner_informed: {
                                checked: true
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
                                checked: true,
                                content: [{
                                    new_name: "server-1",
                                    old_name: "server-1-new"
                                }, {
                                    new_name: "server-2",
                                    old_name: "server-2"
                                }]
                            }
                        }
                    })
                    .set('Cookie', 'jwt=' + config.jwt_token)
                    .expect(200)
                    .end(function(err, res) {
                        assert.equal(res.body.code, 3);
                        done();
                    });
            });
        });



        it('Has server status been set to done if empty', function(done) {
            InstanceModel.find({}, function(err, servers) {
                assert.equal(servers[0].status, "done");
                assert.equal(servers[1].status, "progress");
                done();
            });
        });


        it('Has application been removed from servers', function(done) {
            InstanceModel.find({
                migrated: false,
                status:"done"
            }, function(err, servers) {
                for (var i = 0; i < servers.length; i++) {
                    for (var j = 0; j < servers[i].applications.length; j++) {
                        assert.notEqual(
                            servers[i].applications[j].servicename,
                            "App-1"
                        );
                    }
                }
                done();
            });
        });


        it('Has server copied and owning migrated applications', function(done) {
            InstanceModel.find({
                migrated: true,
                status:"done"
            }, function(err, servers) {
                for (var i = 0; i < servers.length; i++) {
                    assert.equal(servers[i].applications.length, 1);
                    assert.equal(
                        servers[i].applications[0].servicename,
                        "App-1"
                    );
                    assert.equal(
                        servers[i].applications[0].migrated,
                        true
                    );
                    assert.equal(
                        servers[i].applications[0].app_status,
                        "done"
                    );
                }
                done();
            });
        });


        it('Summary server is returning correct results', function (done) {
            request(app)
                .get(config.url_base + '/server/summary/')
                .set('Cookie', 'jwt=' + config.jwt_token)
                .expect(200)
                .end(function(err, res) {
                    assert.equal(res.body.open, 0);
                    assert.equal(res.body.progress, 1);
                    assert.equal(res.body.done, 1);
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
                    assert.equal(res.body.done, 2);
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
                    assert.equal(res.body.length, 0);
                    done();
                });
        });


        it('Checking server status and attributes', function(done) {
            InstanceModel.find({migrated: false}, function(err, servers) {
                assert.equal(servers[0].status, "done");
                assert.equal(servers[1].status, "progress");
                assert.equal(servers[0].attributes.owner, "Human 1");
                assert.equal(servers[1].attributes.owner, "Human 2");
                done();
            });
        });


        it('Checking app status and attributes', function(done) {
            InstanceModel.find({migrated: true}, function(err, servers) {
                for (var i = 0; i < servers.length; i++) {
                    assert.equal(servers[i].applications[0].app_status, "done");
                }
                assert.equal(servers[0].applications[0].attributes.owner, "AppOwner1");
                assert.equal(servers[1].applications[0].attributes.owner, "AppOwner2");
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