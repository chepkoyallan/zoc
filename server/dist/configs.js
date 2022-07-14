"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deployments = exports.loadConfigs = exports.apiVersionPrefix = exports.apiVersion = exports.BASEPATH = void 0;
var path = __importStar(require("path"));
exports.BASEPATH = '/pipeline';
exports.apiVersion = 'v1beta1';
exports.apiVersionPrefix = "apis/" + exports.apiVersion;
/** converts string to bool */
var asBool = function (value) { return ['true', '1'].includes(value.toLowerCase()); };
function parseArgs(argv) {
    if (argv.length < 3) {
        var msg = "    Usage: node server.js <static-dir> [port].\n           You can specify the API server address using the\n           ORCHESTRATOR_SERVICE_HOST and ORCHESTRATOR_SERVICE_PORT\n           env vars.";
        throw new Error(msg);
    }
    var staticDir = path.resolve(argv[2]);
    var port = parseInt(argv[3] || '3000', 10);
    return { staticDir: staticDir, port: port };
}
function loadConfigs(argv, env) {
    var _a = parseArgs(argv), staticDir = _a.staticDir, port = _a.port;
    var 
    /** Deployment type. */
    _b = env.DEPLOYMENT, 
    /** Deployment type. */
    DEPLOYMENT_STR = _b === void 0 ? '' : _b, 
    /**
     * Set to true to hide the SideNav. When DEPLOYMENT is ORCHESTRATOR, HIDE_SIDENAV
     * defaults to true if not explicitly set to false.
     */
    HIDE_SIDENAV = env.HIDE_SIDENAV;
    return {
        server: {
            apiVersionPrefix: exports.apiVersionPrefix,
            basePath: exports.BASEPATH,
            deployment: DEPLOYMENT_STR.toUpperCase() === Deployments.ORCHESTRATOR
                ? Deployments.ORCHESTRATOR
                : DEPLOYMENT_STR.toUpperCase() === Deployments.MARKETPLACE
                    ? Deployments.MARKETPLACE
                    : Deployments.NOT_SPECIFIED,
            hideSideNav: HIDE_SIDENAV === undefined
                ? DEPLOYMENT_STR.toUpperCase() === Deployments.ORCHESTRATOR
                : asBool(HIDE_SIDENAV),
            port: port,
            staticDir: staticDir,
        },
    };
}
exports.loadConfigs = loadConfigs;
var Deployments;
(function (Deployments) {
    Deployments["NOT_SPECIFIED"] = "NOT_SPECIFIED";
    Deployments["ORCHESTRATOR"] = "ORCHESTRATOR";
    Deployments["MARKETPLACE"] = "MARKETPLACE";
})(Deployments = exports.Deployments || (exports.Deployments = {}));
//# sourceMappingURL=configs.js.map