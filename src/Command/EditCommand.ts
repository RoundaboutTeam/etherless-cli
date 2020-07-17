import { Argv } from 'yargs';
import {
  Wallet,
} from 'ethers';
import { BigNumber } from 'ethers/utils';
import * as inquirer from 'inquirer';

import DeployInfo from '../IPFS/DeployInfo';
import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';
import Function from '../EtherlessContract/Function';

import Command from './Command';
import FileParser from '../FileParser/FileParser';
import FileManager from '../IPFS/FileManager';

const fs = require('fs');
const path = require('path');

class EditCommand extends Command {
  command = 'edit <function_name> [s] [d]';

  description = 'Description:\n_\b  Edit a function you deployed';

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
   * @description the command allows the user to modify the source code and
   *  description of an owned function
   */
  async exec(args: any) : Promise<any> {
    // get the password to decrypt the wallet
    const password : string = await inquirer
      .prompt([{
        type: 'password',
        message: 'Enter the password to decrypt your wallet: ',
        name: 'password',
      }]).then((answer : any) => answer.password);

    // restore the wallet and connect it to the contract instance
    const wallet : Wallet = await this.session.restoreWallet(password);
    this.contract.connect(wallet);

    // check if the function exists and get its details
    let listInfo : Function;
    try {
      listInfo = await this.contract.getFunctionInfo(args.function_name);
    } catch (error) {
      // if the function doesn't exist an error is thrown
      throw new Error("The function you're looking for does not exist! :'(");
    }

    // if the current user is not the owner of the function, an error is shown
    if (!(this.session.getAddress().toUpperCase() === listInfo.developer.toUpperCase())) {
      throw new Error('You are not the owner of the function!');
    }

    let commandOutput = '';
    if (args.s) {
      // check if the path indicated on the cli is a file or directory
      const isDir : boolean = fs.lstatSync(args.s).isDirectory();

      // get the function source file path
      const sourcePath : string = isDir ? path.normalize(`${args.s}${path.sep}index.js`) : args.s;

      // get the function signature
      this.fileParser.parse(sourcePath);
      const signature : string = this.fileParser.getFunctionSignature(args.function_name);

      // get the funtion source code, package.json and package_lock.json
      const sourceCode : string = fs.readFileSync(sourcePath).toString();
      const packageJSON : string = isDir
        ? fs.readFileSync(path.normalize(`${args.s}${path.sep}package.json`)).toString()
        : '';
      const packageJSONLock : string = isDir
        ? fs.readFileSync(path.normalize(`${args.s}${path.sep}package-lock.json`)).toString()
        : '';

      // create a structure to store all deployment information
      const deploymentInfo : DeployInfo = {
        dep: isDir,
        sourceCode,
        package: packageJSON,
        package_lock: packageJSONLock,
      };

      // upload the information to IPFS
      console.log('Uploading file in IPFS');
      const CID : string = await this.fileManager.save(deploymentInfo);
      console.log(`File uploaded, cid: ${CID}`);

      // request to upload the function source code
      const requestId : BigNumber = await this.contract.sendCodeUpdateRequest(
        args.function_name,
        signature,
        CID,
      );

      // wait for the result of the edit
      const result : string = await this.contract.listenResponse(requestId);
      commandOutput += `${JSON.parse(result).message}\n`;
    }

    if (args.d) {
      // request to modify the description and wait until it happend
      await this.contract.updateDesc(args.function_name, args.d);
      commandOutput += 'Description updated correctly\n';
    }

    return commandOutput;
  }

  /**
   * Descriptor of the command
   * @param yargs: object used to define the command params
   */
  builder(yargs : Argv) : any {
    return yargs.positional('function_name', {
      describe: 'Name of the function to edit',
      type: 'string',
    }).option('s', {
      describe: 'relative path of the source file',
      type: 'string',
    }).option('d', {
      describe: 'description of the function you want to edit',
      type: 'string',
    });
  }
}

export default EditCommand;
