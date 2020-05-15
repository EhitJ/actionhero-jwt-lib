"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actionhero_1 = require("actionhero");
var jsonwebtoken = require('jsonwebtoken');
class MyInitializer extends actionhero_1.Initializer {
    constructor() {
        super();
        this.name = "ehitjInit";
        this.loadPriority = 1000;
        this.startPriority = 1000;
        this.stopPriority = 1000;
    }
    async initialize() {
        actionhero_1.api["ehitjInit"] = {};
        actionhero_1.api.ehitjInit.processToken = async (token, connection) => {
            return new Promise((resolve, reject) => {
                jsonwebtoken.verify(token, actionhero_1.config.jwtauth.secret, {}, function (err, data) {
                    if (err) {
                        reject(new Error("AUTH FAILED"));
                    }
                    else {
                        resolve(data);
                    }
                });
            }).catch(function (err) {
                throw new Error("AUTH FAILED");
            });
        };
        actionhero_1.api.ehitjInit.generateToken = (data, options) => {
            return new Promise((resolve, reject) => {
                if (typeof (options) == 'function') {
                    options = {};
                }
                else {
                    options = options || {};
                }
                if (!options.algorithm) {
                    options.algorithm = actionhero_1.config.jwtauth.algorithm;
                }
                try {
                    var token = jsonwebtoken.sign(data, actionhero_1.config.jwtauth.secret, options);
                    resolve(token);
                }
                catch (err) {
                    reject(new Error("Token generation failed"));
                }
            }).catch(function (err) {
                throw new Error("Token generation failed");
            });
        };
        actionhero_1.api.ehitjInit.middleware = {
            name: 'ehitjInit',
            global: true,
            preProcessor: async (data) => {
                var tokenRequired = false;
                if (data.actionTemplate.authenticated && actionhero_1.config.jwtauth.enabled[data.connection.type]) {
                    tokenRequired = true;
                }
                console.log(tokenRequired);
                var token = '';
                var req = {
                    headers: data.params.httpHeaders || (data.connection.rawConnection.req ? data.connection.rawConnection.req.headers : undefined) || data.connection.mockHeaders || {},
                    uri: data.connection.rawConnection.req ? data.connection.rawConnection.req.uri : {}
                };
                var authHeader = req.headers.authorization || req.headers.Authorization || false;
                // extract token from http headers
                if (authHeader) {
                    var parts = authHeader.split(' ');
                    if (parts.length != 2 || parts[0].toLowerCase() !== 'token') {
                        // return error if token was required and missing
                        if (tokenRequired) {
                            throw Error('Invalid Authorization Header');
                        }
                    }
                    token = parts[1];
                }
                if (!token && actionhero_1.config.jwtauth.enableGet && req.uri.query && req.uri.query.token) {
                    token = req.uri.query.token;
                }
                if (tokenRequired && !token) {
                    throw Error('Authorization Header Not Set');
                }
                // process token and save in connection
                else if (token) {
                    await actionhero_1.api.ehitjInit.processToken(token, data.connection).then((x) => {
                        data.connection._jwtTokenData = x;
                    }).catch((err) => {
                        throw Error('Authorization Token invalid');
                    });
                }
                else {
                    return true;
                }
            }
        };
        actionhero_1.action.addMiddleware(actionhero_1.api.ehitjInit.middleware);
    }
    async start() { }
    async stop() { }
}
exports.MyInitializer = MyInitializer;
