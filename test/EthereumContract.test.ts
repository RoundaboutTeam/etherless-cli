import EtherlessContract from '../src/EtherlessContract/EtherlessContract';
import EthereumContract from '../src/EtherlessContract/EthereumContract';
import BriefFunction from '../src/EtherlessContract/BriefFunction';

const ethers = require('ethers');

jest.mock('ethers');

const ESmart = require('../contracts/EtherlessSmart.json');

const contract = new ethers.Contract();

const ethereumContract : EtherlessContract = new EthereumContract(contract);

const briefFunction : BriefFunction = { name: 'f1', signature: '()', price: 10 };

/*
test('get all function', () => {
  (contract.getFuncList as jest.Mock).mockReturnValue(Promise.resolve(JSON.stringify(briefFunction)));
  expect(ethereumContract.getAllFunctions).resolves.toEqual(Array<BriefFunction>(briefFunction));
});*/

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
