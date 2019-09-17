"use strict";


/**
 *  Setting mode of server.
 *  'dev' for development and 'prod' for production.
 */
process.env.NODE_ENV = "dev";


/**
 *  Global configuration file
 *  Copy and remove the "_" from the ending of this filename.
 */
const config = {
    port: 3000,
    url: "api/v1",
    cors_url: "*",
    database_address: "mongodb://127.0.0.1/moveit",
    upload_dir: "queue",
    upload_limit: "100mb",
    ldap: {
        url: "ldap://ldap.forumsys.com:389",
        user: "cn=read-only-admin,dc=example,dc=com",
        password: "password",
        search: 'dc=example,dc=com'
    },
    jwt: {
        private: "key.pem",
        public: "csr.pem",
        options: {
            algorithm:  "RS256"
        }
    },
    log_dir: "logs",
    log_level: "verbose",
    app_settings: {
        app_key_field: "servicename",
        // mandatory fields for status to be completed
        // required field are attributes which needs
        // to be filled at least in planning.
        meta: {
            server: {
                mandatory: ["name"],
                required: ["owner"],
                key: "name",
                status: "status",
                error_entry: "NV"
            },
            application: {
                mandatory: ["servicename"],
                required: ["owner"],
                key: "servicename",
                status: "app_status",
                error_entry: "NV"
            },
            component: []
        }
    }
};

config.app_settings.meta.applications = config.app_settings.meta.application;


module.exports = config;