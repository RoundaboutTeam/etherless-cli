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

  description = 'edit a function you deployed';

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

  async exec(args: any) : Promise<any> {
    const password : string = await inquirer
      .prompt([{
        type: 'password',
        message: 'Enter the password to decrypt your wallet: ',
        name: 'password',
      }]).then((answer : any) => answer.password);

    const wallet : Wallet = await this.session.restoreWallet(password);
    this.contract.connect(wallet);

    // CHECK IF FUNCTION EXISTS
    let listInfo : Function;
    try {
      listInfo = await this.contract.getFunctionInfo(args.function_name);
    } catch (error) {
      throw new Error("The function you're looking for does not exist! :'(");
    }

    if (!(this.session.getAddress().toUpperCase() === listInfo.developer.toUpperCase())) {
      throw new Error('You are not the owner of the function!');
    }

    let commandOutput = '';
    if (args.s) {
      const isDir : boolean = fs.lstatSync(args.s).isDirectory();
      const sourcePath : string = isDir ? path.normalize(`${args.s}${path.sep}index.js`) : args.s;

      this.fileParser.parse(sourcePath);
      const signature : string = this.fileParser.getFunctionSignature(args.function_name);

      const sourceCode : string = fs.readFileSync(sourcePath).toString();
      const packageJSON : string = isDir
        ? fs.readFileSync(path.normalize(`${args.s}${path.sep}package.json`)).toString()
        : '';
      const packageJSONLock : string = isDir
        ? fs.readFileSync(path.normalize(`${args.s}${path.sep}package-lock.json`)).toString()
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

      const requestId : BigNumber = await this.contract.sendCodeUpdateRequest(
        args.function_name,
        signature,
        CID,
      );

      const result : string = await this.contract.listenResponse(requestId);
      commandOutput += `${JSON.parse(result).message}\n`;
    }

    if (args.d) {
      await this.contract.updateDesc(args.function_name, args.d);
      commandOutput += 'Description updated correctly\n';
    }
    return commandOutput;
  }

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
