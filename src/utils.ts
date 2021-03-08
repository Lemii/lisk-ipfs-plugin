import * as appRoot from 'app-root-path';

export const getPath = (filename: string) => {
  return `${appRoot}/${filename}`;
};
