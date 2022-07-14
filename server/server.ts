import { UIServer } from "./app";
import { loadConfigs } from "./configs";


const configs = loadConfigs(process.argv, process.env)

if (process.env.NODE_ENV !== 'test') {
    console.log({
      ...configs,
      artifacts: 'Artifacts config contains credentials, so it is omitted',
    });
  }

const app = new UIServer(configs)
app.start();