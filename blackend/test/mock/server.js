module.exports = class Instance {
    constructor(name, type) {
        this.name = name;
        this.attributes = {
            systype: type
        };
        this.type = type;
        this.components = [];
        this.applications = [];
        this.comments = [];
        this.status = "open";
        this.migrated = false;
        this.planned = false;
        this.inventory = false;
        this.workflow = {};
    };
};

    "applications" : [{
            "app_status" : "open",
            "migrated" : false,
            "workflow" : {
                "was_test_migration_successfull" : {
                    "content" : [ ]
                },
            },
            "servicename" : "app-1",
            "systype" : "Server"
        }
    ],
  