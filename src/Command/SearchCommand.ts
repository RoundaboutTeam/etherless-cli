import { Argv } from 'yargs';
import { table } from 'table';

import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';
import BriefFunction from '../EtherlessContract/BriefFunction';
import Command from './Command';

const chalk = require('chalk');

class SearchCommand extends Command {
  command = 'search <keyword>';

  description = 'list all functions having a keyword inside their name';

  private contract : EtherlessContract;

  constructor(contract : EtherlessContract, session : UserSession) {
    super(session);
    this.contract = contract;
  }

  async exec(args: any) : Promise<string> {
    const list : Array<BriefFunction> = await this.contract.getAllFunctions();
    const filteredList : Array<BriefFunction> = list.filter(
      (item : BriefFunction) => item.name.includes(args.keyword),
    );

    if (filteredList.length === 0) return 'No function found';

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
