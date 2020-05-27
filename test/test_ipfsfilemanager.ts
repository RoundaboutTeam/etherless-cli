import { expect, assert } from 'chai';
import { describe, it } from 'mocha';

import IPFSFileManager from '../src/IPFS/IPFSFileManager';

const ipfs : IPFSFileManager = new IPFSFileManager();

describe('IPFSFileManager', () => {
  it('save and get are working', async () => {
    const info : Buffer = Buffer.from('Hello world', 'hex');
    const cid : string = await ipfs.save(info);
    const result : Buffer = await ipfs.get(cid);
    assert.equal(info, result);
  });
});
