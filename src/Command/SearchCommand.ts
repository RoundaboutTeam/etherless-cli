import { Argv } from 'yargs';
import { table } from 'table';

import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';
import BriefFunction from '../EtherlessContract/BriefFunction';
import Command from './Command';

const chalk = require('chalk');

class SearchCommand extends Command {
  command = 'search <keyword>';

  description = 'Description:\n_\b  List all functions having a keyword inside their name';

  private contract : EtherlessContract;

  /**
   * Search command constructor
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
   * @description the command looks for functions in the platform that contain
   *  a keyword inside their name
   */
  async exec(args: any) : Promise<string> {
    // get all functions from the contract
    const list : Array<BriefFunction> = await this.contract.getAllFunctions();

    // filter the functions by the keyword
    const filteredList : Array<BriefFunction> = list.filter(
      (item : BriefFunction) => item.name.includes(args.keyword),
    );

    // if there are no function found, return a message
    if (filteredList.length === 0) return 'No function found';

    // otherwise, a table with all details is created
    const items = filteredList
      .map((item : BriefFunction) => [item.name + item.signature, item.price]);
    items.unshift([chalk.bold('Function'), chalk.bold('Price')]);
    return table(items, {
      columns: {
        0: {
          width: 30,
        },
        1: {
          width: 5,
          alignment: 'center',
        },
      },
    });
  }

  builder(yargs : Argv) : any {
    return yargs.positional('keyword', {
      describe: 'Keyword to find inside functions name',
      type: 'string',
    });
  }
}

export default SearchCommand;
