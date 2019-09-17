const request         = require('supertest');
const should          = require('should');
const config          = require('../../../config');
const assert          = require('assert');
const InstanceModel   = require('../../../../src/models/instance');
const HistoryModel    = require('../../../../src/models/history');


module.exports = function(app) {
	describe('serverInventory', function () {
        before(function (done) {
            var instance = new InstanceModel({
                name: "server-empty-1",
                inventory: true,
                migrated: false,
                status: "progress",
                planned: true,
                type: 'server',
                attributes: {
                    owner: "Human 1"
                },
                workflow: {
                    attributes: {
                        owner: "Human 1",
                        name: "server-empty-1"
                    },
                    attributes_instance: {},
                    has_open_work: {},
                    has_system_owner_informed: {
                        checked: true
                    },
                    is_app_owner_known: {},
                    is_system_owner_known: {
                        checked: true
                    },
                    planning_end: {
                        checked: true
                    },
                    planning_start: {
                        checked: true
                    },
                    was_test_migration_executed: {
                    },
                    was_test_migration_possible: {
                        checked: true
                    }
                }
            });
            instance.save(function(err, saved) {
                var instance = new InstanceModel({
                    name: "server-empty-2",
                    inventory: true,
                    migrated: false,
                    status: "progress",
                    planned: true,
                    type: 'server',
                    attributes: {
                        owner: "Human 2"
                    },
                    workflow: {
                    attributes: {
                        owner: "Human 2",
                        name: "server-empty-1"
                    },
                    attributes_instance: {},
                    has_open_work: {},
                    has_system_owner_informed: {
                        checked: true
                    },
                    is_app_owner_known: {},
                    is_system_owner_known: {
                        checked: true
                    },
                    planning_end: {
                        checked: true
                    },
                    planning_start: {
                        checked: true
                    },
                    was_test_migration_executed: {
                    },
                    was_test_migration_possible: {
                        checked: true
                    }
                }
                });
                instance.save(function(err, saved) {
                    done();
                });
            });
        });


        it('Init summary showing correct', function (done) {
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


        it('Migrating server-empty-1', function (done) {
            InstanceModel.findOne({"name": "server-empty-1"},
                    function(err, mockServer) {
                request(app)
                    .post(config.url_base + '/workflow/server/migrate/')
                    .send({
                        category: 'server',
                        server_id: mockServer._id,
                        workflow: {
                            attributes: {
                                owner: "Human 1",
                                name: "server-empty-1"
                            },
                            attributes_instance: {
                                checked: true
                            },
                            has_open_work: {
                                checked: true
                            },
                            has_system_owner_informed: {
                                checked: true
                            },
                            is_app_owner_known: {
                                checked: true
                            },
                            is_system_owner_known: {
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
                                    new_name: "server-empty-1-new",
                                    old_name: "server-empty-1"
                                }]
                            }
                        }
                    })
                    .set('Cookie', 'jwt=' + config.jwt_token)
                    .expect(200)
                    .end(function(err, res) {
                        assert.equal(res.body.message, "Server has been updated and "
                            + "status has been changed.");
                        done();
                    });
            });
        });


        // Just inventory, we don't expect a change.
        it('After Migration check summary', function (done) {
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


        it('Checking if status is set to done', function (done) {
            InstanceModel.findOne({"name": "server-empty-1"},
                    function(err, mockServer) {
                request(app)
                    .get(config.url_base + '/server/' + mockServer._id)
                    .set('Cookie', 'jwt=' + config.jwt_token)
                    .expect(200)
                    .end(function(err, res) {
                        assert.equal(res.body.inventory, true);
                        assert.equal(res.body.planned, true);
                        assert.equal(res.body.status, "done");
                        done();
                    });
            });
        });


        it('Checking if server has been copied and added to migrated',
                function (done) {
            InstanceModel.findOne({"name": "server-empty-1"},
                    function(err, mockServer) {
                request(app)
                    .get(config.url_base + '/server/migrated/')
                    .set('Cookie', 'jwt=' + config.jwt_token)
                    .expect(200)
                    .end(function(err, res) {
                        // we only have one!
                        const server = res.body[0];
                        assert.equal(server.name, "server-empty-1-new");
                        assert.equal(server.migrated, true);
                        done();
                    });
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