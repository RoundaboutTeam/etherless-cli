import { Argv } from 'yargs';
import { table } from 'table';

import Command from './Command';
import BriefFunction from '../EtherlessContract/BriefFunction';
import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';

const chalk = require('chalk');

class ListCommand extends Command {
  command = 'list [m]';

  description = 'list functions inside Etherless platform';

  private contract : EtherlessContract;

  /**
   * List command constructor
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
   * @description the command returns a list of function. If the -m
   *  flag is defined, it returns the list of function owned by the current
   *  user, otherwise a list of all functions inside the platform.
   */
  async exec(args: any) : Promise<string> {
    const address : string = this.session.getAddress();

    // check if the -m flag is defined and get the corrisponding list of function
    const list : Array<BriefFunction> = args.m
      ? await this.contract.getMyFunctions(address)
      : await this.contract.getAllFunctions();

    // if the list is empty
    if (list.length === 0) {
      return 'No function found';
    }

    // otherwise, a table with function details is returned
    const values = list.map((item : BriefFunction) => [item.name + item.signature, item.price]);
    values.unshift([chalk.bold('Function'), chalk.bold('Price')]);
    return table(values, {
      columns: {
        0: {
          width: 30,
        },
        1: {
          alignment: 'center',
          width: 5,
        },
      },
    });
  }

  /**
   * Descriptor of the command
   * @param yargs: object used to define the command params
   */
  builder(yargs : Argv) : any {
    return yargs.option('m', {
      describe: 'Display only functions owns by the current user',
      type: 'boolean',
      default: false,
    });
  }
}

export default ListCommand;
