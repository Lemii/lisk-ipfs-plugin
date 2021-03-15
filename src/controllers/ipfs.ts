import { Request, Response } from 'express';
import { addIpfsAsset, fetchIpfsAsset, getIpfsNode } from '../services';
import { isIPFS } from 'ipfs-core';
import FileType from 'file-type';

export const downloadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const cid = req.params.cid;

    if (!cid || !isIPFS.cid(cid)) {
      res.status(400).send('Invalid cid specified');
    } else {
      const node = await getIpfsNode();
      const data = await fetchIpfsAsset(node, cid);
      const type = await FileType.fromBuffer(data);

      if (type) {
        res.status(200).send(data);
      } else {
        res.set('Content-Type', 'text/plain').status(200).send(data.toString());
      }
    }
  } catch (err) {
    res.status(500).send('Could not download file');
  }
};

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.file;

    if (!data) {
      res.status(400).send('No file detected in request');
    } else {
      const node = await getIpfsNode();

      const ipfsAsset = await addIpfsAsset(node, data.buffer);

      res.status(201).send(ipfsAsset);
    }
  } catch (err) {
    res.status(500).send('Could not upload file');
  }
};

export const uploadText = async (req: Request, res: Response): Promise<void> => {
  try {
    const text = req.body;

    if (!text) {
      res.status(400).send('No text specified');
    } else {
      const node = await getIpfsNode();

      const ipfsAsset = await addIpfsAsset(node, text);

      res.status(201).send(ipfsAsset);
    }
  } catch (err) {
    res.status(500).send('Could not upload text');
  }
};
