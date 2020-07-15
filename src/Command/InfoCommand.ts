import { Argv } from 'yargs';
import { table } from 'table';

import Command from './Command';
import Function from '../EtherlessContract/Function';
import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';

const chalk = require('chalk');

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

    try {
      const listInfo : Function = await this.contract.getFunctionInfo(args.function_name);
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
      throw Error('The function you are looking for doesn not exist!');
    }
  }

  builder(yargs : Argv) : any {
    return yargs.positional('function_name', {
      describe: 'Name of the function you want to view informations',
      type: 'string',
    });
  }
}

export default InfoCommand;

// R1F7.2
