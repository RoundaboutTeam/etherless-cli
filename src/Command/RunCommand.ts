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

import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';

import Command from './Command';

class RunCommand extends Command {
  command = 'run <function_name> [params..]';

  description = 'execute a function';

  private contract : EtherlessContract;

  /**
   * Run command constructor
   * @param contract: instance of class implementing EtherlessContract interface
   * @param session: instance of class implementing UserSession interface
   */
  constructor(contract : EtherlessContract, session : UserSession) {
    super(session);
    this.contract = contract;
  }

  /**
   * @method exec
   * @param yargs: arguments nedded for the command
   * @description the command executes the considered function using
   *  the parameters indicated by the user
   */
  async exec(args: any) : Promise<string> {
    // request the password to decrypt the wallet
    const password : string = await inquirer
      .prompt([{
        type: 'password',
        message: 'Enter the password to decrypt your wallet: ',
        name: 'password',
      }]).then((answer : any) => answer.password);

    // restore the wallet and connect it to the cotract instance
    const wallet : Wallet = await this.session.restoreWallet(password);
    this.contract.connect(wallet);

    // send the run request
    const requestId : BigNumber = await this.contract.sendRunRequest(
      args.function_name,
      args.params.toString(),
    );

    // return the message received from the server
    const result : string = await this.contract.listenResponse(requestId);
    return JSON.parse(result).message;
  }

  /**
   * Descriptor of the command
   * @param yargs: object used to define the command params
   */
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
