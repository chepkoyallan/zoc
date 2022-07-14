"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var configs_1 = require("./configs");
var configs = configs_1.loadConfigs(process.argv, process.env);
if (process.env.NODE_ENV !== 'test') {
    console.log(__assign(__assign({}, configs), { artifacts: 'Artifacts config contains credentials, so it is omitted' }));
}
var app = new app_1.UIServer(configs);
app.start();
//# sourceMappingURL=server.js.map