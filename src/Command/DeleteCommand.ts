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

class DeleteCommand extends Command {
  command = 'delete <function_name>';

  description = 'Description:\n_\b  Delete a function you own inside Etherless';

  private contract : EtherlessContract;

  /**
   * Delete command constructor
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
   * @description the command deletes the function indicated by the user,
   * if an error occurs, a corresponding exception will be thrown
   */
  async exec(args: any) : Promise<string> {
    const password : string = await inquirer
      .prompt([{
        type: 'password',
        message: 'Enter the password to decrypt your wallet: ',
        name: 'password',
      }]).then((answer : any) => answer.password);

    // restore and connect to the wallet
    const wallet : Wallet = await this.session.restoreWallet(password);
    this.contract.connect(wallet);

    // send deletion request
    const requestId : BigNumber = await this.contract.sendDeleteRequest(
      args.function_name,
    );

    // wait for the server result
    const result : string = await this.contract.listenResponse(requestId);
    return JSON.parse(result).message;
  }

  /**
   * Descriptor of the command
   * @param yargs: object used to define the command params
   */
  builder(yargs : Argv) : any {
    return yargs.positional('function_name', {
      describe: 'Name of the function to delete',
      type: 'string',
    });
  }
}

export default DeleteCommand;
