import { spawnNode } from './services';
import { Server } from 'http';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import * as controllers from './controllers';
import * as middlewares from './middlewares';
import { BasePlugin, PluginInfo, BaseChannel, EventsDefinition, ActionsDefinition } from 'lisk-sdk';
import { apiDefaults } from './defaults';
import { Options } from './types';

export class IpfsPlugin extends BasePlugin {
  private _server!: Server;
  private _app!: Express;
  private _channel!: BaseChannel;

  public static get alias(): string {
    return 'ipfs';
  }

  public static get info(): PluginInfo {
    return {
      author: 'lemii <info@lisktools.eu>',
      version: '0.2.1',
      name: '@lemii/lisk-ipfs-plugin'
    };
  }

  public get defaults(): object {
    return {};
  }

  public get events(): EventsDefinition {
    return [];
  }

  public get actions(): ActionsDefinition {
    return {};
  }

  public async load(channel: BaseChannel): Promise<void> {
    const options = this.options as Options;

    this._app = express();
    this._channel = channel;

    this._channel.once('app:ready', async () => {
      this._registerMiddlewares();
      this._registerControllers();

      await spawnNode();
      this._logger.info('IPFS node successfully started');

      const port = options.port || apiDefaults.port;
      this._server = this._app.listen(port, '0.0.0.0', () => {
        this._logger.info(`API server running on port ${port}`);
      });
    });
  }

  public async unload(): Promise<void> {
    await new Promise((resolve, reject) => {
      this._server.close(err => {
        if (err) {
          reject(err);
          return;
        }
        this._logger.info(`API server closed`);
        resolve(undefined);
      });
    });
  }
  private _registerMiddlewares(): void {
    this._app.use(helmet());
    this._app.use(bodyParser.text());
    this._app.use(middlewares.limiter(this.options as Options));
    this._app.use(middlewares.logger(this._logger));
    this._app.use(middlewares.cors);
  }

  private _registerControllers(): void {
    this._app.get('/ipfs/:cid', controllers.downloadFile);
    this._app.post('/ipfs/upload/file', middlewares.upload.single('file'), controllers.uploadFile);
    this._app.post('/ipfs/upload/text', controllers.uploadText);
  }
}
