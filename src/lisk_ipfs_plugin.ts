import { spawnNode } from './services';
import { Server } from 'http';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import * as controllers from './controllers';
import * as middlewares from './middlewares';
import { BasePlugin, PluginInfo, BaseChannel, EventsDefinition, ActionsDefinition } from 'lisk-sdk';
import { apiDefaults, loggerDefaults } from './defaults';
import { Options } from './types';
import { createLogger, Logger } from 'lisk-framework/dist-node/logger/logger';
import { getPath } from './utils';

export class IpfsPlugin extends BasePlugin {
  private _server!: Server;
  private _app!: Express;
  private _channel!: BaseChannel;
  private _options!: Options;
  private _logger!: Logger;

  public static get alias(): string {
    return 'ipfs';
  }

  public static get info(): PluginInfo {
    return {
      author: 'lemii <info@lisktools.eu>',
      version: '0.1.0',
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
    this._app = express();
    this._channel = channel;
    this._options = this.options;

    this._setupLogger();

    this._channel.once('app:ready', async () => {
      this._registerMiddlewares();
      this._registerControllers();

      await spawnNode();
      this._logger.info('IPFS successfully started');

      this._server = this._app.listen(this._options.port || apiDefaults.port, '0.0.0.0');
    });
  }

  public async unload(): Promise<void> {
    await new Promise((resolve, reject) => {
      this._server.close(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve(undefined);
      });
    });
  }
  private _registerMiddlewares(): void {
    this._app.use(helmet());
    this._app.use(bodyParser.text());
    this._app.use(middlewares.limiter(this.options));
    this._app.use(middlewares.logger(this._logger));
    this._app.use(middlewares.cors);
  }

  private _registerControllers(): void {
    this._app.get('/ipfs/:cid', controllers.downloadFile);
    this._app.post('/ipfs/upload/file', middlewares.upload.single('file'), controllers.uploadFile);
    this._app.post('/ipfs/upload/text', controllers.uploadText);
  }

  private _setupLogger(): void {
    this._logger = createLogger({
      fileLogLevel: 'info',
      consoleLogLevel: 'info',
      logFilePath: getPath(this._options.logFile || loggerDefaults.logFile),
      module: 'ipfs'
    });
  }
}
