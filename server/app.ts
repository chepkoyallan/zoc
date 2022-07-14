import path from 'path';
import express from 'express';
import { UIConfigs } from "./configs";
import { Application } from "express";
import { getIndexHTMLHandler } from "./handlers/index-html";
import { Server } from "http";

function getRegisterHandler(app: Application, basePath: string) {
    return (
      func: (name: string | string[], handler: express.Handler) => express.Application,
      route: string | string[],
      handler: express.Handler,
    ) => {
      func.call(app, route, handler);
      return func.call(app, `${basePath}${route}`, handler);
    };
  }

/**
 * UIServer wraps around a express application to:
 * - proxy requests to ml-pipeline api server
 * - retrieve artifacts from the various backend
 * - create and retrieve new viewer instances
 * - serve static front-end resources (i.e. react app)
 */
export class UIServer {
    app: Application;
    httpServer?: Server;

    constructor(public readonly options: UIConfigs) {
        this.app = createUIServer(options);
    }

    /**
     * Starts the http server.
     * @param port optionally overwrite the provided port to listen to.
     */
    start(port?: number | string) {
        if (this.httpServer) {
        throw new Error('UIServer already started.');
        }
        port = port || this.options.server.port;
        this.httpServer = this.app.listen(port, () => {
        console.log('Server listening at http://localhost:' + port);
        });
        return this.httpServer;
    }

    /**
     * Stops the http server.
     */
    close() {
        if (this.httpServer) {
        this.httpServer.close();
        }
        this.httpServer = undefined;
        return this;
    }
}

 /**
   * Modify index.html.
   * These pathes can be matched by static handler. Putting them before it to
   * override behavior for index html.
   */
function createUIServer(options: UIConfigs) {
    const currDir = path.resolve(__dirname)
    const basePath = options.server.basePath;
    const app: Application = express();
    const registerHandler = getRegisterHandler(app, basePath);


    /** log to stdout */
    app.use((req, _, next) => {
      console.info(req.method + ' ' + req.originalUrl);
      next();
    });


    // Index handler
    const indexHtmlHandler = getIndexHTMLHandler(options.server);
    registerHandler(app.get, '/', indexHtmlHandler);
    registerHandler(app.get, '/index.html', indexHtmlHandler);
    
    return app;
}