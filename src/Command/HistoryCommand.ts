import { Argv } from 'yargs';
import Table from 'cli-table';

import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';
import HistoryItem from '../EtherlessContract/HistoryItem';

import Command from './Command';

const table = new Table({
  head: ['Id', 'Date', 'Request', 'Result'],
  // colWidths: [5, 20, 20, 10],
});


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

    if (args.limit && args.limit > 0) history = history.slice(0, args.limit);

    if (history.length === 0) return 'No past executions found';

    history.sort((a, b) => (parseInt(a.id) > parseInt(b.id) ? 1 : -1));
    const values = history.map(
      (item : HistoryItem) => [item.id, item.date, `${item.name}(${item.params})`, item.result],
    );
    table.push(...values);
    return table.toString();
  }

  builder(yargs : Argv) : any {
    return yargs.option('limit', {
      describe: 'Maximum number of item to show',
      type: 'number',
    });
  }
}

export default HistoryCommand;
