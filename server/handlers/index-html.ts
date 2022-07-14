import { Handler } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { Deployments } from '../configs';

const DEFAULT_FLAG = 'window.ORCHESTRATOR_FLAGS.DEPLOYMENT=null';
const ORCHESTRATOR_CLIENT_PROVIDER = '<script id="orchestrator-client-placeholder"></script>';
const DEFAULT_HIDE_SIDENAV_FLAG = 'window.ORCHESTRATOR_FLAGS.HIDE_SIDENAV=null';

/**
 * Returns a handler which retrieve and modify the index.html.
 * @param options.staticDir serve the static resources in this folder.
 * @param options.deployment whether this is a kubeflow deployment.
 */
export function getIndexHTMLHandler(options: {
  staticDir: string;
  deployment: Deployments;
  hideSideNav: boolean;
}): Handler {
  const content = replaceRuntimeContent(
    loadIndexHtml(options.staticDir),
    options.deployment,
    options.hideSideNav,
  );

  return function handleIndexHtml(_, res) {
    if (content) {
      res.contentType('text/html');
      res.send(content);
    } else {
      res.sendStatus(404);
    }
  };
}

function loadIndexHtml(staticDir: string) {
  const filepath = path.resolve(staticDir, 'index.html');
  const content = fs.readFileSync(filepath).toString();
  // sanity checking
  if (!content.includes(DEFAULT_FLAG)) {
    throw new Error(
      `Error: cannot find default flag: '${DEFAULT_FLAG}' in index html. Its content: '${content}'.`,
    );
  }
  if (!content.includes(ORCHESTRATOR_CLIENT_PROVIDER)) {
    throw new Error(
      `Error: cannot find kubeflow client placeholder: '${ORCHESTRATOR_CLIENT_PROVIDER}' in index html. Its content: '${content}'.`,
    );
  }
  if (!content.includes(DEFAULT_HIDE_SIDENAV_FLAG)) {
    throw new Error(
      `Error: cannot find flag: '${DEFAULT_HIDE_SIDENAV_FLAG}' in index html. Its content: '${content}'.`,
    );
  }
  return content;
}

function replaceRuntimeContent(
  content: string | undefined,
  deployment: Deployments,
  hideSideNav: boolean,
) {
  let contentSafe = content;
  if (contentSafe && deployment === Deployments.ORCHESTRATOR) {
    contentSafe = contentSafe
      .replace(DEFAULT_FLAG, 'window.ORCHESTRATOR_FLAGS.DEPLOYMENT="ORCHESTRATOR"')
      .replace(
        ORCHESTRATOR_CLIENT_PROVIDER,
        `<script id="orchestrator-client-placeholder" src="/dashboard_lib.bundle.js"></script>`,
      );
  }
  if (contentSafe && deployment === Deployments.MARKETPLACE) {
    contentSafe = contentSafe.replace(DEFAULT_FLAG, 'window.ORCHESTRATOR_FLAGS.DEPLOYMENT="MARKETPLACE"');
  }
  if (contentSafe) {
    contentSafe = contentSafe.replace(
      DEFAULT_HIDE_SIDENAV_FLAG,
      `window.ORCHESTRATOR_FLAGS.HIDE_SIDENAV=${hideSideNav.toString()}`,
    );
  }
  return contentSafe;
}