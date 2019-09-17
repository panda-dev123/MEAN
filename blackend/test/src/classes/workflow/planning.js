const request         = require('supertest');
const should          = require('should');
const config          = require('../../../config');
const assert          = require('assert');
const Planning        = require('../../../../src/classes/workflow/Planning');
const WFMeta          = require('../../../../src/models/workflow');
const WFM             = require('../../../../src/classes/workflow/Workflow');


module.exports = function(app) {
    const meta = WFMeta;
    var workflow = {
        has_system_owner_informed: {
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
        was_test_migration_possible: {
            checked: true
        }
    };
    var WorkflowM = new WFM(workflow, "server");
    var object = new Planning(
        WorkflowM.filterByCategory("planning"),
        workflow
    );


    describe('Class Planning', function () {
        it('Is complete', function(done) {
            assert.equal(object.isComplete(), true);
            done();
        });


        it('Is not complete', function(done) {
            var _workflow = JSON.parse(JSON.stringify(workflow));
            _workflow.is_system_owner_known.checked = false;

            var _object = new Planning(
                WorkflowM.filterByCategory("planning"),
                _workflow
            );
            assert.equal(_object.isComplete(), false);
            done();
        });


        it('Has no error', function(done) {
            assert.equal(object.hasError(), false);
            done();
        });


        it('Has error', function(done) {
            var _workflow = JSON.parse(JSON.stringify(workflow));
            _workflow.is_system_owner_known.checked = false;

            var _object = new Planning(
                WorkflowM.filterByCategory("planning"),
                _workflow
            );
            assert.equal(_object.hasError(), true);
            done();
        });
    });
};