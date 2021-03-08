import ipfs, { IPFS } from 'ipfs-core';

let ipfsNode: IPFS;

export const getIpfsNode = async () => {
  if (!ipfsNode) {
    await spawnNode();
  }

  return ipfsNode;
};

export const spawnNode = async () => {
  ipfsNode = await ipfs.create({ silent: true });
};

export const addIpfsAsset = async (node: IPFS, data: string | Buffer) => {
  return node.add(data);
};

export const fetchIpfsAsset = async (node: IPFS, cid: string) => {
  const content = [];
  const stream = node.get(cid);

  for await (const file of stream) {
    // @ts-ignore
    if (!file.content) continue;

    // @ts-ignore
    for await (const chunk of file.content) {
      content.push(chunk);
    }
  }

  return Buffer.concat(content);
};
