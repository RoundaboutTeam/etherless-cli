import { bigNumberify } from 'ethers/utils';
import * as fs from 'fs';
import Configstore from 'configstore';
import DeployCommand from '../../src/Command/DeployCommand';
import EthereumContract from '../../src/EtherlessContract/EthereumContract';
import EthereumUserSession from '../../src/Session/EthereumUserSession';
import JSFileParser from '../../src/FileParser/JSFileParser';
import IPFSFileManager from '../../src/IPFS/IPFSFileManager';

jest.mock('../../src/EtherlessContract/EthereumContract');
jest.mock('../../src/Session/EthereumUserSession');
jest.mock('../../src/FileParser/JSFileParser');
jest.mock('../../src/IPFS/IPFSFileManager');
jest.mock('ethers');
jest.mock('yargs');
jest.mock('configstore');
jest.mock('inquirer');

const inquirer = require('inquirer');

inquirer.prompt = jest.fn().mockReturnValue(Promise.resolve('password'));

const ethers = require('ethers');

let yargs = require('yargs');

yargs = jest.fn().mockImplementation(() => {});
yargs.positional = jest.fn().mockReturnValue(yargs);
yargs.option = jest.fn().mockReturnValue(yargs);

jest.mock('ipfs-mini');
const IPFS = require('ipfs-mini');

const ipfsMiniMock = new IPFS.Ipfs();
const fileManager = new IPFSFileManager(ipfsMiniMock);

const contract = new ethers.Contract();

const pkg = require('../../package.json');

const cfgStore = new Configstore(pkg.name);

const ethereumContract = new EthereumContract(contract);
const ethereumUserSession = new EthereumUserSession(
  cfgStore,
  ethers.getDefaultProvider('ropsten'),
);

const fileParser = new JSFileParser();

const command = new DeployCommand(fileParser, fileManager, ethereumContract, ethereumUserSession);

beforeAll(() => {
  fs.writeFileSync('mockedSourceFile.js', 'function foo() {}');
});

test('check builder', () => {
  expect(command.builder(yargs)).toBeDefined();
});

test('get command syntax', () => {
  expect(command.getCommand()).toBe('deploy <function_name> <path> <description>');
});

test('get command description', () => {
  expect(command.getDescription()).toBe('Description:\n_\b  Deploy a function inside Etherless');
});

test('deploy: error function already exists', async () => {
  ethereumContract.connect = jest.fn().mockReturnValue(null);
  ethereumUserSession.restoreWallet = jest.fn().mockReturnValue(Promise.resolve({}));
  ethereumContract.existsFunction = jest.fn().mockReturnValueOnce(true);

  expect(command.exec({ function_name: 'functionName' }))
    .rejects.toStrictEqual(Error('The name of the function is already used!'));
});

test('deploy: error name too long', async () => {
  ethereumContract.connect = jest.fn().mockReturnValue(null);
  ethereumUserSession.restoreWallet = jest.fn().mockReturnValue(Promise.resolve({}));
  ethereumContract.existsFunction = jest.fn().mockReturnValueOnce(false);

  expect(command.exec({ function_name: 'A'.repeat(100) }))
    .rejects.toStrictEqual(Error('The name must be at most 30 characters long!'));
});

test('deploy: error description too long', async () => {
  ethereumContract.connect = jest.fn().mockReturnValue(null);
  ethereumUserSession.restoreWallet = jest.fn().mockReturnValue(Promise.resolve({}));
  ethereumContract.existsFunction = jest.fn().mockReturnValueOnce(false);

  expect(command.exec({ function_name: 'functionName', description: 'A'.repeat(160) }))
    .rejects.toStrictEqual(Error('The description must be at most 150 characters long!'));
});

test('test command execution', async () => {
  ethereumContract.connect = jest.fn().mockReturnValue(null);
  ethereumUserSession.restoreWallet = jest.fn().mockReturnValue(Promise.resolve({}));
  ethereumContract.sendDeployRequest = jest.fn().mockReturnValue(Promise.resolve(bigNumberify(1)));
  ethereumContract.listenResponse = jest.fn().mockReturnValue(
    Promise.resolve(JSON.stringify({ message: 'result message' })),
  );
  fileManager.save = jest.fn().mockReturnValue('mocked cid');
  fileParser.parse = jest.fn().mockImplementationOnce(() => {});
  fileParser.getFunctionSignature = jest.fn().mockReturnValueOnce('(p1, p2)');

  expect(command.exec({
    function_name: 'functionName',
    path: 'mockedSourceFile.js',
    description: 'mockDescription',
  })).resolves.not.toThrowError();
});

afterAll(() => {
  fs.unlinkSync('mockedSourceFile.js');
});
