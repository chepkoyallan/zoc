import * as path from 'path';
export const BASEPATH = '/pipeline';
export const apiVersion = 'v1beta1';
export const apiVersionPrefix = `apis/${apiVersion}`;

/** converts string to bool */
const asBool = (value: string) => ['true', '1'].includes(value.toLowerCase());

function parseArgs(argv: string[]) {
    if (argv.length < 3) {
      const msg = `\
    Usage: node server.js <static-dir> [port].
           You can specify the API server address using the
           ORCHESTRATOR_SERVICE_HOST and ORCHESTRATOR_SERVICE_PORT
           env vars.`;
      throw new Error(msg);
    }
  
    const staticDir = path.resolve(argv[2]);
    const port = parseInt(argv[3] || '3000', 10);
    return { staticDir, port };
}

export type ProcessEnv = NodeJS.ProcessEnv | {[key: string]: string}



export function loadConfigs(argv: string[], env: ProcessEnv): UIConfigs {
    const {staticDir, port} = parseArgs(argv);

    const {
        /** Deployment type. */
        DEPLOYMENT: DEPLOYMENT_STR = '',

        /**
         * Set to true to hide the SideNav. When DEPLOYMENT is ORCHESTRATOR, HIDE_SIDENAV
         * defaults to true if not explicitly set to false.
         */
        HIDE_SIDENAV,
    } = env;

    return {
        server: {
            apiVersionPrefix,
            basePath: BASEPATH,
            deployment:
              DEPLOYMENT_STR.toUpperCase() === Deployments.ORCHESTRATOR
                ? Deployments.ORCHESTRATOR
                : DEPLOYMENT_STR.toUpperCase() === Deployments.MARKETPLACE
                ? Deployments.MARKETPLACE
                : Deployments.NOT_SPECIFIED,
            hideSideNav:
              HIDE_SIDENAV === undefined
                ? DEPLOYMENT_STR.toUpperCase() === Deployments.ORCHESTRATOR
                : asBool(HIDE_SIDENAV),
            port,
            staticDir,
          },
    }

}


export enum Deployments {
    NOT_SPECIFIED = 'NOT_SPECIFIED',
    ORCHESTRATOR = 'ORCHESTRATOR',
    MARKETPLACE = 'MARKETPLACE'
}

export interface ServerConfigs {
    basePath: string;
    port: string | number;
    staticDir: string;
    apiVersionPrefix: string;
    deployment: Deployments;
    hideSideNav: boolean;
}

export interface UIConfigs {
    server: ServerConfigs;
}