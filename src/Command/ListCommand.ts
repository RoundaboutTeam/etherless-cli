import { Argv } from 'yargs';
import Table from 'cli-table3';
import Command from './Command';
import BriefFunction from '../EtherlessContract/BriefFunction';
import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';

// instantiate
const table = new Table({
  head: ['Function', 'Price'],
  colWidths: [35, 10],
});

class ListCommand extends Command {
  command = 'list [m]';

  description = 'list functions inside Etherless platform';

  private contract : EtherlessContract;

  constructor(contract : EtherlessContract, session : UserSession) {
    super(session);
    this.contract = contract;
  }

  async exec(args: any) : Promise<string> {
    const address : string = this.session.getAddress();

    const list : Array<BriefFunction> = args.m
      ? await this.contract.getMyFunctions(address)
      : await this.contract.getAllFunctions();

    if (list.length === 0) {
      return 'No function found';
    }

    const values = list.map((item : BriefFunction) => [item.name + item.signature, item.price]);
    table.push(...values);
    return table.toString();
  }

  builder(yargs : Argv) : any {
    return yargs.option('m', {
      describe: 'Display only functions owns by the current user',
      type: 'boolean',
      default: false,
    });
  }
}

export default ListCommand;
