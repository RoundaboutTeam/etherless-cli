import { Argv } from 'yargs';
import { table } from 'table';

import Command from './Command';
import Function from '../EtherlessContract/Function';
import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';

const chalk = require('chalk');

class InfoCommand extends Command {
  command = 'info <function_name>';

  description = 'Description:\n_\b  Information of a specific function inside Etherless platform';

  private contract : EtherlessContract;

  /**
   * Info command constructor
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
   * @description the command returns all details about a specific function
   */
  async exec(args: any) : Promise<string> {
    // it is required that a user must be logged
    if (!this.session.isLogged()) {
      throw new Error('You must be logged to use this command');
    }

    try {
      // get details about the function from the smart contract
      const listInfo : Function = await this.contract.getFunctionInfo(args.function_name);

      // show data in a table
      const data = [
        [chalk.bold('Name'), listInfo.name],
        [chalk.bold('Owner'), listInfo.developer],
        [chalk.bold('Signature'), listInfo.signature],
        [chalk.bold('Price'), listInfo.price],
        [chalk.bold('Description'), listInfo.description],
      ];

      return table(data, {
        columns: {
          0: {
            width: 20,
          },
          1: {
            width: 50,
          },
        },
      });
    } catch (error) {
      // if the function doesn't exits, an error is thrown
      throw Error('The function you are looking for doesn not exist!');
    }
  }

  /**
   * Descriptor of the command
   * @param yargs: object used to define the command params
   */
  builder(yargs : Argv) : any {
    return yargs.positional('function_name', {
      describe: 'Name of the function you want to view details',
      type: 'string',
    });
  }
}

export default InfoCommand;

// R1F7.2
