import IPFSFileManager from '../src/IPFS/IPFSFileManager';

const ipfs : IPFSFileManager = new IPFSFileManager();

describe('IPFSFileManager', () => {
  test('saving and reading file from IPFS', async () => {
    const info : Buffer = Buffer.from('Hello world', 'utf-8');
    const cid : string = await ipfs.save(info);
    const result : Buffer = await ipfs.get(cid);
    expect(result).toStrictEqual(info);
  },5000);
});
