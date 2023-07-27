import express, { Express } from 'express';
import { websocket } from './websocket';

const app: Express = express();
const port = 5561;

const server = app.listen(port, async () => {
  try {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);

    websocket.connect(server);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});
