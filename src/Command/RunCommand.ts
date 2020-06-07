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

import Command from './Command';
import EtherlessManager from '../Manager/EtherlessManager';

class RunCommand extends Command {
  command = 'run <function_name> [params..]';

  description = 'execute a function ';

  async exec(args: any) : Promise<any> {

    const password : string = await inquirer
      .prompt([{
        type: 'password',
        message: 'Enter the password to decrypt your wallet: ',
        name: 'password',
      }]).then((answer : any) => answer.password);

    return this.ethManager.runFunction(args.function_name, args.params.toString(), password);
  }

  builder(yargs : Argv) : any {
    return yargs.positional('function_name', {
      describe: 'Name of the function to execute',
      type: 'string',
    }).option('params', {
      describe: 'Array of params to use for the execution',
      type: 'array',
    });
  }
}

export default RunCommand;
