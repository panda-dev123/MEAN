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
                inventory: false,
                migrated: false,
                status: "open",
                planned: false,
                type: 'server',
                attributes: {
                    owner: "Human 1"
                },
                workflow: {}
            });
            instance.save(function(err, saved) {
                var instance = new InstanceModel({
                    name: "server-empty-2",
                    inventory: false,
                    migrated: false,
                    status: "open",
                    planned: false,
                    type: 'server',
                    attributes: {
                        owner: "Human 2"
                    },
                    workflow: {}
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
                    assert.equal(res.body.open, 2);
                    assert.equal(res.body.progress, 0);
                    assert.equal(res.body.done, 0);
                    assert.equal(res.body.valid, 0);
                    done();
                });
        });


        it('Inventory in progress for server-empty-1', function (done) {
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
                                name: "server-empty-1",
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
                        assert.equal(res.body.message, "Server has been updated and "
                            + "status has been changed.");
                        done();
                    });
            });
        });


        it('Checking history for inventory', function (done) {
            request(app)
                .get(config.url_base + '/history/0/5/')
                .set('Cookie', 'jwt=' + config.jwt_token)
                .expect(200)
                .end(function(err, res) {
                    assert.equal(res.body.length, 1);
                    assert.equal(res.body[0].instance_name, "server-empty-1");
                    assert.equal(res.body[0].action_tag, "inventory");
                    assert.equal(res.body[0].type, "server");
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