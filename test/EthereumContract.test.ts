import { ethers, getDefaultProvider } from 'ethers';

import EtherlessContract from '../src/EtherlessContract/EtherlessContract';
import EthereumContract from '../src/EtherlessContract/EthereumContract';
import BriefFunction from '../src/EtherlessContract/BriefFunction';


jest.mock('ethers/contract');

const ESmart = require('../contracts/EtherlessSmart.json');

const contract = new ethers.Contract(
  '0x7eAF55b6E2126f7931aeC056C7839716b804c767',
  ESmart.abi,
  getDefaultProvider('ropsten'),
);

const ethereumContract : EtherlessContract = new EthereumContract(contract);

const briefFunction : BriefFunction = { name: 'f1', signature: '()', price: 10 };

test('get all function', () => {
  

  (contract.getFuncList as jest.Mock).mockReturnValue(JSON.stringify(briefFunction));
  expect(ethereumContract.getAllFunctions).resolves.toEqual(Array<BriefFunction>(briefFunction));
});

test('get all functions owned', () => {

});

test('get function info', () => {

});

test('send run request', () => {

});

test('send delete request', () => {

});

test('update description', () => {

});

test('send deploy request', () => {

});

test('listen response success', () => {

});

test('listen response error', () => {

});
