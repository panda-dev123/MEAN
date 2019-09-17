const request         = require('supertest');
const should          = require('should');
const config          = require('../../../config');
const assert          = require('assert');
const Migration       = require('../../../../src/classes/workflow/Migration');
const WFMeta          = require('../../../../src/models/workflow');
const WFM             = require('../../../../src/classes/workflow/Workflow');


module.exports = function(app) {
    const meta = WFMeta;
    var workflow = {
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
    };
    var WorkflowM = new WFM(workflow, "server");
    var object = new Migration(
        WorkflowM.filterByCategory("migration"),
        workflow
    );


    describe('Class Migration', function () {
        it('Is complete', function(done) {
            assert.equal(object.isComplete(), true);
            done();
        });


        it('Is not complete', function(done) {
            var _workflow = JSON.parse(JSON.stringify(workflow));
            _workflow.was_test_migration_successfull.checked = undefined;

            var _object = new Migration(
                WorkflowM.filterByCategory("migration"),
                _workflow
            );
            assert.equal(_object.isComplete(), false);
            done();
        });


        it('Has error', function(done) {
            var _workflow = JSON.parse(JSON.stringify(workflow));
            _workflow.was_test_migration_successfull.checked = false;

            var _object = new Migration(
                WorkflowM.filterByCategory("migration"),
                _workflow
            );
            assert.equal(_object.hasError(), true);
            done();
        });


        it('Has not error', function(done) {
            var _workflow = JSON.parse(JSON.stringify(workflow));

            var _object = new Migration(
                WorkflowM.filterByCategory("migration"),
                _workflow
            );
            assert.equal(_object.hasError(), false);
            done();
        });


        it('Can get instance names', function(done) {
            assert.equal(object.getInstanceNewName("server-empty-1"), "server-empty-1-new");
            assert.equal(object.getInstanceNewName("hey"), "");
            done();
        });
    });
};