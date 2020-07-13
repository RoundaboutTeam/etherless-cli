import IPFSFileManager from '../../src/IPFS/IPFSFileManager';
import DeployInfo from '../../src/IPFS/DeployInfo';

jest.mock('ipfs-mini');

const IPFS = require('ipfs-mini');

const ipfsMiniMock = new IPFS.Ipfs();
const ipfsManager : IPFSFileManager = new IPFSFileManager(ipfsMiniMock);

test('get correctly returns result', async () => {
  const depInfo = await ipfsManager.get('CID');
  expect(depInfo).toBeDefined();
});

test('get correctly manages exception', async () => {
  ipfsMiniMock.catJSON = jest.fn().mockImplementationOnce(
    () => Promise.reject(new Error('some ipfs error')),
  );

  try {
    await ipfsManager.get('some CID');
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
  }
});

test('saveOnIpfs correctly returns result', async () => {
  const path = await ipfsManager.save({
    dep: true,
    package: 'package content',
    package_lock: 'package_lock info',
    sourceCode: 'source code of function',
  });
  expect(path).toBe('mocked CID');
});

test('saveOnIpfs correctly manages exception', async () => {
  ipfsMiniMock.addJSON = jest.fn().mockImplementationOnce(
    () => Promise.reject(new Error('Unable to upload file on IPFS')),
  );

  try {
    await ipfsManager.save({
      dep: true,
      package: 'package content',
      package_lock: 'package_lock info',
      sourceCode: 'source code of function',
    });
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
  }
});
