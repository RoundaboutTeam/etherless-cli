import Configstore from 'configstore';

import { getDefaultProvider } from 'ethers';

import UserSession from '../src/Session/UserSession';
import EthereumUserSession from '../src/Session/EthereumUserSession';

jest.mock('configstore');

const pkg = require('../package.json');

const cfgStore = new Configstore(pkg.name);

const privateKey : string = '0x2bbd8f70ee60484124e3575a06e14527a82d0cca16cb162a1d9ef5df11440e60';
const address : string = '0x1611Ef4B1A22ff3f3fF62Fd86b9059e3679b6212';
const mnemonic : string = 'apple inner trash finger buyer tomorrow abstract donate donor caught high weird';
const password : string = 'password';

const userSession : UserSession = new EthereumUserSession(cfgStore, getDefaultProvider('ropsten'));

test('Login with PrivateKey', () => {
  (cfgStore.set as jest.Mock).mockImplementation(
    (key, value) => 'stored',
  );

  (cfgStore.get as jest.Mock).mockImplementation(
    (key) => null,
  );

  expect(userSession.loginWithPrivateKey(privateKey, password).address).toBe(address);
});

test('Login with Mnemonic', () => {
  (cfgStore.set as jest.Mock).mockImplementation(
    (key, value) => 'stored',
  );

  (cfgStore.get as jest.Mock).mockImplementation(
    (key) => null,
  );

  expect(userSession.loginWithMnemonicPhrase(mnemonic, password).address).toBe(address);
});

test('Login with private key in wrong format', () => {
  (cfgStore.get as jest.Mock).mockImplementation(
    (key) => null,
  );

  expect(() => userSession.loginWithPrivateKey('privateKeyInWrongFormat', password)).toThrowError();
});

test('Login with mnemonic phrase in wrong format', () => {
  (cfgStore.get as jest.Mock).mockReturnValue(null);
  expect(() => userSession.loginWithMnemonicPhrase('mnemonicInWrongFormat', password)).toThrowError();
});

test('Tring login with already logged user (private key)', () => {
  (cfgStore.get as jest.Mock).mockReturnValue('mockedEncryptedWallet');
  expect(() => userSession.loginWithPrivateKey(privateKey, password)).toThrowError();
});

test('Tring login with already logged user (mnemonic phrase)', () => {
  (cfgStore.get as jest.Mock).mockReturnValue('mockedEncryptedWallet');
  expect(() => userSession.loginWithMnemonicPhrase(mnemonic, password)).toThrowError();
});

test('Logout', () => {
  (cfgStore.get as jest.Mock).mockReturnValue('mockedEncryptedWallet');
  expect(() => userSession.logout()).not.toThrowError();
});

test('Logout with no user logged', () => {
  (cfgStore.get as jest.Mock).mockReturnValue(null);
  expect(() => userSession.logout()).toThrowError();
});

test('create new wallet', () => {
  expect(() => userSession.signup()).not.toThrowError();
});

test('Get address', () => {
  (cfgStore.get as jest.Mock).mockReturnValue('mockedAddress');
  expect(userSession.getAddress()).toEqual('mockedAddress');
});

test('Get address from not logged user', () => {
  (cfgStore.get as jest.Mock).mockReturnValue(null);
  expect(() => userSession.getAddress()).toThrowError();
});

test('Restore wallet from not logged user', () => {
  (cfgStore.get as jest.Mock).mockReturnValue(null);
  expect(userSession.restoreWallet(password)).rejects.toThrowError();
});

const mockedEncryptedWallet = '{"address":"1611ef4b1a22ff3f3ff62fd86b9059e3679b6212","id":"ff525029-c1cd-4132-b6b4-4d72fe592f5d","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"6d00947b8ca8a1d7f7d4a190d241d415"},"ciphertext":"90dcb4aaadd5d91601075a0ba9fc4265d4a79e0df20eace99772344eccce991e","kdf":"scrypt","kdfparams":{"salt":"bf58e81e18f1e98d1542be316750b10724bc9bf4762d84c5b066674e41bedb59","n":131072,"dklen":32,"p":1,"r":8},"mac":"7a9ef3a4a03b6fdcc698050d0803d4965c2f30c2367eb6891f36963080012c16"}}';
test('Restore wallet', async () => {
  (cfgStore.get as jest.Mock).mockReturnValue(mockedEncryptedWallet);

  const wallet = await userSession.restoreWallet(password);
  expect(wallet.address).toEqual(address);
}, 10000);
