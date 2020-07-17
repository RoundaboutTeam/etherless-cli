jest.genMockFromModule('ipfs-mini');

const IPFS = {
  Ipfs: jest.fn().mockImplementation(() => ({
    catJSON: jest.fn((cid) => Promise.resolve(
      {
        dep: true,
        package: 'package content',
        package_lock: 'package_lock info',
        sourceCode: 'source code of function',
      },
    )),
    addJSON: jest.fn((data) => Promise.resolve('mocked CID')),
  })),
};

module.exports = IPFS;
