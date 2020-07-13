import { Argv } from 'yargs';
import {
  ethers,
  Contract,
  getDefaultProvider,
  EventFilter,
  Wallet,
} from 'ethers';
import { BigNumber } from 'ethers/utils';
import * as inquirer from 'inquirer';
import DeployInfo from '../IPFS/DeployInfo';

import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';

import Command from './Command';
import FileParser from '../FileParser/FileParser';
import FileManager from '../IPFS/FileManager';

const fs = require('fs');
const path = require('path');

class DeployCommand extends Command {
  command = 'deploy <function_name> <path> <description>';

  description = 'deploy a function';

  private contract : EtherlessContract;

  private fileParser : FileParser;

  private fileManager : FileManager;

  constructor(fileParser : FileParser, fileManager : FileManager,
    contract : EtherlessContract, session : UserSession) {
    super(session);
    this.contract = contract;
    this.fileParser = fileParser;
    this.fileManager = fileManager;
  }

  async exec(args: any) : Promise<string> {
    const password : string = await inquirer
      .prompt([{
        type: 'password',
        message: 'Enter the password to decrypt your wallet: ',
        name: 'password',
      }]).then((answer : any) => answer.password);

    const wallet : Wallet = await this.session.restoreWallet(password);
    this.contract.connect(wallet);

    if (await this.contract.existsFunction(args.function_name)) {
      throw new Error('The name of the function is already used!');
    }

    if (args.function_name.length > 30) {
      throw new Error('The name must be at most 30 characters long!');
    }

    if (args.description.length > 150) {
      throw new Error('The description must be at most 150 characters long!');
    }

    const isDir : boolean = fs.lstatSync(args.path).isDirectory();
    const sourcePath : string = isDir ? path.normalize(`${args.path}${path.sep}index.js`) : args.path;

    this.fileParser.parse(sourcePath);
    const signature : string = this.fileParser.getFunctionSignature(args.function_name);

    const sourceCode : string = fs.readFileSync(sourcePath).toString();
    const packageJSON : string = isDir
      ? fs.readFileSync(path.normalize(`${args.path}${path.sep}package.json`)).toString()
      : '';
    const packageJSONLock : string = isDir
      ? fs.readFileSync(path.normalize(`${args.path}${path.sep}package-lock.json`)).toString()
      : '';

    const deploymentInfo : DeployInfo = {
      dep: isDir,
      sourceCode,
      package: packageJSON,
      package_lock: packageJSONLock,
    };

    console.log('Uploading file in IPFS');
    const CID : string = await this.fileManager.save(deploymentInfo);
    console.log(`File uploaded, cid: ${CID}`);

    const requestId : BigNumber = await this.contract.sendDeployRequest(
      args.function_name,
      signature,
      args.description,
      CID,
    );

    const result : string = await this.contract.listenResponse(requestId);
    return JSON.parse(result).message;
  }

  builder(yargs : Argv) : any {
    return yargs.positional('function_name', {
      describe: 'Name of the function to deploy',
      type: 'string',
    }).positional('path', {
      describe: 'relative path of the source file',
      type: 'string',
    }).positional('description', {
      describe: 'Description of the function to deploy',
      type: 'string',
    });
  }
}

export default DeployCommand;
