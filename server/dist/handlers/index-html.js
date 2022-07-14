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
exports.getIndexHTMLHandler = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var configs_1 = require("../configs");
var DEFAULT_FLAG = 'window.ORCHESTRATOR_FLAGS.DEPLOYMENT=null';
var ORCHESTRATOR_CLIENT_PROVIDER = '<script id="orchestrator-client-placeholder"></script>';
var DEFAULT_HIDE_SIDENAV_FLAG = 'window.ORCHESTRATOR_FLAGS.HIDE_SIDENAV=null';
/**
 * Returns a handler which retrieve and modify the index.html.
 * @param options.staticDir serve the static resources in this folder.
 * @param options.deployment whether this is a kubeflow deployment.
 */
function getIndexHTMLHandler(options) {
    var content = replaceRuntimeContent(loadIndexHtml(options.staticDir), options.deployment, options.hideSideNav);
    return function handleIndexHtml(_, res) {
        if (content) {
            res.contentType('text/html');
            res.send(content);
        }
        else {
            res.sendStatus(404);
        }
    };
}
exports.getIndexHTMLHandler = getIndexHTMLHandler;
function loadIndexHtml(staticDir) {
    var filepath = path.resolve(staticDir, 'index.html');
    var content = fs.readFileSync(filepath).toString();
    // sanity checking
    if (!content.includes(DEFAULT_FLAG)) {
        throw new Error("Error: cannot find default flag: '" + DEFAULT_FLAG + "' in index html. Its content: '" + content + "'.");
    }
    if (!content.includes(ORCHESTRATOR_CLIENT_PROVIDER)) {
        throw new Error("Error: cannot find kubeflow client placeholder: '" + ORCHESTRATOR_CLIENT_PROVIDER + "' in index html. Its content: '" + content + "'.");
    }
    if (!content.includes(DEFAULT_HIDE_SIDENAV_FLAG)) {
        throw new Error("Error: cannot find flag: '" + DEFAULT_HIDE_SIDENAV_FLAG + "' in index html. Its content: '" + content + "'.");
    }
    return content;
}
function replaceRuntimeContent(content, deployment, hideSideNav) {
    var contentSafe = content;
    if (contentSafe && deployment === configs_1.Deployments.ORCHESTRATOR) {
        contentSafe = contentSafe
            .replace(DEFAULT_FLAG, 'window.ORCHESTRATOR_FLAGS.DEPLOYMENT="ORCHESTRATOR"')
            .replace(ORCHESTRATOR_CLIENT_PROVIDER, "<script id=\"orchestrator-client-placeholder\" src=\"/dashboard_lib.bundle.js\"></script>");
    }
    if (contentSafe && deployment === configs_1.Deployments.MARKETPLACE) {
        contentSafe = contentSafe.replace(DEFAULT_FLAG, 'window.ORCHESTRATOR_FLAGS.DEPLOYMENT="MARKETPLACE"');
    }
    if (contentSafe) {
        contentSafe = contentSafe.replace(DEFAULT_HIDE_SIDENAV_FLAG, "window.ORCHESTRATOR_FLAGS.HIDE_SIDENAV=" + hideSideNav.toString());
    }
    return contentSafe;
}
//# sourceMappingURL=index-html.js.map