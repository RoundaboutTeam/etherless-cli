import { Argv } from 'yargs';
import {
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

  description = 'Description:\n_\b  Deploy a function inside Etherless';

  private contract : EtherlessContract;

  private fileParser : FileParser;

  private fileManager : FileManager;

  /**
   * Edit command constructor
   * @param fileParser: instance of class implementing FileParser interface
   * @param fileManager: instance of class implementing FileManager interface
   * @param contract: instance of class implementing EtherlessContract interface
   * @param session: instance of class implementing UserSession interface
   */
  constructor(fileParser : FileParser, fileManager : FileManager,
    contract : EtherlessContract, session : UserSession) {
    super(session);
    this.contract = contract;
    this.fileParser = fileParser;
    this.fileManager = fileManager;
  }

  /**
   * @method exec
   * @param yargs: arguments nedded for the command
   * @description the command allows the user to deploy a function
   */
  async exec(args: any) : Promise<string> {
    // get the password to decrypt the wallet
    const password : string = await inquirer
      .prompt([{
        type: 'password',
        message: 'Enter the password to decrypt your wallet: ',
        name: 'password',
      }]).then((answer : any) => answer.password);

    // restore the wallet and connect to the contract instance
    const wallet : Wallet = await this.session.restoreWallet(password);
    this.contract.connect(wallet);

    // check if the function exists
    if (await this.contract.existsFunction(args.function_name)) {
      throw new Error('The name of the function is already used!');
    }

    // check if the function name respects the length limits
    if (args.function_name.length > 30) {
      throw new Error('The name must be at most 30 characters long!');
    }

    // check if the description respects the length limits
    if (args.description.length > 150) {
      throw new Error('The description must be at most 150 characters long!');
    }

    // check if the path provided by the user is a directory or file
    const isDir : boolean = fs.lstatSync(args.path).isDirectory();

    // get the source file path
    const sourcePath : string = isDir ? path.normalize(`${args.path}${path.sep}index.js`) : args.path;

    // get the function signature
    this.fileParser.parse(sourcePath);
    const signature : string = this.fileParser.getFunctionSignature(args.function_name);

    // obtain the source code of the function and the content of package.json
    // and package_lock.json files
    const sourceCode : string = fs.readFileSync(sourcePath).toString();
    const packageJSON : string = isDir
      ? fs.readFileSync(path.normalize(`${args.path}${path.sep}package.json`)).toString()
      : '';
    const packageJSONLock : string = isDir
      ? fs.readFileSync(path.normalize(`${args.path}${path.sep}package-lock.json`)).toString()
      : '';

    // create a function to store all deployment informations
    const deploymentInfo : DeployInfo = {
      dep: isDir,
      sourceCode,
      package: packageJSON,
      package_lock: packageJSONLock,
    };

    // upload the informations in IPFS
    console.log('Uploading file in IPFS');
    const CID : string = await this.fileManager.save(deploymentInfo);
    console.log(`File uploaded, cid: ${CID}`);

    // send deployment request
    const requestId : BigNumber = await this.contract.sendDeployRequest(
      args.function_name,
      signature,
      args.description,
      CID,
    );

    // wait for the result from the server
    const result : string = await this.contract.listenResponse(requestId);
    return JSON.parse(result).message;
  }

  /**
   * Descriptor of the command
   * @param yargs: object used to define the command params
   */
  builder(yargs : Argv) : any {
    return yargs.positional('function_name', {
      describe: 'Name of the function to deploy',
      type: 'string',
    }).positional('path', {
      describe: 'Relative path of the source file',
      type: 'string',
    }).positional('description', {
      describe: 'Description of the function to deploy',
      type: 'string',
    });
  }
}

export default DeployCommand;
