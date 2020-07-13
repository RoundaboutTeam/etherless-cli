import { Argv } from 'yargs';
import Table from 'cli-table3';
import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';
import BriefFunction from '../EtherlessContract/BriefFunction';
import Command from './Command';

const table = new Table({
  head: ['Function', 'Price'],
  colWidths: [35, 10],
});

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
    table.push(...items);
    return table.toString();
  }

  builder(yargs : Argv) : any {
    return yargs.positional('keyword', {
      describe: 'Keyword to find inside functions name',
      type: 'string',
    });
  }
}

export default SearchCommand;
