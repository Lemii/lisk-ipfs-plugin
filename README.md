# @lemii/lisk-ipfs-plugin

Lisk IPFS is a plugin that enables your Lisk node to upload and download files from the IPFS network. When using the plugin, your Lisk node will act as a unique IPFS node.

## Installation

#### Install package

```sh
$ npm install --save @lemii/lisk-ipfs-plugin
```

#### Register plugin

```js
app.registerPlugin(IpfsPlugin);
```

#### Register plugin with custom options

```js
app.registerPlugin(IpfsPlugin, {
  limiterMax: 3,
  limiterWindow: 1000,
  port: 3200,
  logFile: 'lisk-ipfs.log'
});
```

## Usage

#### Download data from from the IPFS network

`http://localhost:3200/ipfs/QmU9QGUHCdeyuHxAyaVhzTLCQZcRx5xWDnzkUF6ZtTYXiH`

`http://localhost:3200/ipfs/Qmf412jQZiuVUtdgnB36FXFX7xg5V6KEbSJ4dpQuhkLyfD`

#### Upload a file to IPFS:

Method: `POST`  
Path: `http://localhost:3200/ipfs/upload/file`  
Payload: File in `file` field of `form-data`

Result:

```json
{
    "path": "QmU9QGUHCdeyuHxAyaVhzTLCQZcRx5xWDnzkUF6ZtTYXiH",
    "cid": {
        "codec": "dag-pb",
        "version": 0,
        "hash": {
            ...
        }
    },
    "size": 98908,
    "mode": 420
}
```

#### Upload text to IPFS:

Method: `POST`  
Path: `http://localhost:3200/ipfs/upload/text`  
Payload: Plain text in `body` of request

Result:

```json
{
    "path": "Qmf412jQZiuVUtdgnB36FXFX7xg5V6KEbSJ4dpQuhkLyfD",
    "cid": {
        "codec": "dag-pb",
        "version": 0,
        "hash": {
            ...
        }
    },
    "size": 19,
    "mode": 420
}
```
