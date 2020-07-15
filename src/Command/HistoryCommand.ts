import { Argv } from 'yargs';
import { table } from 'table';

import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';
import HistoryItem from '../EtherlessContract/HistoryItem';

import Command from './Command';

const chalk = require('chalk');

class HistoryCommand extends Command {
  command = 'history [limit]';

  description = 'get a list of your past executions';

  private contract : EtherlessContract;

  /**
   * History command constructor
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
   * @description the command returns a list of all past executions of the current user
   */
  async exec(args: any) : Promise<string> {
    // get the address of the current user
    const address : string = await this.session.getAddress();

    // get all past request (and result)
    let history : Array<HistoryItem> = await this.contract.getExecHistory(address);

    // if the are no past request, a message is shown
    if (history.length === 0) return 'No past executions found';

    // sort the request by id
    history.sort((a, b) => (parseInt(a.id) > parseInt(b.id) ? -1 : 1));

    // if the user has indicate a maximum limit of request, some request are removed
    if (args.limit && args.limit > 0) history = history.slice(0, args.limit);

    // create a table with all information
    const values = history.map(
      (item : HistoryItem) => [item.id.toString(), item.date, `${item.name}(${item.params})`, item.result],
    );
    values.unshift([chalk.bold('Id'), chalk.bold('Date'), chalk.bold('Request'), chalk.bold('Result')]);
    return table(values, {
      columns: {
        0: {
          width: 5,
        },
        1: {
          width: 20,
        },
        2: {
          width: 20,
        },
        3: {
          width: 20,
        },
      },
    });
  }

  /**
   * Descriptor of the command
   * @param yargs: object used to define the command params
   */
  builder(yargs : Argv) : any {
    return yargs.option('limit', {
      describe: 'Maximum number of item to show',
      type: 'number',
    });
  }
}

export default HistoryCommand;
