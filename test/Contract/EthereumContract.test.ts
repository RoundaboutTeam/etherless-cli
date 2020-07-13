import { bigNumberify } from 'ethers/utils';

import EtherlessContract from '../../src/EtherlessContract/EtherlessContract';
import EthereumContract from '../../src/EtherlessContract/EthereumContract';
import BriefFunction from '../../src/EtherlessContract/BriefFunction';

const ethers = require('ethers');

jest.mock('ethers');

const ESmart = require('../../contracts/EtherlessSmart.json');

const contract = new ethers.Contract();
Object.defineProperty(contract, 'interface', {
  value: {
    parseLog: jest.fn().mockImplementation(() => ({
      values: {
        id: {
          value: 0,
          eq: jest.fn().mockReturnValue(true),
        },
        funcname: 'mockedFunc',
        param: 'params',
        result: JSON.stringify({ message: 'mocked result message' }),
      },
    })),
  },
});

Object.defineProperty(contract, 'provider', {
  value: {
    getLogs: jest.fn().mockImplementation(() => [
      {
        blockHash: 'mockedBlockHash',
      },
    ]),
    getBlock: jest.fn().mockImplementation(() => ({
      timestamp: '123456789',
    })),
  },
});

Object.defineProperty(contract, 'filters', {
  value: {
    resultOk: jest.fn().mockReturnValue({
      fromBlock: '',
      toBlock: '',
    }),
    resultError: jest.fn().mockReturnValue({
      fromBlock: '',
      toBlock: '',
    }),
    runRequest: jest.fn().mockReturnValue({
      fromBlock: '',
      toBlock: '',
    }),
  },
});

const ethereumContract : EthereumContract = new EthereumContract(contract);

const briefFunction : BriefFunction = { name: 'f1', signature: '()', price: 10 };

const address : string = '0x1611Ef4B1A22ff3f3fF62Fd86b9059e3679b6212';

test('get all function', async () => {
  (contract.getFuncList as jest.Mock)
    .mockReturnValue(
      Promise.resolve(
        `{"functionArray": [${JSON.stringify(briefFunction)}]}`,
      ),
    );
  const result = await ethereumContract.getAllFunctions();
  expect(result).toEqual(Array<BriefFunction>(briefFunction));
});

test('get all functions owned', async () => {
  (contract.getOwnedList as jest.Mock)
    .mockReturnValue(
      Promise.resolve(
        `{"functionArray": [${JSON.stringify(briefFunction)}]}`,
      ),
    );

  const result = await ethereumContract.getMyFunctions(address);
  expect(result).toEqual(Array<BriefFunction>(briefFunction));
});

test('get function info', async () => {
  (contract.getInfo as jest.Mock)
    .mockReturnValue(
      Promise.resolve(
        JSON.stringify(briefFunction),
      ),
    );

  const result = await ethereumContract.getFunctionInfo('functionName');
  expect(result).toEqual(briefFunction);
});

test('connect wallet test', async () => {
  (contract.connect as jest.Mock)
    .mockReturnValue(
      contract,
    );

  expect(() => ethereumContract.connect(new ethers.Wallet())).not.toThrowError();
});

test('get past execution list', async () => {
  expect(ethereumContract.getExecHistory('mockedAddress')).resolves.toBeDefined();
});

test('send run request: error function not exists', async () => {
  (contract.getInfo as jest.Mock)
    .mockReturnValueOnce(
      new Error('mocked error'),
    );

  expect(ethereumContract.sendRunRequest('foo', 'params'))
    .rejects.toEqual(Error("The function you're looking for does not exist!"));
});

test('send run request: error wrong number of params', async () => {
  (contract.getInfo as jest.Mock)
    .mockReturnValueOnce(
      JSON.stringify({ signature: '(num1, num2)' }),
    );

  expect(ethereumContract.sendRunRequest('foo', '(1, 2, 3)'))
    .rejects.toEqual(Error('The number of parameters is not correct!'));
});

test('send run request: error wrong number of params', async () => {
  (contract.getInfo as jest.Mock)
    .mockReturnValue(
      Promise.resolve(
        JSON.stringify(briefFunction),
      ),
    );

  expect(ethereumContract.sendRunRequest('f1', '()')).resolves.not.toThrowError();
});


test('send delete request: error function not exists', async () => {
  (contract.getInfo as jest.Mock)
    .mockReturnValueOnce(
      new Error('mocked error'),
    );

  expect(ethereumContract.sendDeleteRequest('foo'))
    .rejects.toEqual(Error("The function you're looking for does not exist!"));
});

test('send delete request: error function not exists', async () => {
  (contract.getInfo as jest.Mock)
    .mockReturnValueOnce(
      Promise.resolve(
        JSON.stringify(briefFunction),
      ),
    );

  expect(ethereumContract.sendDeleteRequest('foo'))
    .rejects.toEqual(Error('You are not the owner of the function!'));
});

/*
test('send delete request', () => {
  expect(ethereumContract.sendDeleteRequest('funcName')).resolves.toBeDefined();
});

test('update description', () => {

});

test('send deploy request', () => {
  expect(ethereumContract.sendDeployRequest('funcName', 'funcSignature', 'funcDesc', 'funcCid')).resolves.toBeDefined();
});
*/

test('listen response', () => {
  expect(ethereumContract.listenResponse(bigNumberify(10))).resolves.toBeDefined();
});

