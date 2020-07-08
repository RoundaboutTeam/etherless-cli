import { Argv } from 'yargs';
import Command from './Command';
import Function from '../EtherlessContract/Function';
import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';

const Table = require('cli-table');

class InfoCommand extends Command {
  command = 'info <function_name>';

  description = 'info of a specific function inside Etherless platform';

  private contract : EtherlessContract;

  constructor(contract : EtherlessContract, session : UserSession) {
    super(session);
    this.contract = contract;
  }

  async exec(args: any) : Promise<string> {
    if (!this.session.isLogged()) {
      throw new Error('You must be logged to use this command');
    }

    const listInfo : Function = await this.contract.getFunctionInfo(args.function_name);

    const table = new Table();
    table.push(
      { Name: listInfo.name },
      { Owner: listInfo.developer },
      { Signature: listInfo.signature },
      { Price: listInfo.price },
      { Description: listInfo.description },
    );

    return table.toString();
  }

  builder(yargs : Argv) : any {
    return yargs.positional('function_name', {
      describe: 'Name of the function you want to view informations',
      type: 'string',
    });
  }
}

export default InfoCommand;
