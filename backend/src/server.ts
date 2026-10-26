import express from 'express';
import type { Config } from './config.js';
import type { MaestrozoPlatform } from '../../platform/dist/platform.js';

const startServer = (config: Config, _platform: MaestrozoPlatform, _verbose = false): Promise<void> => {

  return new Promise( (resolve, reject): void => {

    const port = config.server.port;
    const app = express();
    app.use(express.json());

    app.get('/', (_req, res) => {
        res.json({
            name: config.general.name,
            description: config.general.description,
        });
    });

    const httpServer = app.listen(port);

    httpServer.once('listening', () => {
      console.log(
        `${config.general.description} is listening on port ${port}`
      );
      resolve();
    });

    httpServer.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        reject(new Error(`Port ${port} is already in use`, {cause: error}));
      } else {
        reject(error);
      }
    });
  });

}

export { startServer };
