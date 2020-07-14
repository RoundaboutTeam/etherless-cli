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

  constructor(contract : EtherlessContract, session : UserSession) {
    super(session);
    this.contract = contract;
  }

  async exec(args: any) : Promise<string> {
    const address : string = await this.session.getAddress();
    let history : Array<HistoryItem> = await this.contract.getExecHistory(address);

    if (history.length === 0) return 'No past executions found';

    history.sort((a, b) => (parseInt(a.id) > parseInt(b.id) ? -1 : 1));
    if (args.limit && args.limit > 0) history = history.slice(0, args.limit);

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

  builder(yargs : Argv) : any {
    return yargs.option('limit', {
      describe: 'Maximum number of item to show',
      type: 'number',
    });
  }
}

export default HistoryCommand;
