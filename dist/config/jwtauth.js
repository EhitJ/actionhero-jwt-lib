"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.DEFAULT = {
    jwtauth: config => {
        return {
            enabled: {
                web: true,
                websocket: true,
                socket: false,
                testServer: false
            },
            secret: 'sfjkgsdkagfdg',
            algorithm: 'HS512',
            enableGet: false // enables token as GET parameters in addition to Authorization headers
        };
    }
};
