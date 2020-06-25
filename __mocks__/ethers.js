jest.genMockFromModule('ethers');

const ethers = {

  getDefaultProvider: jest.fn(),

  Wallet: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockImplementation((provider) => {}),
    encrypt: jest.fn().mockImplementation((wallet) => Promise.resolve('encryptedWallet')),
  })),
};

module.exports = ethers;
